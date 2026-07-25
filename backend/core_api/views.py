from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .content_studio import generate_poster_image
from .models import (
    Bundle,
    BundleRedemption,
    Event,
    GalleryImage,
    Offering,
    Poster,
    SocialEngagementLog,
)
from .serializers import (
    BundleRedemptionSerializer,
    BundleSerializer,
    EventSerializer,
    GalleryImageSerializer,
    OfferingSerializer,
    PosterSerializer,
    SocialEngagementLogSerializer,
)


class SecureTokenObtainPairView(TokenObtainPairView):
    """Custom token view that sets JWT tokens in httpOnly cookies."""

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            # Set tokens in httpOnly cookies
            response.set_cookie(
                'access_token',
                access_token,
                max_age=8 * 3600,  # 8 hours
                httponly=True,
                secure=True,
                samesite='Strict',
            )
            response.set_cookie(
                'refresh_token',
                refresh_token,
                max_age=7 * 24 * 3600,  # 7 days
                httponly=True,
                secure=True,
                samesite='Strict',
            )

            # Don't return tokens in response body for security
            response.data = {'detail': 'Login successful'}

        return response


class SecureTokenRefreshView(TokenRefreshView):
    """Custom refresh token view that uses httpOnly cookies."""

    def post(self, request, *args, **kwargs):
        # Get refresh token from cookie instead of request body
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh', refresh_token)

            # Update access token cookie
            response.set_cookie(
                'access_token',
                access_token,
                max_age=8 * 3600,
                httponly=True,
                secure=True,
                samesite='Strict',
            )

            # Optionally update refresh token
            if refresh_token:
                response.set_cookie(
                    'refresh_token',
                    refresh_token,
                    max_age=7 * 24 * 3600,
                    httponly=True,
                    secure=True,
                    samesite='Strict',
                )

            response.data = {'detail': 'Token refreshed'}

        return response


class LogoutView(APIView):
    """Clear authentication cookies."""

    def post(self, request):
        response = Response({'detail': 'Logged out successfully'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class OfferingViewSet(viewsets.ModelViewSet):
    serializer_class = OfferingSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        qs = Offering.objects.all()
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_available=True)
        unit = self.request.query_params.get('unit')
        if unit:
            qs = qs.filter(unit=unit)
        return qs


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        qs = Event.objects.all()
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_published=True)
        return qs

    @action(detail=False, methods=['get'])
    def happening_now(self, request):
        now = timezone.now()
        qs = self.get_queryset().filter(
            is_published=True, start_datetime__lte=now, end_datetime__gte=now,
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class BundleViewSet(viewsets.ModelViewSet):
    serializer_class = BundleSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Bundle.objects.all()
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs


class BundleRedemptionViewSet(viewsets.ModelViewSet):
    serializer_class = BundleRedemptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = BundleRedemption.objects.all()

    def perform_create(self, serializer):
        serializer.save(redeemed_by=self.request.user)


class GalleryImageViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryImageSerializer
    permission_classes = [IsStaffOrReadOnly]
    queryset = GalleryImage.objects.all()

    def get_queryset(self):
        qs = GalleryImage.objects.all()
        unit = self.request.query_params.get('unit')
        if unit:
            qs = qs.filter(unit=unit)
        return qs


class PosterViewSet(viewsets.ModelViewSet):
    serializer_class = PosterSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Poster.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        poster = self.get_object()
        generate_poster_image(poster)
        serializer = self.get_serializer(poster)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        poster = self.get_object()
        if not poster.generated_image:
            return Response(
                {'detail': 'Generate the poster before publishing it.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        poster.status = 'published'
        poster.published_at = timezone.now()
        poster.save(update_fields=['status', 'published_at'])
        serializer = self.get_serializer(poster)
        return Response(serializer.data)


class SocialEngagementLogViewSet(viewsets.ModelViewSet):
    serializer_class = SocialEngagementLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = SocialEngagementLog.objects.all()

    def perform_create(self, serializer):
        serializer.save(logged_by=self.request.user)


class AnalyticsSummaryView(APIView):
    """Business-intelligence rollup for the admin dashboard: bundle ROI + social trends."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        bundle_performance = list(
            Bundle.objects.annotate(
                redemption_count=Count('redemptions'),
                total_revenue=Sum('redemptions__revenue_amount'),
            ).values('id', 'name', 'redemption_count', 'total_revenue')
        )

        social_by_unit = list(
            SocialEngagementLog.objects.values('unit').annotate(
                total_reach=Sum('reach'),
                total_engagement=Sum('engagement'),
            )
        )

        return Response({
            'bundle_performance': bundle_performance,
            'social_by_unit': social_by_unit,
            'generated_at': timezone.now(),
        })

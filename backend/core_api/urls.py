from rest_framework.routers import DefaultRouter

from .views import (
    AnalyticsSummaryView,
    BundleRedemptionViewSet,
    BundleViewSet,
    EventViewSet,
    GalleryImageViewSet,
    OfferingViewSet,
    PosterViewSet,
    SocialEngagementLogViewSet,
)
from django.urls import path

router = DefaultRouter()
router.register('offerings', OfferingViewSet, basename='offering')
router.register('events', EventViewSet, basename='event')
router.register('bundles', BundleViewSet, basename='bundle')
router.register('redemptions', BundleRedemptionViewSet, basename='redemption')
router.register('gallery', GalleryImageViewSet, basename='gallery-image')
router.register('posters', PosterViewSet, basename='poster')
router.register('social-logs', SocialEngagementLogViewSet, basename='social-log')

urlpatterns = router.urls + [
    path('analytics/summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
]

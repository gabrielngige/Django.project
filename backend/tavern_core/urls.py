from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from core_api.views import SecureTokenObtainPairView, SecureTokenRefreshView, LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', SecureTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', SecureTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/', include('core_api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

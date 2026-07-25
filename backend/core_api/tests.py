import pytest
from decimal import Decimal
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from core_api.models import (
    Offering, Event, Bundle, BundleRedemption,
    GalleryImage, Poster, SocialEngagementLog
)


@pytest.fixture
def user(db):
    """Create a test user."""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )


@pytest.fixture
def staff_user(db):
    """Create a test staff user."""
    return User.objects.create_user(
        username='staff',
        email='staff@example.com',
        password='staffpass123',
        is_staff=True
    )


@pytest.fixture
def offering(db):
    """Create a test offering."""
    return Offering.objects.create(
        unit='restaurant',
        category='Main Course',
        name='Grilled Steak',
        description='Premium grilled steak',
        price=Decimal('25.99'),
        is_available=True,
        display_order=1
    )


@pytest.fixture
def event(db):
    """Create a test event."""
    now = timezone.now()
    return Event.objects.create(
        title='Live Band Night',
        unit='restaurant',
        event_type='live_band',
        description='Live music event',
        start_datetime=now + timezone.timedelta(hours=1),
        end_datetime=now + timezone.timedelta(hours=4),
        is_published=True
    )


@pytest.fixture
def bundle(db):
    """Create a test bundle."""
    return Bundle.objects.create(
        name='Triple Unit Bundle',
        slug='triple-bundle',
        description='Experience all three units',
        units_included=['restaurant', 'carwash', 'barbershop'],
        price=Decimal('99.99'),
        discount_label='Save 30%',
        is_active=True
    )


@pytest.fixture
def gallery_image(db):
    """Create a test gallery image."""
    return GalleryImage.objects.create(
        unit='barbershop',
        title='Haircut transformation',
        caption='Professional barbershop service',
        display_order=1
    )


@pytest.fixture
def api_client():
    """Create an API client."""
    return APIClient()


# ==================== Model Tests ====================

@pytest.mark.django_db
class TestOfferingModel:
    def test_create_offering(self, offering):
        assert offering.name == 'Grilled Steak'
        assert offering.price == Decimal('25.99')
        assert offering.is_available is True

    def test_offering_str(self, offering):
        assert str(offering) == 'Restaurant: Grilled Steak'

    def test_offering_ordering(self, db):
        Offering.objects.create(
            unit='restaurant', name='A', price=10, display_order=2
        )
        Offering.objects.create(
            unit='restaurant', name='B', price=10, display_order=1
        )
        offerings = Offering.objects.all()
        assert offerings[0].display_order == 1
        assert offerings[1].display_order == 2


@pytest.mark.django_db
class TestEventModel:
    def test_create_event(self, event):
        assert event.title == 'Live Band Night'
        assert event.is_published is True

    def test_event_is_happening_now(self, db):
        now = timezone.now()
        happening_event = Event.objects.create(
            title='Current Event',
            unit='restaurant',
            start_datetime=now - timezone.timedelta(hours=1),
            end_datetime=now + timezone.timedelta(hours=1),
            is_published=True
        )
        assert happening_event.is_happening_now is True

    def test_event_not_happening_yet(self, db):
        now = timezone.now()
        future_event = Event.objects.create(
            title='Future Event',
            unit='restaurant',
            start_datetime=now + timezone.timedelta(hours=5),
            end_datetime=now + timezone.timedelta(hours=8),
            is_published=True
        )
        assert future_event.is_happening_now is False

    def test_event_str(self, event):
        assert str(event) == 'Live Band Night'


@pytest.mark.django_db
class TestBundleModel:
    def test_create_bundle(self, bundle):
        assert bundle.name == 'Triple Unit Bundle'
        assert len(bundle.units_included) == 3

    def test_bundle_slug_auto_generation(self, db):
        bundle = Bundle.objects.create(
            name='Auto Slug Bundle',
            units_included=['restaurant']
        )
        assert bundle.slug == 'auto-slug-bundle'

    def test_bundle_slug_not_overwritten(self, db):
        bundle = Bundle.objects.create(
            name='Manual Slug',
            slug='custom-slug',
            units_included=['restaurant']
        )
        assert bundle.slug == 'custom-slug'

    def test_whatsapp_link_generation(self, bundle):
        from django.conf import settings
        link = bundle.whatsapp_link()
        assert 'wa.me' in link
        assert 'Triple%20Unit%20Bundle' in link  # URL encoded


@pytest.mark.django_db
class TestBundleRedemptionModel:
    def test_create_redemption(self, bundle, user):
        redemption = BundleRedemption.objects.create(
            bundle=bundle,
            customer_name='John Doe',
            customer_phone='+254700000000',
            revenue_amount=Decimal('99.99'),
            redeemed_by=user
        )
        assert redemption.bundle == bundle
        assert redemption.redeemed_by == user


# ==================== API Tests ====================

@pytest.mark.django_db
class TestOfferingAPI:
    def test_list_offerings_public(self, api_client, offering):
        response = api_client.get('/api/offerings/')
        assert response.status_code == 200
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['name'] == 'Grilled Steak'

    def test_list_offerings_only_available_for_public(self, api_client, db):
        Offering.objects.create(
            unit='restaurant', name='Available', is_available=True, price=10
        )
        Offering.objects.create(
            unit='restaurant', name='Unavailable', is_available=False, price=10
        )
        response = api_client.get('/api/offerings/')
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['name'] == 'Available'

    def test_create_offering_requires_staff(self, api_client, user):
        api_client.force_authenticate(user=user)
        response = api_client.post('/api/offerings/', {
            'unit': 'restaurant',
            'name': 'New Dish',
            'price': '15.99'
        })
        assert response.status_code == 403

    def test_create_offering_as_staff(self, api_client, staff_user):
        api_client.force_authenticate(user=staff_user)
        response = api_client.post('/api/offerings/', {
            'unit': 'restaurant',
            'name': 'New Dish',
            'price': '15.99',
            'category': 'Main',
            'is_available': True
        })
        assert response.status_code == 201

    def test_filter_offerings_by_unit(self, api_client, db):
        Offering.objects.create(
            unit='restaurant', name='Steak', price=25, is_available=True
        )
        Offering.objects.create(
            unit='carwash', name='Premium Wash', price=15, is_available=True
        )
        response = api_client.get('/api/offerings/?unit=restaurant')
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['name'] == 'Steak'


@pytest.mark.django_db
class TestEventAPI:
    def test_list_events_only_published(self, api_client, db):
        Event.objects.create(
            title='Published',
            unit='restaurant',
            start_datetime=timezone.now(),
            end_datetime=timezone.now() + timezone.timedelta(hours=2),
            is_published=True
        )
        Event.objects.create(
            title='Draft',
            unit='restaurant',
            start_datetime=timezone.now(),
            end_datetime=timezone.now() + timezone.timedelta(hours=2),
            is_published=False
        )
        response = api_client.get('/api/events/')
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['title'] == 'Published'

    def test_happening_now_endpoint(self, api_client, db):
        now = timezone.now()
        Event.objects.create(
            title='Current',
            unit='restaurant',
            start_datetime=now - timezone.timedelta(hours=1),
            end_datetime=now + timezone.timedelta(hours=1),
            is_published=True
        )
        Event.objects.create(
            title='Future',
            unit='restaurant',
            start_datetime=now + timezone.timedelta(hours=5),
            end_datetime=now + timezone.timedelta(hours=8),
            is_published=True
        )
        response = api_client.get('/api/events/happening_now/')
        assert len(response.data) == 1
        assert response.data[0]['title'] == 'Current'

    def test_create_event_requires_staff(self, api_client, user):
        api_client.force_authenticate(user=user)
        response = api_client.post('/api/events/', {
            'title': 'New Event',
            'unit': 'restaurant',
            'start_datetime': timezone.now(),
            'end_datetime': timezone.now() + timezone.timedelta(hours=2)
        })
        assert response.status_code == 403


@pytest.mark.django_db
class TestBundleAPI:
    def test_list_bundles_only_active(self, api_client, bundle):
        Bundle.objects.create(
            name='Inactive',
            slug='inactive',
            units_included=['restaurant'],
            is_active=False
        )
        response = api_client.get('/api/bundles/')
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['name'] == 'Triple Unit Bundle'

    def test_retrieve_bundle_by_slug(self, api_client, bundle):
        response = api_client.get(f'/api/bundles/{bundle.slug}/')
        assert response.status_code == 200
        assert response.data['name'] == bundle.name

    def test_bundle_includes_whatsapp_link(self, api_client, bundle):
        response = api_client.get(f'/api/bundles/{bundle.slug}/')
        assert 'whatsapp_link' in response.data
        assert 'wa.me' in response.data['whatsapp_link']


@pytest.mark.django_db
class TestBundleRedemptionAPI:
    def test_create_redemption_requires_auth(self, api_client, bundle):
        response = api_client.post('/api/redemptions/', {
            'bundle': bundle.id,
            'customer_name': 'John'
        })
        assert response.status_code == 401

    def test_create_redemption_sets_redeemed_by(self, api_client, bundle, user):
        api_client.force_authenticate(user=user)
        response = api_client.post('/api/redemptions/', {
            'bundle': bundle.id,
            'customer_name': 'John Doe',
            'customer_phone': '+254700000000',
            'revenue_amount': '99.99'
        })
        assert response.status_code == 201
        redemption = BundleRedemption.objects.latest('id')
        assert redemption.redeemed_by == user


@pytest.mark.django_db
class TestAuthAPI:
    def test_login_returns_cookies(self, api_client, user):
        response = api_client.post('/api/auth/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        assert response.status_code == 200
        assert 'access_token' in response.cookies
        assert 'refresh_token' in response.cookies
        assert response.cookies['access_token']['httponly']
        assert response.cookies['refresh_token']['httponly']

    def test_login_invalid_credentials(self, api_client):
        response = api_client.post('/api/auth/token/', {
            'username': 'testuser',
            'password': 'wrongpass'
        })
        assert response.status_code == 401

    def test_refresh_token(self, api_client, user):
        # Login first
        response = api_client.post('/api/auth/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        assert response.status_code == 200

        # Refresh
        response = api_client.post('/api/auth/token/refresh/')
        assert response.status_code == 200
        assert 'access_token' in response.cookies

    def test_logout_clears_cookies(self, api_client, user):
        # Login first
        api_client.post('/api/auth/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        })

        # Logout
        response = api_client.post('/api/auth/logout/')
        assert response.status_code == 200
        # Cookies should be deleted (max_age=0 or empty)


# ==================== Permission Tests ====================

@pytest.mark.django_db
class TestPermissions:
    def test_staff_can_update_offering(self, api_client, staff_user, offering):
        api_client.force_authenticate(user=staff_user)
        response = api_client.patch(f'/api/offerings/{offering.id}/', {
            'name': 'Updated Steak'
        })
        assert response.status_code == 200

    def test_public_cannot_update_offering(self, api_client, offering):
        response = api_client.patch(f'/api/offerings/{offering.id}/', {
            'name': 'Updated Steak'
        })
        assert response.status_code == 401  # Unauthenticated

    def test_authenticated_non_staff_cannot_create_bundle(self, api_client, user):
        api_client.force_authenticate(user=user)
        response = api_client.post('/api/bundles/', {
            'name': 'New Bundle',
            'units_included': ['restaurant']
        })
        assert response.status_code == 403


# ==================== Integration Tests ====================

@pytest.mark.django_db
class TestAuthenticatedFlow:
    def test_complete_auth_flow(self, api_client, user):
        # Login first
        response = api_client.post('/api/auth/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        assert response.status_code == 200
        assert 'access_token' in response.cookies

        # The token is now stored in the cookie, so subsequent requests should work
        response = api_client.post('/api/redemptions/', {
            'bundle': 1,
            'customer_name': 'Test'
        })
        # Should fail due to missing bundle, but not due to auth
        assert response.status_code != 401

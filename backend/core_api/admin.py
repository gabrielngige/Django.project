from django.contrib import admin

from .models import (
    Bundle,
    BundleRedemption,
    Event,
    GalleryImage,
    Offering,
    Poster,
    SocialEngagementLog,
)


@admin.register(Offering)
class OfferingAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit', 'category', 'price', 'is_available')
    list_filter = ('unit', 'is_available')
    search_fields = ('name', 'category')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'unit', 'event_type', 'start_datetime', 'end_datetime', 'is_published')
    list_filter = ('unit', 'event_type', 'is_published')


@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    list_display = ('name', 'units_included', 'price', 'is_active')
    list_filter = ('is_active',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BundleRedemption)
class BundleRedemptionAdmin(admin.ModelAdmin):
    list_display = ('bundle', 'customer_name', 'revenue_amount', 'redeemed_at')
    list_filter = ('bundle',)


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'unit', 'is_featured')
    list_filter = ('unit', 'is_featured')


@admin.register(Poster)
class PosterAdmin(admin.ModelAdmin):
    list_display = ('title', 'unit', 'status', 'platform', 'created_at')
    list_filter = ('unit', 'status', 'platform')


@admin.register(SocialEngagementLog)
class SocialEngagementLogAdmin(admin.ModelAdmin):
    list_display = ('unit', 'platform', 'date', 'reach', 'engagement')
    list_filter = ('unit', 'platform')

from rest_framework import serializers

from .models import (
    Bundle,
    BundleRedemption,
    Event,
    GalleryImage,
    Offering,
    Poster,
    SocialEngagementLog,
)


class OfferingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offering
        fields = [
            'id', 'unit', 'category', 'name', 'description',
            'price', 'image', 'is_available', 'display_order', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than 0')
        return value


class EventSerializer(serializers.ModelSerializer):
    is_happening_now = serializers.BooleanField(read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'unit', 'event_type', 'description',
            'banner_image', 'start_datetime', 'end_datetime', 'is_published',
            'is_happening_now', 'created_at'
        ]
        read_only_fields = ('id', 'created_at', 'is_happening_now')

    def validate(self, data):
        if data['end_datetime'] <= data['start_datetime']:
            raise serializers.ValidationError('Event end time must be after start time')
        return data


class BundleSerializer(serializers.ModelSerializer):
    whatsapp_link = serializers.SerializerMethodField()

    class Meta:
        model = Bundle
        fields = [
            'id', 'name', 'slug', 'description', 'units_included',
            'price', 'discount_label', 'image', 'whatsapp_link',
            'whatsapp_message_template', 'is_active', 'created_at'
        ]
        read_only_fields = ('id', 'slug', 'created_at', 'whatsapp_link')

    def get_whatsapp_link(self, obj):
        return obj.whatsapp_link()

    def validate_units_included(self, value):
        if not value or len(value) == 0:
            raise serializers.ValidationError('At least one unit must be included')
        return value


class BundleRedemptionSerializer(serializers.ModelSerializer):
    bundle_name = serializers.CharField(source='bundle.name', read_only=True)

    class Meta:
        model = BundleRedemption
        fields = [
            'id', 'bundle', 'bundle_name', 'customer_name',
            'customer_phone', 'revenue_amount', 'notes',
            'redeemed_by', 'redeemed_at'
        ]
        read_only_fields = ('id', 'redeemed_by', 'redeemed_at')


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = [
            'id', 'unit', 'title', 'caption', 'image',
            'before_image', 'after_image', 'is_featured',
            'display_order', 'created_at'
        ]
        read_only_fields = ('id', 'created_at')


class PosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poster
        fields = [
            'id', 'title', 'unit', 'base_image', 'headline_text',
            'subtext', 'generated_image', 'platform', 'status',
            'linked_event', 'created_by', 'created_at', 'published_at'
        ]
        read_only_fields = ('id', 'generated_image', 'created_by', 'created_at', 'published_at')

    def validate_headline_text(self, value):
        if len(value) > 120:
            raise serializers.ValidationError('Headline must be 120 characters or less')
        return value


class SocialEngagementLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialEngagementLog
        fields = [
            'id', 'unit', 'platform', 'date', 'reach',
            'engagement', 'notes', 'logged_by'
        ]
        read_only_fields = ('id', 'logged_by')

    def validate_reach(self, value):
        if value < 0:
            raise serializers.ValidationError('Reach cannot be negative')
        return value

    def validate_engagement(self, value):
        if value < 0:
            raise serializers.ValidationError('Engagement cannot be negative')
        return value


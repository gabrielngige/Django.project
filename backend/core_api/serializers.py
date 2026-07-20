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
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    is_happening_now = serializers.BooleanField(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'


class BundleSerializer(serializers.ModelSerializer):
    whatsapp_link = serializers.SerializerMethodField()

    class Meta:
        model = Bundle
        fields = '__all__'

    def get_whatsapp_link(self, obj):
        return obj.whatsapp_link()


class BundleRedemptionSerializer(serializers.ModelSerializer):
    bundle_name = serializers.CharField(source='bundle.name', read_only=True)

    class Meta:
        model = BundleRedemption
        fields = '__all__'
        read_only_fields = ('redeemed_by', 'redeemed_at')


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = '__all__'


class PosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poster
        fields = '__all__'
        read_only_fields = ('generated_image', 'created_by', 'published_at')


class SocialEngagementLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialEngagementLog
        fields = '__all__'
        read_only_fields = ('logged_by',)

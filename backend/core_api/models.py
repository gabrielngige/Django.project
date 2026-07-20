from urllib.parse import quote

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from .constants import UNIT_CHOICES, UNIT_RESTAURANT


class Offering(models.Model):
    """A single sellable line item: a menu dish, a carwash package, or a barbershop service."""

    unit = models.CharField(max_length=20, choices=UNIT_CHOICES)
    category = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='offerings/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['unit', 'display_order', 'name']

    def __str__(self):
        return f'{self.get_unit_display()}: {self.name}'


class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ('rhumba', 'Rhumba Night'),
        ('karaoke', 'Karaoke'),
        ('live_band', 'Live Band'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=150)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default=UNIT_RESTAURANT)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default='other')
    description = models.TextField(blank=True)
    banner_image = models.ImageField(upload_to='events/', blank=True, null=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_datetime']

    def __str__(self):
        return self.title

    @property
    def is_happening_now(self):
        now = timezone.now()
        return self.is_published and self.start_datetime <= now <= self.end_datetime


class Bundle(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField(blank=True)
    units_included = ArrayField(
        models.CharField(max_length=20, choices=UNIT_CHOICES),
        size=3,
        help_text='The business units bundled together in this offer.',
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount_label = models.CharField(max_length=50, blank=True, help_text='e.g. "Save 20%"')
    image = models.ImageField(upload_to='bundles/', blank=True, null=True)
    whatsapp_message_template = models.TextField(
        default="Hi 109 Tavern, I'd like to book the {name} bundle!",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def whatsapp_link(self, phone_number=None):
        phone = phone_number or settings.TAVERN_WHATSAPP_NUMBER
        message = self.whatsapp_message_template.format(name=self.name)
        return f'https://wa.me/{phone}?text={quote(message)}'


class BundleRedemption(models.Model):
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE, related_name='redemptions')
    customer_name = models.CharField(max_length=150, blank=True)
    customer_phone = models.CharField(max_length=30, blank=True)
    revenue_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True)
    redeemed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
    )
    redeemed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-redeemed_at']

    def __str__(self):
        return f'{self.bundle.name} redeemed {self.redeemed_at:%Y-%m-%d}'


class GalleryImage(models.Model):
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES)
    title = models.CharField(max_length=150)
    caption = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='gallery/', blank=True, null=True)
    before_image = models.ImageField(upload_to='gallery/before/', blank=True, null=True)
    after_image = models.ImageField(upload_to='gallery/after/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['unit', 'display_order', '-created_at']

    def __str__(self):
        return f'{self.get_unit_display()}: {self.title}'


class Poster(models.Model):
    STATUS_CHOICES = [('draft', 'Draft'), ('published', 'Published')]
    PLATFORM_CHOICES = [('instagram', 'Instagram'), ('facebook', 'Facebook'), ('both', 'Both')]

    title = models.CharField(max_length=150)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default=UNIT_RESTAURANT)
    base_image = models.ImageField(upload_to='posters/source/')
    headline_text = models.CharField(max_length=120)
    subtext = models.CharField(max_length=200, blank=True)
    generated_image = models.ImageField(upload_to='posters/generated/', blank=True, null=True)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, default='both')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    linked_event = models.ForeignKey(
        Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='posters',
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class SocialEngagementLog(models.Model):
    PLATFORM_CHOICES = [
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('tiktok', 'TikTok'),
        ('other', 'Other'),
    ]

    unit = models.CharField(max_length=20, choices=UNIT_CHOICES)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    date = models.DateField()
    reach = models.PositiveIntegerField(default=0)
    engagement = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    logged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
    )

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.get_platform_display()} {self.date}'

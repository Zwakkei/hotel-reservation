from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    ROOM_TYPES = [
        ('standard', 'Standard Room'),
        ('deluxe', 'Deluxe Room'),
        ('premier', 'Premier Room'),
        ('suite', 'Suite'),
        ('family', 'Family Room'),
        ('presidential', 'Presidential Suite'),
    ]
    
    VIEW_TYPES = [
        ('city', 'City View'),
        ('ocean', 'Ocean View'),
        ('mountain', 'Mountain View'),
        ('garden', 'Garden View'),
        ('pool', 'Pool View'),
    ]
    
    # Basic Info
    name = models.CharField(max_length=100)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES, default='standard')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField()
    size = models.IntegerField(default=30, help_text="Room size in square meters")
    bed_type = models.CharField(max_length=100, default="Queen Bed")
    view_type = models.CharField(max_length=20, choices=VIEW_TYPES, default='city')
    
    # Images
    main_image = models.URLField(max_length=500, blank=True)
    image2 = models.URLField(max_length=500, blank=True)
    image3 = models.URLField(max_length=500, blank=True)
    image4 = models.URLField(max_length=500, blank=True)
    
    # Amenities
    amenities = models.JSONField(default=list, blank=True)
    
    # Status
    is_available = models.BooleanField(default=True)
    
    # Features
    has_wifi = models.BooleanField(default=True)
    has_breakfast = models.BooleanField(default=False)
    has_parking = models.BooleanField(default=True)
    has_pool = models.BooleanField(default=False)
    has_gym = models.BooleanField(default=False)
    has_spa = models.BooleanField(default=False)
    has_restaurant = models.BooleanField(default=False)
    has_room_service = models.BooleanField(default=True)
    has_air_conditioning = models.BooleanField(default=True)
    has_tv = models.BooleanField(default=True)
    has_minibar = models.BooleanField(default=False)
    has_safe = models.BooleanField(default=True)
    has_hairdryer = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.IntegerField(default=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    special_requests = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.room.name}"


class ResortAmenity(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='🏝️')
    image = models.URLField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
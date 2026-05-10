from django.contrib import admin
from .models import Room, Reservation, ResortAmenity

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'capacity', 'is_available']
    list_filter = ['is_available', 'room_type']
    search_fields = ['name']

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'room', 'check_in', 'check_out', 'status']
    list_filter = ['status']
    search_fields = ['user__username', 'room__name']

@admin.register(ResortAmenity)
class ResortAmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'is_active', 'order']
    list_editable = ['order', 'is_active']
    search_fields = ['name']
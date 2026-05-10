from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomLoginView,
    RegisterView,
    MeView,
    RoomListCreateView,
    RoomDetailView,
    AvailableRoomsView,
    CancelReservationView,
    UserReservationsView,
    ReservationListCreateView,
    ReservationDetailView,
    RoomAvailabilityView,
    AdminStatsView,
    ResortAmenityListView,  # ← ADD THIS
)

urlpatterns = [
    # Room Availability
    path('rooms/<int:room_id>/availability/', RoomAvailabilityView.as_view(), name='room-availability'),
    
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    
    # Admin
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),

    # Rooms
    path('rooms/', RoomListCreateView.as_view(), name='room-list'),
    path('rooms/<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
    path('rooms/available/', AvailableRoomsView.as_view(), name='available-rooms'),

    # Reservations
    path('reservations/', ReservationListCreateView.as_view(), name='reservation-list'),
    path('reservations/<int:pk>/', ReservationDetailView.as_view(), name='reservation-detail'),
    path('reservations/<int:pk>/cancel/', CancelReservationView.as_view(), name='cancel-reservation'),
    path('my-reservations/', UserReservationsView.as_view(), name='my-reservations'),
    
    # 🏝️ Resort Amenities
    path('amenities/', ResortAmenityListView.as_view(), name='amenities'),
]
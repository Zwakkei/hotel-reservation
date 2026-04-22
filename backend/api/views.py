from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Room, Reservation
from .serializers import RegisterSerializer, UserSerializer, RoomSerializer, ReservationSerializer
from datetime import datetime, timedelta
from django.db.models import Count
from django.utils import timezone

# ✅ IMPORT
from .utils import send_booking_confirmation


# 🔐 CUSTOM LOGIN VIEW - WORKING VERSION
class CustomLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Check if both fields are provided
        if not username:
            return Response(
                {'username': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not password:
            return Response(
                {'password': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user exists
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {'username': 'No account found with this username'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check password
        if not user.check_password(password):
            return Response(
                {'password': 'Incorrect password. Please try again.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
            'username': user.username
        })


# Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# Get current logged in user info
class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# Room Views
class RoomListCreateView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]


# Available Rooms View
class AvailableRoomsView(generics.ListAPIView):
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Room.objects.filter(is_available=True)
        check_in = self.request.query_params.get('check_in')
        check_out = self.request.query_params.get('check_out')

        if check_in and check_out:
            check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date()
            check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date()

            booked_room_ids = Reservation.objects.filter(
                status__in=['pending', 'confirmed'],
                check_in__lt=check_out_date,
                check_out__gt=check_in_date
            ).values_list('room_id', flat=True)

            queryset = queryset.exclude(id__in=booked_room_ids)

        return queryset


# Room Availability Calendar
class RoomAvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
            year = int(request.query_params.get('year', datetime.now().year))
            month = int(request.query_params.get('month', datetime.now().month))

            reservations = Reservation.objects.filter(
                room=room,
                status__in=['confirmed', 'pending'],
                check_in__year=year,
                check_in__month=month
            )

            if month == 12:
                days_in_month = (datetime(year + 1, 1, 1) - datetime(year, month, 1)).days
            else:
                days_in_month = (datetime(year, month + 1, 1) - datetime(year, month, 1)).days

            availability = []

            for day in range(1, days_in_month + 1):
                current_date = datetime(year, month, day).date()

                is_booked = reservations.filter(
                    check_in__lte=current_date,
                    check_out__gt=current_date
                ).exists()

                availability.append({
                    'date': current_date.isoformat(),
                    'available': not is_booked,
                    'price': float(room.price)
                })

            return Response({
                'room_id': room.id,
                'room_name': room.name,
                'year': year,
                'month': month,
                'availability': availability
            })

        except Room.DoesNotExist:
            return Response({'error': 'Room not found'}, status=404)


# Cancel Reservation
class CancelReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            reservation = Reservation.objects.get(pk=pk, user=request.user)

            if reservation.status in ['pending', 'confirmed']:
                reservation.status = 'cancelled'
                reservation.save()
                return Response({'message': 'Reservation cancelled'})

            return Response({'error': 'Cannot cancel this reservation'}, status=400)

        except Reservation.DoesNotExist:
            return Response({'error': 'Reservation not found'}, status=404)


# User Reservations
class UserReservationsView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Reservation.objects.filter(user=user).order_by('-created_at')


# Reservation Views
class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        reservation = serializer.save()
        
        try:
            send_booking_confirmation(reservation)
        except Exception as e:
            print(f"Email error: {e}")
        
        return reservation


class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=self.request.user)


# Admin Dashboard Stats
class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)

        total_rooms = Room.objects.count()
        available_rooms = Room.objects.filter(is_available=True).count()

        total_reservations = Reservation.objects.count()
        confirmed_reservations = Reservation.objects.filter(status='confirmed').count()
        pending_reservations = Reservation.objects.filter(status='pending').count()
        cancelled_reservations = Reservation.objects.filter(status='cancelled').count()

        confirmed_list = Reservation.objects.filter(
            status='confirmed',
            created_at__gte=start_date
        )

        total_revenue = sum([float(r.total_price or 0) for r in confirmed_list])

        monthly_revenue = []
        for i in range(6):
            month_date = timezone.now().date() - timedelta(days=30 * i)
            month_start = month_date.replace(day=1)

            if month_start.month == 12:
                next_month = month_start.replace(year=month_start.year + 1, month=1)
            else:
                next_month = month_start.replace(month=month_start.month + 1)

            month_revenue = sum([
                float(r.total_price or 0)
                for r in Reservation.objects.filter(
                    status='confirmed',
                    created_at__gte=month_start,
                    created_at__lt=next_month
                )
            ])

            monthly_revenue.append({
                'month': month_start.strftime('%b'),
                'revenue': month_revenue
            })

        popular_rooms = Reservation.objects.filter(
            status='confirmed'
        ).values('room__name').annotate(
            count=Count('id')
        ).order_by('-count')[:5]

        occupancy_rate = 0
        if total_rooms > 0:
            occupancy_rate = round((total_reservations / (total_rooms * 30)) * 100, 2)

        return Response({
            'rooms': {
                'total': total_rooms,
                'available': available_rooms,
                'occupied': total_rooms - available_rooms
            },
            'reservations': {
                'total': total_reservations,
                'confirmed': confirmed_reservations,
                'pending': pending_reservations,
                'cancelled': cancelled_reservations
            },
            'revenue': {
                'total': total_revenue,
                'monthly': monthly_revenue
            },
            'popular_rooms': list(popular_rooms),
            'occupancy_rate': occupancy_rate
        })
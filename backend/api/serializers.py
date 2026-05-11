from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Room, Reservation, ResortAmenity

# 🔐 REGISTER SERIALIZER
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match")
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists")
        
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


# 👤 USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']


# 🏨 ROOM SERIALIZER
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        # Use __all__ to automatically include the new main_image_file
        fields = '__all__'


# 📦 RESERVATION SERIALIZER
class ReservationSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(), source='room', write_only=True
    )
    user = UserSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'room',
            'room_id',
            'check_in',
            'check_out',
            'guests',
            'status',
            'special_requests',
            'created_at',
            'total_price'
        ]
        read_only_fields = ['user', 'created_at', 'total_price']

    def create(self, validated_data):
        request = self.context.get('request')
        nights = (validated_data['check_out'] - validated_data['check_in']).days
        if nights <= 0:
            raise serializers.ValidationError({"check_out": "Check-out must be after check-in"})
        
        overlapping = Reservation.objects.filter(
            room=validated_data['room'],
            status__in=['pending', 'confirmed'],
            check_in__lt=validated_data['check_out'],
            check_out__gt=validated_data['check_in']
        ).exists()
        
        if overlapping:
            raise serializers.ValidationError({"error": "❌ Room is already booked for these dates."})
        
        room = validated_data['room']
        total_price = room.price * nights
        
        reservation = Reservation.objects.create(
            user=request.user,
            room=room,
            check_in=validated_data['check_in'],
            check_out=validated_data['check_out'],
            guests=validated_data.get('guests', 2),
            special_requests=validated_data.get('special_requests', ''),
            total_price=total_price,
            status='pending'
        )
        return reservation

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if 'check_in' in validated_data or 'check_out' in validated_data:
            nights = (instance.check_out - instance.check_in).days
            instance.total_price = instance.room.price * nights
        
        instance.save()
        return instance


# 🏝️ RESORT AMENITY SERIALIZER
class ResortAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResortAmenity
        fields = ['id', 'name', 'description', 'icon', 'image']

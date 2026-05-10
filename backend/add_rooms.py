import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Room
from decimal import Decimal

# ============================================================
# 1. STANDARD ROOMS (with sensible defaults for new fields)
# ============================================================
rooms_data = [
    {
        'name': 'Standard Queen Room',
        'description': 'Cozy queen bed room perfect for solo travelers or couples. Features comfortable bedding, work desk, and city views.',
        'price': 599.00,
        'capacity': 2,
        'room_type': 'standard',
        'bed_type': 'Queen Bed',
        'size': 28,
        'has_wifi': True,
        'has_parking': True,
        'has_air_conditioning': True,
        'has_tv': True,
        'has_safe': True,
        'has_hairdryer': True,
        'is_available': True,
    },
    {
        'name': 'Standard Twin Room',
        'description': 'Two twin beds ideal for friends or colleagues. Includes work desk, flat-screen TV, and modern amenities.',
        'price': 799.00,
        'capacity': 2,
        'room_type': 'standard',
        'bed_type': '2 Twin Beds',
        'size': 30,
        'has_wifi': True,
        'has_parking': True,
        'has_air_conditioning': True,
        'has_tv': True,
        'has_safe': True,
        'has_hairdryer': True,
        'is_available': True,
    },
    {
        'name': 'Deluxe King Room',
        'description': 'Luxurious king bed with separate sitting area. Recently renovated with modern design and walk-in shower.',
        'price': 899.00,
        'capacity': 2,
        'room_type': 'deluxe',
        'bed_type': 'King Bed',
        'size': 38,
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
        'is_available': True,
    },
    {
        'name': 'Deluxe Double Room',
        'description': 'Two double beds perfect for small families. Features modern decor, sitting area, and premium bathroom.',
        'price': 1299.00,
        'capacity': 4,
        'room_type': 'deluxe',
        'bed_type': '2 Double Beds',
        'size': 42,
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
        'is_available': True,
    },
    {
        'name': 'Premier King Room',
        'description': 'Premium king room with stunning city views on higher floors. Features ergonomic work station and rainfall shower.',
        'price': 1599.00,
        'capacity': 2,
        'room_type': 'premier',
        'bed_type': 'King Bed',
        'size': 45,
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
        'is_available': True,
    },
    {
        'name': 'Junior Suite',
        'description': 'Spacious suite with separate living area. Includes king bed, sofa bed, and marble bathroom.',
        'price': 1899.00,
        'capacity': 3,
        'room_type': 'suite',
        'bed_type': 'King Bed + Sofa Bed',
        'size': 55,
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
        'is_available': True,
    },
    {
        'name': 'Executive Suite',
        'description': 'Luxury suite with executive lounge access. Features separate bedroom, living/dining area, and soaking tub.',
        'price': 2499.00,
        'capacity': 3,
        'room_type': 'suite',
        'bed_type': 'King Bed',
        'size': 65,
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
        'is_available': True,
    },
    {
        'name': 'Family Suite',
        'description': 'Spacious suite designed for families. Features one king bed, two twin beds, kitchenette, and living area.',
        'price': 3499.00,
        'capacity': 5,
        'room_type': 'family',
        'bed_type': 'King Bed + 2 Twin Beds',
        'size': 70,
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
        'is_available': True,
    },
    {
        'name': 'Presidential Suite',
        'description': 'Ultimate luxury with personal butler service. Features two bedrooms, formal dining, jacuzzi, and panoramic views.',
        'price': 4999.00,
        'capacity': 6,
        'room_type': 'presidential',
        'bed_type': 'King Bed + Queen Bed',
        'size': 120,
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
        'has_jacuzzi': True,
        'is_available': True,
    },
]

# ============================================================
# 2. RESORT STYLE ROOMS (your new ones)
# ============================================================
resort_rooms = [
    {
        'name': 'Lagoon View Suite',
        'description': 'Spacious suite overlooking our crystal-clear lagoon. Includes private jacuzzi on the balcony and direct lagoon access.',
        'price': 4999,
        'capacity': 4,
        'room_type': 'suite',
        'bed_type': 'King Bed + Sofa Bed',
        'size': 65,
        'has_jacuzzi': True,
        'has_lagoon_access': True,
        'has_pool': True,
        'has_room_service': True,
        'has_breakfast': True,
        'has_wifi': True,
        'is_available': True,
    },
    {
        'name': 'Poolside Cabana',
        'description': 'Steps away from our infinity pool. Relax in your private cabana with outdoor lounge and butler service.',
        'price': 3499,
        'capacity': 2,
        'room_type': 'deluxe',
        'bed_type': 'Queen Bed',
        'size': 45,
        'has_pool': True,
        'has_room_service': True,
        'has_wifi': True,
        'has_breakfast': True,
        'is_available': True,
    },
    {
        'name': 'Water Park Villa',
        'description': 'Ideal for families! Includes unlimited access to our water park and kids club. Two bedrooms and a living area.',
        'price': 5999,
        'capacity': 6,
        'room_type': 'family',
        'bed_type': 'King Bed + 2 Twin Beds',
        'size': 80,
        'has_water_park': True,
        'has_kids_club': True,
        'has_pool': True,
        'has_breakfast': True,
        'has_wifi': True,
        'is_available': True,
    },
    {
        'name': 'Beachfront Bungalow',
        'description': 'Luxury bungalow right on the beach. Outdoor jacuzzi, private sun deck, and 24/7 concierge.',
        'price': 7499,
        'capacity': 2,
        'room_type': 'presidential',
        'bed_type': 'King Bed',
        'size': 90,
        'has_beach_access': True,
        'has_jacuzzi': True,
        'has_room_service': True,
        'has_breakfast': True,
        'has_wifi': True,
        'is_available': True,
    },
    {
        'name': 'Family Lagoon Suite',
        'description': 'Two-bedroom suite overlooking the lagoon with direct water slide access. Perfect for large families.',
        'price': 8999,
        'capacity': 6,
        'room_type': 'family',
        'bed_type': 'King Bed + Bunk Beds',
        'size': 100,
        'has_lagoon_access': True,
        'has_water_park': True,
        'has_kids_club': True,
        'has_pool': True,
        'has_breakfast': True,
        'has_wifi': True,
        'is_available': True,
    },
]

# ============================================================
# 3. INSERT / UPDATE ALL ROOMS
# ============================================================
all_rooms = rooms_data + resort_rooms

for room in all_rooms:
    obj, created = Room.objects.get_or_create(
        name=room['name'],
        defaults=room
    )
    if created:
        print(f"✅ Added: {room['name']}")
    else:
        # Optionally update existing room with any new fields
        updated = False
        for key, value in room.items():
            if hasattr(obj, key) and getattr(obj, key) != value:
                setattr(obj, key, value)
                updated = True
        if updated:
            obj.save()
            print(f"🔄 Updated: {room['name']}")
        else:
            print(f"⏸️ Already exists (no changes): {room['name']}")

print(f"\n📊 Total rooms in database: {Room.objects.count()}")
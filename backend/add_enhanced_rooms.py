import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Room
from decimal import Decimal

# Clear existing rooms (optional - remove if you want to keep)
# Room.objects.all().delete()

rooms_data = [
    # STANDARD QUEEN ROOM
    {
        'name': 'Standard Queen Room',
        'room_type': 'standard',
        'description': 'A cozy space where comfort meets convenience. Perfect for solo travelers or couples. Features a comfortable queen-size bed, work desk, and modern amenities.',
        'price': 599.00,
        'capacity': 2,
        'size': 28,
        'bed_type': 'Queen Bed',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        'image2': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'image3': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Work Desk', 'Safe Box', 'Hairdryer', 'Bathrobes', 'Tea/Coffee Maker'],
        'has_wifi': True,
        'has_breakfast': False,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': False,
        'has_safe': True,
        'has_hairdryer': True,
    },
    # STANDARD TWIN ROOM
    {
        'name': 'Standard Twin Room',
        'room_type': 'standard',
        'description': 'Ideal for friends or colleagues traveling together. Features two comfortable twin beds, work desk, and all essential amenities.',
        'price': 799.00,
        'capacity': 2,
        'size': 30,
        'bed_type': '2 Twin Beds',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
        'image2': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        'image3': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Work Desk', 'Safe Box', 'Hairdryer', 'Bathrobes', 'Tea/Coffee Maker'],
        'has_wifi': True,
        'has_breakfast': False,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_safe': True,
        'has_hairdryer': True,
    },
    # DELUXE KING ROOM
    {
        'name': 'Deluxe King Room',
        'room_type': 'deluxe',
        'description': 'Experience modern comfort in our Deluxe King Room. Features a luxurious king-size bed, separate sitting area, and walk-in shower bathroom.',
        'price': 899.00,
        'capacity': 2,
        'size': 38,
        'bed_type': 'King Bed',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        'image2': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        'image3': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'image4': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', '55" Smart TV', 'Work Desk', 'Safe Box', 'Hairdryer', 'Luxury Bathrobes', 'Espresso Machine', 'Mini-bar', 'Walk-in Shower', 'Separate Sitting Area'],
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
    },
    # DELUXE DOUBLE ROOM
    {
        'name': 'Deluxe Double Room',
        'room_type': 'deluxe',
        'description': 'Spacious deluxe accommodation with two double beds. Perfect for small families or groups. Features modern decor and premium bathroom amenities.',
        'price': 1299.00,
        'capacity': 4,
        'size': 42,
        'bed_type': '2 Double Beds',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
        'image2': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        'image3': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', '55" Smart TV', 'Work Desk', 'Safe Box', 'Hairdryer', 'Luxury Bathrobes', 'Espresso Machine', 'Mini-bar', 'Walk-in Shower', 'Separate Sitting Area'],
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
    },
    # PREMIER KING ROOM
    {
        'name': 'Premier King Room',
        'room_type': 'premier',
        'description': 'Our Premier King Room offers elevated comfort on higher floors. Enjoy stunning city views from floor-to-ceiling windows. Features a king-size bed and luxury bathroom.',
        'price': 1599.00,
        'capacity': 2,
        'size': 45,
        'bed_type': 'King Bed',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'image2': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        'image3': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        'image4': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', '65" Smart TV', 'Executive Work Desk', 'Safe Box', 'Hairdryer', 'Designer Bathrobes', 'Espresso Machine', 'Premium Mini-bar', 'Rainfall Shower', 'Separate Living Area', 'Floor-to-ceiling Windows'],
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
    },
    # JUNIOR SUITE
    {
        'name': 'Junior Suite',
        'room_type': 'suite',
        'description': 'Experience the perfect blend of comfort and luxury. Features a separate bedroom with king-size bed, living area with sofa bed, and marble bathroom.',
        'price': 1899.00,
        'capacity': 3,
        'size': 55,
        'bed_type': 'King Bed + Sofa Bed',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'image2': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'image3': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        'image4': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', '65" Smart TV', 'Executive Work Desk', 'Safe Box', 'Hairdryer', 'Designer Bathrobes', 'Espresso Machine', 'Premium Mini-bar', 'Rainfall Shower', 'Separate Living Area', 'Dining Area', 'Walk-in Closet'],
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
    },
    # EXECUTIVE SUITE
    {
        'name': 'Executive Suite',
        'room_type': 'suite',
        'description': 'Designed for the discerning business traveler. Features a spacious bedroom with king-size bed, separate living/dining area, and a luxurious bathroom with soaking tub.',
        'price': 2499.00,
        'capacity': 3,
        'size': 65,
        'bed_type': 'King Bed',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'image2': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'image3': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
        'image4': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', '75" Smart TV', 'Executive Work Desk', 'Safe Box', 'Hairdryer', 'Designer Bathrobes', 'Espresso Machine', 'Premium Mini-bar', 'Rainfall Shower', 'Soaking Tub', 'Separate Living Room', 'Dining Area', 'Executive Lounge Access', 'Butler Service'],
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
    },
    # FAMILY SUITE
    {
        'name': 'Family Suite',
        'room_type': 'family',
        'description': 'Spacious suite designed for families. Features one king bed, two twin beds, separate living area, kitchenette, and family-friendly bathroom amenities.',
        'price': 3499.00,
        'capacity': 5,
        'size': 70,
        'bed_type': 'King Bed + 2 Twin Beds',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        'image2': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'image3': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
        'image4': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', '55" Smart TV (2)', 'Work Desk', 'Safe Box', 'Hairdryer', 'Family Bathrobes', 'Kitchenette', 'Microwave', 'Refrigerator', 'Dishwasher', 'Washer/Dryer', 'Separate Living Area', 'Children\'s Amenities'],
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
    },
    # PRESIDENTIAL SUITE
    {
        'name': 'Presidential Suite',
        'room_type': 'presidential',
        'description': 'The epitome of luxury. This expansive suite features a master bedroom with king-size bed, second bedroom with queen bed, formal living and dining rooms, private study, and marble bathroom with jacuzzi.',
        'price': 4999.00,
        'capacity': 6,
        'size': 120,
        'bed_type': 'King Bed + Queen Bed',
        'view_type': 'city',
        'main_image': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'image2': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'image3': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        'image4': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
        'amenities': ['Free WiFi', 'Air Conditioning', '85" Smart TV', 'Executive Work Desk', 'Safe Box', 'Hairdryer', 'Designer Bathrobes', 'Espresso Machine', 'Premium Mini-bar', 'Jacuzzi', 'Rainfall Shower', 'Separate Living Room', 'Formal Dining Room', 'Private Study', 'Butler Service', 'Private Balcony', 'Panoramic Views'],
        'has_wifi': True,
        'has_breakfast': True,
        'has_parking': True,
        'has_room_service': True,
        'has_tv': True,
        'has_minibar': True,
        'has_safe': True,
        'has_hairdryer': True,
    },
]

print("Adding enhanced rooms with images and amenities...")

for room_data in rooms_data:
    obj, created = Room.objects.get_or_create(
        name=room_data['name'],
        defaults=room_data
    )
    if created:
        print(f"✅ Added: {room_data['name']}")
    else:
        # Update existing room
        for key, value in room_data.items():
            setattr(obj, key, value)
        obj.save()
        print(f"🔄 Updated: {room_data['name']}")

print(f"\n📊 Total rooms in database: {Room.objects.count()}")
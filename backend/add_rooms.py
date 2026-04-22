import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Room
from decimal import Decimal

rooms_data = [
    {
        'name': 'Standard Queen Room',
        'description': 'Cozy queen bed room perfect for solo travelers or couples. Features comfortable bedding, work desk, and city views.',
        'price': 599.00,
        'capacity': 2,
    },
    {
        'name': 'Standard Twin Room',
        'description': 'Two twin beds ideal for friends or colleagues. Includes work desk, flat-screen TV, and modern amenities.',
        'price': 799.00,
        'capacity': 2,
    },
    {
        'name': 'Deluxe King Room',
        'description': 'Luxurious king bed with separate sitting area. Recently renovated with modern design and walk-in shower.',
        'price': 899.00,
        'capacity': 2,
    },
    {
        'name': 'Deluxe Double Room',
        'description': 'Two double beds perfect for small families. Features modern decor, sitting area, and premium bathroom.',
        'price': 1299.00,
        'capacity': 4,
    },
    {
        'name': 'Premier King Room',
        'description': 'Premium king room with stunning city views on higher floors. Features ergonomic work station and rainfall shower.',
        'price': 1599.00,
        'capacity': 2,
    },
    {
        'name': 'Junior Suite',
        'description': 'Spacious suite with separate living area. Includes king bed, sofa bed, and marble bathroom.',
        'price': 1899.00,
        'capacity': 3,
    },
    {
        'name': 'Executive Suite',
        'description': 'Luxury suite with executive lounge access. Features separate bedroom, living/dining area, and soaking tub.',
        'price': 2499.00,
        'capacity': 3,
    },
    {
        'name': 'Family Suite',
        'description': 'Spacious suite designed for families. Features one king bed, two twin beds, kitchenette, and living area.',
        'price': 3499.00,
        'capacity': 5,
    },
    {
        'name': 'Presidential Suite',
        'description': 'Ultimate luxury with personal butler service. Features two bedrooms, formal dining, jacuzzi, and panoramic views.',
        'price': 4999.00,
        'capacity': 6,
    },
]

for room in rooms_data:
    obj, created = Room.objects.get_or_create(
        name=room['name'],
        defaults={
            'description': room['description'],
            'price': Decimal(str(room['price'])),
            'capacity': room['capacity'],
            'is_available': True
        }
    )
    if created:
        print(f"✅ Added: {room['name']}")
    else:
        print(f"⏸️ Already exists: {room['name']}")

print(f"\n📊 Total rooms in database: {Room.objects.count()}")
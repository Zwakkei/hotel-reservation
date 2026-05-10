import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategorySwiper } from '../../components/CategorySwiper';
import { LuxuryRoomCard } from '../../components/LuxuryRoomCard';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const ROOMS = [
  {
    id: '1',
    name: 'Deluxe Ocean View',
    price: 199,
    rating: 4.9,
    maxGuests: 2,
    category: 'luxury',
    description: 'Stunning ocean views, king-size bed, marble bathroom',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500',
    amenities: ['Ocean View', 'King Bed', 'Mini Bar'],
  },
  {
    id: '2',
    name: 'Executive Suite',
    price: 349,
    rating: 4.8,
    maxGuests: 4,
    category: 'suite',
    description: 'Separate living room, premium amenities',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500',
    amenities: ['Living Room', 'Jacuzzi', 'Butler'],
  },
  {
    id: '3',
    name: 'Standard Double',
    price: 129,
    rating: 4.6,
    maxGuests: 2,
    category: 'business',
    description: 'Comfortable and cozy',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500',
    amenities: ['Work Desk', 'WiFi', 'Queen Bed'],
  },
  {
    id: '4',
    name: 'Family Studio',
    price: 249,
    rating: 4.7,
    maxGuests: 5,
    category: 'family',
    description: 'Two bedrooms, kitchenette',
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=500',
    amenities: ['Kitchenette', '2 Bedrooms', 'Play Area'],
  },
  // NEW ROOMS:
  {
    id: '5',
    name: 'Presidential Penthouse',
    price: 899,
    rating: 5.0,
    maxGuests: 6,
    category: 'luxury',
    description: 'Panoramic views, private terrace, butler service, infinity pool',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
    amenities: ['Private Pool', 'Butler', 'Terrace', 'VIP Access'],
  },
  {
    id: '6',
    name: 'Garden View Room',
    price: 159,
    rating: 4.5,
    maxGuests: 2,
    category: 'business',
    description: 'Beautiful garden views, peaceful atmosphere',
    image: 'https://images.unsplash.com/photo-1582719500951-81a2beb8af3b?w=500',
    amenities: ['Garden View', 'Quiet Zone', 'Work Space'],
  },
  {
    id: '7',
    name: 'Beachfront Villa',
    price: 599,
    rating: 4.9,
    maxGuests: 8,
    category: 'family',
    description: 'Direct beach access, private chef, 4 bedrooms',
    image: 'https://images.unsplash.com/photo-1617098900591-3f9090e6c8fc?w=500',
    amenities: ['Beach Access', 'Private Chef', '4 Bedrooms', 'Pool'],
  },
  {
    id: '8',
    name: 'Honeymoon Suite',
    price: 399,
    rating: 4.9,
    maxGuests: 2,
    category: 'suite',
    description: 'Romantic setting, jacuzzi, champagne on arrival',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500',
    amenities: ['Jacuzzi', 'Romantic Setup', 'Champagne', 'Couples Spa'],
  },
  {
    id: '9',
    name: 'Club Level Room',
    price: 279,
    rating: 4.7,
    maxGuests: 2,
    category: 'luxury',
    description: 'Access to executive lounge, complimentary breakfast',
    image: 'https://images.unsplash.com/photo-1631049035184-5cab1b1532c9?w=500',
    amenities: ['Lounge Access', 'Breakfast', 'Evening Cocktails'],
  },
  {
    id: '10',
    name: 'Accessible Room',
    price: 149,
    rating: 4.6,
    maxGuests: 2,
    category: 'business',
    description: 'Wheelchair accessible, roll-in shower, wider doorways',
    image: 'https://images.unsplash.com/photo-1560185009-dddeb820c7df?w=500',
    amenities: ['Accessible', 'Roll-in Shower', 'Emergency Alerts'],
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRooms = selectedCategory === 'all'
    ? ROOMS
    : ROOMS.filter(room => room.category === selectedCategory);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800' }}
            style={styles.heroImage}
          />
          <LinearGradient 
            colors={['transparent', 'rgba(26,42,79,0.95)']}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>Welcome to</Text>
            <Text style={styles.heroTitleGold}>BlueHaven</Text>
            <Text style={styles.heroSubtitle}>
              {user?.name ? `Welcome back, ${user.name}` : 'Discover luxury stays'}
            </Text>
          </LinearGradient>
        </View>

        {/* Category Swiper */}
        <CategorySwiper 
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{ROOMS.length}+</Text>
            <Text style={styles.statLabel}>Luxury Rooms</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Guest Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>

        {/* Rooms List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Collection</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredRooms.length} exquisite rooms available
          </Text>
        </View>

        <FlatList
          data={filteredRooms}
          renderItem={({ item }) => (
            <LuxuryRoomCard
              id={item.id}
              name={item.name}
              price={item.price}
              rating={item.rating}
              maxGuests={item.maxGuests}
              image={item.image}
              amenities={item.amenities}
              onPress={() => router.push(`/booking/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.roomList}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa' },
  heroSection: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
  },
  heroTitle: { fontSize: 28, fontWeight: '400', color: 'white' },
  heroTitleGold: { fontSize: 38, fontWeight: 'bold', color: '#FFD700', marginTop: -4 },
  heroSubtitle: { fontSize: 14, color: '#cbd5e1', marginTop: 8 },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    borderRadius: 20,
    paddingVertical: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#1a2a4f' },
  statLabel: { fontSize: 11, color: '#8a9bc8', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#e5e7eb' },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a2a4f' },
  sectionSubtitle: { fontSize: 13, color: '#8a9bc8', marginTop: 4 },
  roomList: { paddingHorizontal: 16, paddingTop: 8 },
});
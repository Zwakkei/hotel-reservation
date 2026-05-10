import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const phoneNumber = '+1 (555) 123-4567';
  const email = 'reservations@hotelparadise.com';
  const address = '123 Beachfront Avenue, Malibu, CA 90265';

  const dialPhone = () => Linking.openURL(`tel:${phoneNumber.replace(/\D/g, '')}`);
  const sendEmail = () => Linking.openURL(`mailto:${email}`);
  const openMaps = () =>
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);

  const features = [
    { icon: 'restaurant-outline', title: 'Fine Dining', desc: '3 Michelin-starred restaurants' },
    { icon: 'water-outline', title: 'Luxury Spa', desc: 'Full-service wellness center' },      // ✅ Fixed: changed from 'spa-outline' to 'water-outline'
    { icon: 'barbell-outline', title: 'Fitness Center', desc: '24/7 state-of-the-art gym' },   // ✅ Fixed: changed from 'fitness-outline' to 'barbell-outline'
    { icon: 'car-outline', title: 'Valet Parking', desc: 'Complimentary for guests' },
  ];

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }}
        style={styles.heroImage}
      />
      
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.hotelName}>BlueHaven Grand Hotel</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Ionicons name="star" size={18} color="#FFD700" />
            <Ionicons name="star" size={18} color="#FFD700" />
            <Ionicons name="star" size={18} color="#FFD700" />
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>5.0 (2,345 reviews)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.sectionText}>
            Founded in 2014, BlueHaven Grand Hotel began with a simple vision: to create unforgettable experiences for travelers seeking luxury and comfort. What started as a single boutique hotel has grown into a premier hospitality brand with properties worldwide.

            Our journey has been defined by our unwavering commitment to excellence, innovation, and genuine care for our guests. Every hotel in our collection reflects our dedication to providing exceptional service and creating lasting memories.

            Today, we're proud to welcome millions of guests annually, offering them not just a place to stay, but a home away from home.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>World-Class Amenities</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Ionicons name={feature.icon as any} size={32} color="#FFD700" /> 
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.contactCard} onPress={dialPhone}>
            <View style={styles.contactIcon}>
              <Ionicons name="call" size={24} color="#FFD700" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{phoneNumber}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={sendEmail}>
            <View style={styles.contactIcon}>
              <Ionicons name="mail" size={24} color="#FFD700" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={openMaps}>
            <View style={styles.contactIcon}>
              <Ionicons name="location" size={24} color="#FFD700" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.hoursCard}>
          <Ionicons name="time-outline" size={24} color="#FFD700" />
          <View style={styles.hoursInfo}>
            <Text style={styles.hoursTitle}>Front Desk Hours</Text>
            <Text style={styles.hoursText}>24/7 - Always Open</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa' },
  heroImage: { width: width, height: 250 },
  content: { flex: 1, padding: 20 },
  titleSection: { marginBottom: 20 },
  hotelName: { fontSize: 32, fontWeight: 'bold', color: '#1a2a4f', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { marginLeft: 8, color: '#666', fontSize: 14 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a2a4f', marginBottom: 12 },
  sectionText: { fontSize: 15, lineHeight: 24, color: '#555' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  featureCard: {
    width: (width - 52) / 2,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureTitle: { fontSize: 14, fontWeight: '600', color: '#1a2a4f', marginTop: 8, textAlign: 'center' },
  featureDesc: { fontSize: 11, color: '#999', marginTop: 4, textAlign: 'center' },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  contactIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  contactValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2a4f',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  hoursInfo: { flex: 1 },
  hoursTitle: { fontSize: 16, fontWeight: '600', color: '#FFD700' },
  hoursText: { fontSize: 14, color: 'white', marginTop: 4 },
});
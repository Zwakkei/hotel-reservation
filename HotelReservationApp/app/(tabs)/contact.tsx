import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// 1. Define the type for contact options to satisfy TypeScript
interface ContactOption {
  icon: keyof typeof Ionicons.glyphMap; // This ensures the name is a valid Ionicon
  title: string;
  value: string;
  onPress: () => void;
  color: string;
}

export default function ContactScreen() {
  const phoneNumber = '+1 (555) 123-4567';
  const whatsappNumber = '+1 (555) 123-4568';
  const email = 'reservations@hotelparadise.com';
  const address = '123 Beachfront Avenue, Malibu, CA 90265';

  const dialPhone = () => Linking.openURL(`tel:${phoneNumber.replace(/\D/g, '')}`);
  const openWhatsApp = () => Linking.openURL(`whatsapp://send?phone=${whatsappNumber.replace(/\D/g, '')}`);
  const sendEmail = () => Linking.openURL(`mailto:${email}`);
  const openMaps = () => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);

  // 2. Apply the interface here
  const contactOptions: ContactOption[] = [
    { icon: 'call', title: 'Call Us', value: phoneNumber, onPress: dialPhone, color: '#34c759' },
    { icon: 'logo-whatsapp', title: 'WhatsApp', value: whatsappNumber, onPress: openWhatsApp, color: '#25D366' },
    { icon: 'mail', title: 'Email', value: email, onPress: sendEmail, color: '#007aff' },
    { icon: 'location', title: 'Visit Us', value: address, onPress: openMaps, color: '#ff3b30' },
  ];

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.mapContainer}>
        <TouchableOpacity style={styles.mapPlaceholder} onPress={openMaps}>
          <Ionicons name="map" size={50} color="#FFD700" />
          <Text style={styles.mapText}>View on Google Maps</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <Text style={styles.sectionSubtitle}>We're here to help 24/7</Text>
        
        {contactOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.contactCard} onPress={option.onPress}>
            <View style={[styles.contactIcon, { backgroundColor: `${option.color}15` }]}>
              {/* This line is now error-free because of the interface above */}
              <Ionicons name={option.icon} size={28} color={option.color} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{option.title}</Text>
              <Text style={styles.contactValue}>{option.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Hours</Text>
        <View style={styles.hoursCard}>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Front Desk</Text>
            <Text style={styles.hoursTime}>24/7</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Room Service</Text>
            <Text style={styles.hoursTime}>6:00 AM - 11:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Restaurant</Text>
            <Text style={styles.hoursTime}>7:00 AM - 10:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Spa</Text>
            <Text style={styles.hoursTime}>9:00 AM - 9:00 PM</Text>
          </View>
        </View>
      </View>

      <View style={styles.socialSection}>
        <Text style={styles.sectionTitle}>Follow Us</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-instagram" size={32} color="#1a2a4f" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-facebook" size={32} color="#1a2a4f" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-twitter" size={32} color="#1a2a4f" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            {/* 3. Changed 'logo-tripadvisor' to 'earth' as tripadvisor isn't in Ionicons */}
            <Ionicons name="earth" size={32} color="#1a2a4f" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa' },
  mapContainer: { padding: 20, paddingBottom: 0 },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#1a2a4f',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  mapText: { color: '#FFD700', fontSize: 16, fontWeight: '500' },
  section: { padding: 20, paddingBottom: 10 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a2a4f', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#8a9bc8', marginBottom: 20 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  contactIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  contactInfo: { flex: 1, marginLeft: 16 },
  contactTitle: { fontSize: 16, fontWeight: '600', color: '#1a2a4f', marginBottom: 2 },
  contactValue: { fontSize: 13, color: '#666' },
  hoursCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 2 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  hoursDay: { fontSize: 15, color: '#333' },
  hoursTime: { fontSize: 15, color: '#1a2a4f', fontWeight: '500' },
  socialSection: { padding: 20 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 30, marginTop: 16 },
  socialIcon: { padding: 10 },
});

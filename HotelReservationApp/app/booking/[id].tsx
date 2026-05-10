import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useAuth } from '../../context/AuthContext';

const ROOMS = {
  '1': { name: 'Deluxe Ocean View', price: 199, description: 'Stunning ocean views...' },
  '2': { name: 'Executive Suite', price: 349, description: 'Separate living room...' },
  '3': { name: 'Standard Double', price: 129, description: 'Comfortable and cozy...' },
  '4': { name: 'Family Studio', price: 249, description: 'Two bedrooms, kitchenette...' },
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const room = ROOMS[id as keyof typeof ROOMS];
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const { user, updateUser } = useAuth();

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = room.price * nights;

  const handleBooking = async () => {
    if (nights <= 0) {
      Alert.alert('Error', 'Check-out must be after check-in');
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      roomId: id,
      roomName: room.name,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      nights,
      totalPrice,
      bookedOn: new Date().toISOString(),
    };

    const users = await AsyncStorage.getItem('users');
    const usersList = JSON.parse(users || '[]');
    const userIndex = usersList.findIndex((u: any) => u.id === user?.id);
    
    if (userIndex !== -1) {
      usersList[userIndex].bookings = usersList[userIndex].bookings || [];
      usersList[userIndex].bookings.push(newBooking);
      await AsyncStorage.setItem('users', JSON.stringify(usersList));
      await updateUser(usersList[userIndex]);
      Alert.alert('Success', 'Room booked successfully!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/bookings') } 
      ]);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{room.name}</Text>
      <Text style={styles.price}>${room.price} per night</Text>
      <Text style={styles.description}>{room.description}</Text>

      <Text style={styles.label}>Check-in Date</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowCheckInPicker(true)}>
        <Text>{checkIn.toDateString()}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={showCheckInPicker}
        date={checkIn}
        onConfirm={(d) => {
          setShowCheckInPicker(false);
          setCheckIn(d);
        }}
        onCancel={() => setShowCheckInPicker(false)}
      />

      <Text style={styles.label}>Check-out Date</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowCheckOutPicker(true)}>
        <Text>{checkOut.toDateString()}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={showCheckOutPicker}
        date={checkOut}
        onConfirm={(d) => {
          setShowCheckOutPicker(false);
          setCheckOut(d);
        }}
        onCancel={() => setShowCheckOutPicker(false)}
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <Text>Nights: {nights}</Text>
        <Text style={styles.totalPrice}>Total: ${totalPrice}</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 22, color: '#1e3c72', marginBottom: 12 },
  description: { fontSize: 16, color: '#555', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  dateButton: { backgroundColor: '#f0f0f0', padding: 14, borderRadius: 12, marginBottom: 12 },
  summaryCard: { backgroundColor: '#eef2ff', padding: 16, borderRadius: 12, marginVertical: 16 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  totalPrice: { fontWeight: 'bold', color: '#1e3c72', marginTop: 8 },
  // Updated confirmButton styles
  confirmButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  confirmButtonText: {
    color: '#1a2a4f',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function BookingsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const allBookings = user?.bookings || [];
  const today = new Date();

  // Separate upcoming and past bookings
  const upcomingBookings = allBookings.filter(booking => 
    new Date(booking.checkOut) >= today
  ).sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  const pastBookings = allBookings.filter(booking => 
    new Date(booking.checkOut) < today
  ).sort((a, b) => new Date(b.checkOut).getTime() - new Date(a.checkOut).getTime());

  const BookingCard = ({ booking, isPast = false }: { booking: any; isPast?: boolean }) => (
    <View style={[styles.bookingCard, isPast && styles.pastBookingCard]}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingRoomName}>{booking.roomName}</Text>
        {isPast && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#8a9bc8" />
          <Text style={styles.detailText}>
            {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="moon-outline" size={16} color="#8a9bc8" />
          <Text style={styles.detailText}>{booking.nights} nights</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="wallet-outline" size={16} color="#FFD700" />
          <Text style={styles.priceText}>₱{booking.totalPrice}</Text>
        </View>
      </View>
      
      {!isPast && (
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFD700" />
        </TouchableOpacity>
      )}
    </View>
  );

  const EmptyState = ({ type }: { type: 'upcoming' | 'history' }) => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={type === 'upcoming' ? "calendar-outline" : "time-outline"} 
        size={80} 
        color="#ccc" 
      />
      <Text style={styles.emptyStateTitle}>
        {type === 'upcoming' ? 'No Upcoming Bookings' : 'No Booking History'}
      </Text>
      <Text style={styles.emptyStateText}>
        {type === 'upcoming' 
          ? 'Book your first room to see it here' 
          : 'Your past bookings will appear here'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
          {activeTab === 'upcoming' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
          {activeTab === 'history' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {activeTab === 'upcoming' ? (
          upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} isPast={false} />
            ))
          ) : (
            <EmptyState type="upcoming" />
          )
        ) : (
          pastBookings.length > 0 ? (
            pastBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} isPast={true} />
            ))
          ) : (
            <EmptyState type="history" />
          )
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 16,
    color: '#8a9bc8',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1a2a4f',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 60,
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  contentContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  pastBookingCard: {
    opacity: 0.8,
    backgroundColor: '#fdfdfd',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingRoomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2a4f',
  },
  completedBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#555',
    fontSize: 14,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a2a4f',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewDetailsText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2a4f',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8a9bc8',
    marginTop: 8,
    textAlign: 'center',
  },
});

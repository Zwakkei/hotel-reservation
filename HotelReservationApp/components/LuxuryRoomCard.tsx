import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface LuxuryRoomCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  maxGuests: number;
  image: string;
  amenities: string[];
  onPress: () => void;
}

export const LuxuryRoomCard: React.FC<LuxuryRoomCardProps> = ({
  name,
  price,
  rating,
  maxGuests,
  image,
  amenities,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.92}
    >
      <Image source={{ uri: image }} style={styles.image} />
      
      {/* Price Badge - Top Right */}
      <View style={styles.priceBadge}>
        <Text style={styles.priceCurrency}>$</Text>
        <Text style={styles.priceValue}>{price}</Text>
        <Text style={styles.pricePeriod}>/night</Text>
      </View>

      {/* Rating Badge - Top Left */}
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.roomName}>{name}</Text>
        
        {/* Amenities Row */}
        <View style={styles.amenitiesRow}>
          {amenities.slice(0, 3).map((amenity, idx) => (
            <View key={idx} style={styles.amenityChip}>
              <Ionicons name="checkmark-circle" size={12} color="#FFD700" />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        {/* Guest capacity */}
        <View style={styles.guestRow}>
          <Ionicons name="people-outline" size={16} color="#8a9bc8" />
          <Text style={styles.guestText}>Up to {maxGuests} guests</Text>
        </View>

        {/* CTA Button - 48px height for better tap target */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.bookButton} onPress={onPress}>
            <Text style={styles.bookButtonText}>View Room</Text>
            <Ionicons name="arrow-forward" size={18} color="#1a2a4f" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  image: {
    width: '100%',
    height: 220,
  },
  priceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'baseline',
    elevation: 3,
  },
  priceCurrency: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a2a4f',
    marginRight: 2,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a2a4f',
  },
  pricePeriod: {
    fontSize: 11,
    color: '#1a2a4f',
    marginLeft: 2,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 18,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a2a4f',
    marginBottom: 12,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 12,
    color: '#4a5568',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  guestText: {
    fontSize: 13,
    color: '#8a9bc8',
  },
  buttonContainer: {
    marginTop: 8,
  },
  bookButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14, // 48px total height
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 48, // Meets 44px+ requirement
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2a4f',
  },
});
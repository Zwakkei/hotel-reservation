import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string; // ✅ Added this to fix your visibility issue
}

export default function Logo({ 
  size = 'medium', 
  showText = true, 
  textColor = '#1a2a4f' // ✅ Default color for headers
}: LogoProps) {
    
  const getSize = () => {
    switch(size) {
      case 'small': return 40;
      case 'large': return 80;
      default: return 60;
    }
  };

  const iconSize = getSize();
  const textSize = size === 'small' ? 18 : size === 'large' ? 32 : 24;

  return (
    <View style={styles.container}>
      <View style={[
        styles.logoCircle, 
        { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }
      ]}>
        <View style={styles.logoInner}>
          <Ionicons name="bed" size={iconSize * 0.5} color="#FFD700" />
          <View style={[styles.starAccent, { top: -iconSize * 0.1, right: -iconSize * 0.15 }]}>
            <Ionicons name="star" size={iconSize * 0.25} color="#FFD700" />
          </View>
        </View>
      </View>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.logoText, { fontSize: textSize, color: textColor }]}>
            BlueHaven
          </Text>
          <Text style={[styles.tagline, { fontSize: textSize * 0.4 }]}>
            GRAND HOTEL
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    backgroundColor: '#1a2a4f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoInner: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starAccent: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tagline: {
    color: '#FFD700',
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 2,
  },
});

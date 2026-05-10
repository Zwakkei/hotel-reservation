import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';
import Logo from '../components/logo';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2a4f" />
      
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        {/* We pass textColor="white" so it stands out on the dark background */}
        <Logo size="large" showText={true} textColor="#ffffff" />
        
        {/* Subtle loading indicator */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#FFD700" />
        </View>
      </Animated.View>

      {/* Decorative accent at the bottom */}
      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={16} color="rgba(255,215,0,0.3)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a2a4f', // Your signature dark blue
  },
  loaderContainer: {
    marginTop: 50,
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    opacity: 0.5,
  }
});

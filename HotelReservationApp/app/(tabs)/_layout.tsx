import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import CustomHeader from '../../components/CustomHeader';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: (props) => {
          const titles = {
            index: 'BlueHaven',
            bookings: 'My Bookings',
            about: 'About Hotel',
          };
          const title = (titles as any)[props.route.name] || 'BlueHaven';
          return <CustomHeader title={title} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#8a9bc8',
        tabBarStyle: {
          backgroundColor: '#1a2a4f',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginTop: 4 },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="bookings" 
        options={{ 
          title: 'My Bookings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="about" 
        options={{ 
          title: 'Hotel',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "business" : "business-outline"} size={size} color={color} />
          ),
        }} 
      />

      {/* --- HIDDEN TABS --- */}
      {/* This removes the explore button from the bottom bar */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      
      {/* Hides profile and settings since they are in your header */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

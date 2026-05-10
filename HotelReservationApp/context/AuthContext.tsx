import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useSegments } from 'expo-router'; // Added useSegments
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  bookings: any[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- ADD THIS REDIRECT LOGIC ---
function useProtectedRoute(user: User | null, isLoading: boolean) {
  const segments = useSegments();
  
  useEffect(() => {
    if (isLoading) return;
    
    // Check if the current screen is in the (auth) group
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  // Initialize the protection logic
  useProtectedRoute(user, isLoading);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      let usersList = [];
      
      if (usersJson) {
        try {
          usersList = JSON.parse(usersJson);
        } catch (e) {
          usersList = []; // Reset if JSON is corrupted
        }
      }
      
      const emailExists = usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return { success: false, error: 'Email already exists.' };
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email.toLowerCase(),
        password: password,
        bookings: [],
      };
      
      usersList.push(newUser);
      
      // SAVE DATA
      await AsyncStorage.setItem('users', JSON.stringify(usersList));
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setUser(newUser);
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: 'Storage error. Please rebuild your app.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      if (!usersJson) return { success: false, error: 'No users found.' };
      
      const usersList = JSON.parse(usersJson);
      const foundUser = usersList.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(foundUser));
        setUser(foundUser);
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch (error: any) {
      return { success: false, error: 'Login failed.' };
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('currentUser');
    setUser(null);
    // Redirect will be handled by useProtectedRoute
  };

  const updateUser = async (userData: User) => {
    try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

interface CustomHeaderProps {
  title: string;
}

export default function CustomHeader({ title }: CustomHeaderProps) {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: signOut, style: 'destructive' }
    ]);
  };

  const MenuItem = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={20} color="#1a2a4f" />
      </View>
      <Text style={styles.menuItemText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerLeft}>
        <Image 
          source={{ uri: 'https://flaticon.com' }}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
      <View style={styles.headerRight}>
        {/* Notification Icon */}
        <TouchableOpacity style={styles.iconCircle}>
          <Ionicons name="notifications" size={22} color="#1a2a4f" />
          <View style={styles.badge} />
        </TouchableOpacity>

        {/* Profile Avatar Trigger */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>
              {user?.name?.charAt(0).toUpperCase() || 'G'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Facebook-style Popover Menu */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuPopover, { top: insets.top + 60 }]}>
            {/* User Profile Info */}
            <TouchableOpacity style={styles.profileSection} onPress={() => { setMenuVisible(false); router.push('/profile'); }}>
              <View style={styles.avatarLarge}>
                 <Text style={styles.avatarLargeText}>{user?.name?.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
                <Text style={styles.seeProfile}>See your profile</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Menu Options */}
            <MenuItem 
                icon="settings-sharp" 
                label="Settings & privacy" 
                onPress={() => { setMenuVisible(false); router.push('/settings'); }} 
            />
            <MenuItem 
                icon="help-circle" 
                label="Help & support" 
                onPress={() => setMenuVisible(false)} 
            />
            <MenuItem 
                icon="moon" 
                label="Display & accessibility" 
                onPress={() => setMenuVisible(false)} 
            />
            <MenuItem 
                icon="log-out" 
                label="Log out" 
                onPress={handleLogout} 
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
    zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 32, height: 32, borderRadius: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a2a4f' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a2a4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmallText: { color: '#FFD700', fontWeight: 'bold' },
  
  // Popover Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  menuPopover: {
    position: 'absolute',
    right: 16,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8 },
  avatarLarge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1a2a4f', justifyContent: 'center', alignItems: 'center' },
  avatarLargeText: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#1a2a4f' },
  seeProfile: { fontSize: 13, color: '#65676b' },
  divider: { height: 1, backgroundColor: '#ebedf0', marginVertical: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 8 },
  menuIconContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e4e6eb', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuItemText: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1c1e21' },
});

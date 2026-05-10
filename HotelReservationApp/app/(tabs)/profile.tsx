    import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

    export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    const menuItems = [
        { icon: 'person-outline', title: 'Personal Information', color: '#1a2a4f' },
        { icon: 'card-outline', title: 'Payment Methods', color: '#1a2a4f' },
        { icon: 'star-outline', title: 'Loyalty Points', value: '2,450 pts', color: '#FFD700' },
        { icon: 'gift-outline', title: 'Special Offers', color: '#1a2a4f' },
    ];

    return (
        <SafeAreaView style={styles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase()}
                </Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                <Ionicons name="camera" size={20} color="#FFD700" />
                </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Bookings</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                <Text style={styles.statNumber}>Gold</Text>
                <Text style={styles.statLabel}>Member Tier</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                <Text style={styles.statNumber}>2,450</Text>
                <Text style={styles.statLabel}>Points</Text>
                </View>
            </View>
            </View>

            <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem}>
                <View style={styles.menuLeft}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                    <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                {item.value && (
                    <Text style={styles.menuValue}>{item.value}</Text>
                )}
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
            ))}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={22} color="#dc2626" />
            <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>
            <View style={{ height: 30 }} />
        </ScrollView>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { padding: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1a2a4f' },
    profileCard: {
        backgroundColor: 'white',
        margin: 16,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    avatarContainer: { position: 'relative', marginBottom: 16 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { fontSize: 48, fontWeight: 'bold', color: '#1a2a4f' },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1a2a4f',
        padding: 8,
        borderRadius: 20,
    },
    userName: { fontSize: 24, fontWeight: 'bold', color: '#1a2a4f', marginBottom: 4 },
    userEmail: { fontSize: 14, color: '#666', marginBottom: 20 },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    statItem: { alignItems: 'center' },
    statNumber: { fontSize: 18, fontWeight: 'bold', color: '#1a2a4f' },
    statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
    statDivider: { width: 1, backgroundColor: '#eee' },
    menuSection: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 20,
        padding: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuTitle: { fontSize: 16, color: '#333', marginLeft: 12 },
    menuValue: { fontSize: 14, color: '#FFD700', fontWeight: '600' },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        margin: 16,
        padding: 16,
        backgroundColor: '#fee2e2',
        borderRadius: 12,
    },
    logoutText: { fontSize: 16, fontWeight: '600', color: '#dc2626' },
    versionText: { textAlign: 'center', color: '#999', marginTop: 20 },
    });
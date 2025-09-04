import { API_END_POINT_LOGOUT } from '@/api/Global';
import images from '@/constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  PixelRatio,
  BackHandler,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user);
      setLoading(false);
    };
    getUser();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (user && user !== '') {
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [user]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_END_POINT_LOGOUT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.message === 'Logout successful') {
        await AsyncStorage.clear();
        Alert.alert(data.message);
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={images.profile} style={styles.profileImage} />
          <Text style={styles.profileName}>{user ? user.name : 'Guest'}</Text>
          <Text style={styles.profilePhone}>{user ? user.mobile : ''}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsWrapper}>
          <TouchableOpacity onPress={() => router.push('/editprofile')}>
            <Option icon="person-outline" label="Edit Profile" />
          </TouchableOpacity>

          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="visibility" size={24} color="#555" />
              <Text style={styles.optionText}>Dark Mode</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={handleToggleDarkMode} />
          </View>

          <TouchableOpacity onPress={() => router.replace('/contact')}>
            <Option icon="help-outline" label="Help Center" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="logout" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const Option = ({ icon, label }) => (
  <View style={styles.option}>
    <View style={styles.optionLeft}>
      <Icon name={icon} size={24} color="#555" />
      <Text style={styles.optionText}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={22} color="#999" />
  </View>
);

// ✅ Scaling utils
const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

// ✅ Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: normalize(20),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: '#111',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: normalize(25),
    backgroundColor: '#fff',
    margin: normalize(16),
    borderRadius: normalize(16),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    marginBottom: normalize(12),
  },
  profileName: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: '#111',
  },
  profilePhone: {
    fontSize: normalize(14),
    color: '#666',
    marginTop: normalize(4),
  },
  optionsWrapper: {
    backgroundColor: '#fff',
    marginHorizontal: normalize(16),
    marginTop: normalize(10),
    borderRadius: normalize(12),
    paddingHorizontal: normalize(12),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: normalize(16),
    color: '#111',
    marginLeft: normalize(12),
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: normalize(16),
    marginTop: normalize(25),
    paddingVertical: normalize(14),
    borderRadius: normalize(12),
    backgroundColor: '#E53935',
  },
  logoutText: {
    fontSize: normalize(16),
    color: '#fff',
    fontWeight: '600',
    marginLeft: normalize(8),
  },
});

export default Profile;
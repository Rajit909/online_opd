import images from '@/constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [theme , setTheme] = useState('light');

  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser);
      setLoading(false);
    };
    getUser();
  }, []);

  console.log("User at profile",user);


  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", theme === 'dark');
  //   localStorage.setItem('theme', theme);
  // },[theme]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/sign-in');
  }  


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <>
    <SafeAreaView className=' h-full dark:bg-primary dark:text-white'>
      <ScrollView
       contentContainerStyle={{
        height: "100vh",
        marginTop: 20,
      }}
      >
      <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="account-circle"  size={24} color="#4285F4" />
        <Text className=" dark:text-white mr-8" style={styles.headerText}>Profile</Text>
        <Text></Text>
      </View>

      {/* Profile Image and Details */}
      <View style={styles.profileSection}>
        <Image
          source={images.profile} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <Text className=" dark:text-white"  style={styles.profileName}>{user.firstname +" "+ user.lastname}</Text>
        <Text style={styles.profilePhone} className=" dark:text-white">{user.mobile}</Text>
      </View>

      {/* Profile Options */}
      <View style={{paddingTop: 10}} className=" dark:text-white ">
        <TouchableOpacity onPress={() => router.push('/editprofile')}>
        <Option  icon="person-outline" label="Edit Profile" />
        </TouchableOpacity>
        
        {/* Dark Mode Toggle */}
        <View style={styles.option}>
          <View style={styles.optionLeft}>
            <Icon name="visibility" size={24} color="#555" />
            <Text style={styles.optionText}>Dark Mode</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={handleToggleDarkMode} />
        </View>
        <TouchableOpacity onPress={()=> router.replace("/contact")}>
        <Option icon="help-outline" label="Help Center" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutOption}
          onPress={logout}
        >
          <Icon name="logout" size={24} color="red" />
          <Text style={[styles.optionText, { color: 'red' }]} >Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

// Option component for individual profile options
const Option = ({ icon, label, rightText }) => (
  <View style={styles.option}>
    <View style={styles.optionLeft}>
      <Icon name={icon} size={24} color="#555" />
      <Text style={styles.optionText}>{label}</Text>
    </View>
    {rightText && <Text style={styles.rightText}>{rightText}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  profilePhone: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },

  
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,

  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 15,
  },
  rightText: {
    fontSize: 16,
    color: '#888',
  },
  logoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
});

export default Profile;

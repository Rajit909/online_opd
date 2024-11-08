import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // setup dark mode toggle
  

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/verifyuser');
  }  

  return (
    <>
    <SafeAreaView className=' h-full '>
      <ScrollView
       contentContainerStyle={{
        height: "100vh",
        marginTop: 20,
      }}
      >
      <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="account-circle" size={24} color="#4285F4" />
        <Text style={styles.headerText}>Profile</Text>
        <Text></Text>
      </View>

      {/* Profile Image and Details */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Andrew Ainsley</Text>
        <Text style={styles.profilePhone}>+1 111 467 378 399</Text>
      </View>

      {/* Profile Options */}
      <View style={styles.optionsContainer}>
        <Option icon="person-outline" label="Edit Profile" />
        
        {/* Dark Mode Toggle */}
        <View style={styles.option}>
          <View style={styles.optionLeft}>
            <Icon name="visibility" size={24} color="#555" />
            <Text style={styles.optionText}>Dark Mode</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={handleToggleDarkMode} />
        </View>


        {/* Logout */}
        <TouchableOpacity style={styles.logoutOption}
          onPress={logout}
        >
          <Icon name="logout" size={24} color="red" />
          <Text style={[styles.optionText, { color: 'red' }]}>Logout</Text>
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

  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default Profile;

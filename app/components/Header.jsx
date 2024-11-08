import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'; // You can also use other icon libraries
import icons from '@/constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const Header = ({name}) => {
  const logout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/verifyuser');
  }  
  return (
    <View style={styles.headerContainer}>
      {/* Profile Image and Text */}
      <View style={styles.profileContainer}>
        <Image
          source={icons.profile} // Replace with actual image URL
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.greetingText}>Good Morning 👋</Text>
          <Text style={styles.nameText}>{name}</Text>
        </View>
      </View>
      
      {/* Notification and Favorite Icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={logout}>
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    padding: 5,
  },
  greetingText: {
    fontSize: 12,
    color: 'gray',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default Header;
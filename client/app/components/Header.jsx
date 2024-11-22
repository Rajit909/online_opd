import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'; // You can also use other icon libraries
import icons from '@/constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { API_END_POINT_LOGOUT } from '@/api/Global';

const Header = ({name}) => {

  const [user, setUser] = useState({});

  const logout = async () => {
    try{
    const response = await fetch(`${API_END_POINT_LOGOUT}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data);
    if(data.message === 'Logout successful'){
      await AsyncStorage.clear();
      Alert.alert(data.message);
      router.push('/');
    }
      
    }catch(error){
      console.error(error);
    }
  }  

  useEffect(() => {
    const backAction = () =>{
      const getUser = async () => {
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        setUser(parsedUser);
        if(!user){
          router.replace('/');
        }
      };
      getUser();
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
    
  }, [router])
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
          <Text style={styles.nameText} >{JSON.stringify(name? name: "Guest")}</Text>
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
    paddingVertical: 40,
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
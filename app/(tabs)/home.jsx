import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser);
    };
    getUser();
  }, []);

  console.log(user);
  
  return (
   <>
    <SafeAreaView className="bg-gray-400 h-full">
        <ScrollView
          contentContainerStyle={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>
            Welcome to 
            {user ? ` ${user.firstname} ${user.lastname}` : " Home"}
          </Text>
        </ScrollView>
      </SafeAreaView>
   
   </>
  )
}

export default Home
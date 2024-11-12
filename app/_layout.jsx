import { View, Text} from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, SplashScreen, Stack } from 'expo-router'
import '../global.css'
import { useFonts } from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();



const  RootLayout = () => {

  
useEffect(() => {
  const checkAuth = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      router.push('/home');
    } else {
      router.push('/');
    }
  };

  checkAuth();
})


  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    // "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
    <Stack>
      <Stack.Screen name='index' options={{
        headerShown: false
      }} />
    <Stack.Screen name='(auth)' options={{
        headerShown: false
      }} />
    <Stack.Screen name='(tabs)' options={{
        headerShown: false
      }} />
    <Stack.Screen name='(screens)' options={{
        headerShown: false
      }} />
    </Stack>
    </>
  )
}

export default RootLayout
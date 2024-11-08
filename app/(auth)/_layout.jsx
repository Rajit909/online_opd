import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack>
       
        <Stack.Screen name='sign-up' options={{
          headerShown: false  
        }} />
        
         <Stack.Screen name='sign-in' options={{
          headerShown: false
        }} />

        <Stack.Screen name='forgetpassword' options={{
          headerShown: false  
        }} />
        <Stack.Screen name='verifyotp' options={{
          headerShown: false  
        }} />
        <Stack.Screen name='createpass' options={{
          headerShown: false  
        }} />
        <Stack.Screen name='verifyuser' options={{
          headerShown: false  
        }} />
      </Stack>
    </>
  )
}

export default AuthLayout
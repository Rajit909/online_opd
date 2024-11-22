import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ScreensLayout = () => {
  return (
    <>
        <Stack>
            <Stack.Screen name="editprofile" options={{
                headerShown: false,
                presentation: 'modal'
            }} />
            <Stack.Screen name="bookappointment" options={{
                headerShown: false
            }} />
            <Stack.Screen name="nextappointment" options={{
                headerShown: false
            }} />
            <Stack.Screen name="opdreport" options={{
                headerShown: false
            }} />

            <Stack.Screen name="appointmentreport" options={{
                headerShown: false
            }} />
            <Stack.Screen name="appointmentpreview" options={{
                headerShown: false
            }} />
            <Stack.Screen name="contact" options={{
                headerShown: false
            }} />


        </Stack>
    
    </>
  )
}

export default ScreensLayout
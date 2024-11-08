import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '../constants/images'
import CustomButton from './components/CustomButton'
import { router } from 'expo-router'

const App = () => {
  return (
  <>
  <SafeAreaView className='bg-gray-400 h-full'>
  <ScrollView contentContainerStyle={{ height: "100%", display:"flex", alignItems:"center"}}>
    <View>
      <Image 
        source={images.logo}
        style={{ width: 200, height: 400 }}
        resizeMode='contain'
      />
    </View>
        
        <Text className="text-white text-2xl font-bold">
          Welcome to GangaSheel 
          </Text>
          <Text className='text-white text-2xl font-bold'>Hospital </Text>
          
          <CustomButton
            title="Continue To Sign In"
            handlePress={() => router.push("/verifyuser")}
            containerStyle=" mt-7 mx-2"
          />
  </ScrollView>
  </SafeAreaView>
  </>
  )
}

export default App
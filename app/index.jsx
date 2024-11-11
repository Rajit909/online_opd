import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import images from '../constants/images'
import CustomButton from './components/CustomButton'
import { router } from 'expo-router'
import Banner from './components/Banner'

const App = () => {
  const BannerData = [
    { id: "1", title: "Item 1" },
    { id: "2", title: "Item 2" },
    { id: "3", title: "Item 3" },
    { id: "4", title: "Item 4" },
  ];
  return (
  <>
  <SafeAreaProvider>
  <SafeAreaView className='bg-gray-400 h-full'>
  <ScrollView contentContainerStyle={{ height: "100%", display:"flex", alignItems:"center"}}>
    <View>
      <Image 
        source={images.logo}
        style={{ width: 200, height:200 }}
        resizeMode='contain'
      />
    </View>

    <Banner data={BannerData}/>      

        <Text className="text-white text-2xl font-bold" style={{marginTop: 40}}>
          Welcome to GangaSheel 
          </Text>
          <Text className='text-white text-2xl font-bold'>Hospital </Text>
          
          <CustomButton
            title="Continue To Sign In"
            handlePress={() => router.push("/sign-in")}
            containerStyle=" mt-7 mx-2"
          />
  </ScrollView>
  </SafeAreaView>
  </SafeAreaProvider>
  </>
  )
}

export default App
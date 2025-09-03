import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import CustomButton from "./components/CustomButton";
import { Redirect, router } from "expo-router";
import Banner from "./components/Banner";

const App = () => {
  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView className="bg-gradient-to-b from-blue-50 to-white h-full">
          <ScrollView
            contentContainerStyle={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <View className="mt-14">
              <Image
                source={images.logo}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
            </View>

            <Banner />

            <View className="items-center mt-20">
              <Text className="text-3xl font-extrabold text-blue-800 text-center">
                Welcome to GangaSheel
              </Text>
              <Text className="text-2xl font-bold text-gray-600 text-center">
                Hospital
              </Text>
              <Text className="text-base text-gray-400 mt-2 text-center px-6">
                Your health, our priority. Book appointments and access services
                easily.
              </Text>
            </View>

            <CustomButton
              title="Continue To Sign In"
              handlePress={() => router.push("/sign-in")}
              containerStyle=" mt-20 mx-2"
            />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

export default App;

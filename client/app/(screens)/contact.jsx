import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackBtn from "../components/BackBtn";

const EditProfile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser);
    };
    getUser();
  }, []);

  return (
    <SafeAreaView className="bg-indigo-50 h-full">
      <BackBtn
        title={"Contact Us"}
        styles={{ paddingHorizontal: 20, paddingVertical: 20 }}
        handlePress={() => router.replace("/profile")}
      />
      <ScrollView
        contentContainerStyle={{
          minHeight: Dimensions.get("window").height - 100,
          alignItems: "center",
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        {/* Logo */}
        <Image
          source={images.logo}
          style={{ width: 220, height: 100, marginTop: 30 }}
          resizeMode="contain"
        />

        {/* Intro */}
        <Text
          className="font-medium text-gray-700 text-center"
          style={{ fontSize: 16, marginTop: 30, lineHeight: 22 }}
        >
          If you need any help or support, feel free to contact us anytime.
        </Text>

        {/* Contact Card */}
        <View
          className="bg-white rounded-xl shadow-md w-full p-5 mt-8"
          style={{
            borderWidth: 1,
            borderColor: "#e0e0e0",
          }}
        >
          <Text
            className="text-lg font-semibold text-gray-800 mb-4 text-center"
          >
            Get in Touch
          </Text>

          <View className="bg-indigo-100 rounded-md p-3 mb-3">
            <Text className="text-gray-800 font-medium text-base">
              📧 Email:{" "}
              <Text className="text-indigo-700">abc@gmail.com</Text>
            </Text>
          </View>

          <View className="bg-indigo-100 rounded-md p-3">
            <Text className="text-gray-800 font-medium text-base">
              📞 Phone:{" "}
              <Text className="text-indigo-700">123456789</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

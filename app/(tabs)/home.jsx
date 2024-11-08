import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Header from "../components/Header";
import icons from "@/constants/icons";
import Crad from "../components/Crad";

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

  console.log("User at home",user);

  return (
    <>
      <SafeAreaView className="h-full">
        <ScrollView
          contentContainerStyle={{
            height: "100vh",
            display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
          }}
    >
          <View>

            <Header name={user.firstname} />

            <View className="py-5 flex justify-center items-center gap-5">
              <Text className=" font-bold text-3xl px-4 font-plight">
                Services
              </Text>
              <View className="flex flex-col gap-5">
                <Crad
                title={"Book a Appointment"}
                icon={icons.appointment}
                bgColor={"blue"}
                textColor={"text-white"}
                />
                <Crad
                title={"Appointment Report"}
                icon={icons.medical_report}
                bgColor={"#209F84"}
                textColor={"text-white"}
                />
                <Crad
                title={"OPD Report"}
                icon={icons.report}
                bgColor={"#EF4444"}
                textColor={"text-white"}
                />
                <Crad
                title={"Upcoming Appointment"}
                icon={icons.nextappointment}
                bgColor={"#2781D5"}
                textColor={"text-white"}
                />
              </View>
             
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;

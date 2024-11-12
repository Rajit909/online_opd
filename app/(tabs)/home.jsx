import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import Header from "../components/Header";
import icons from "@/constants/icons";
import Card from "../components/Card";
import Banner from "../components/Banner";

const Home = () => {
  const [user, setUser] = useState({});


  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);


  const data = [
    { id: "1", title: "Item 1" },
    { id: "2", title: "Item 2" },
    { id: "3", title: "Item 3" },
    { id: "4", title: "Item 4" },
  ];

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser);
    };
    getUser();
  }, []);

  console.log("User at home", user);

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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <View >
              <Header name={user.firstname} />
            </View>
            {/* horizontal flatlist for banner */}
              
              <Banner data={data}/>
            <View className="py-5 flex justify-center items-center gap-5">
              <Text className=" font-bold text-3xl px-4 font-plight">
                Quick Access
              </Text>
              <View className="flex flex-col gap-5">
                <TouchableOpacity
                  onPress={() => router.push("/bookappointment")}
                >
                  <Card
                    title={"Book an Appointment"}
                    icon={icons.appointment}
                    bgColor={"blue"}
                    textColor={"text-white"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/appointmentreport")}
                >
                  <Card
                    title={"Appointment Report"}
                    icon={icons.medical_report}
                    bgColor={"#209F84"}
                    textColor={"text-white"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/opdreport")}
                >
                  <Card
                    title={"OPD Report"}
                    icon={icons.report}
                    bgColor={"#EF4444"}
                    textColor={"text-white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/nextappointment")}
                >
                  <Card
                    title={"Upcoming Appointment"}
                    icon={icons.nextappointment}
                    bgColor={"#2781D5"}
                    textColor={"text-white"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;

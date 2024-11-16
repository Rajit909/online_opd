import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Header from "../components/Header";
import icons from "@/constants/icons";
import Card from "../components/Card";
import Banner from "../components/Banner";

// Get screen width and height
const { width, height } = Dimensions.get("window");

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <Header name={user.firstname} />

          {/* Banner */}
          <Banner data={data} />

          {/* Quick Access Section */}
          <View
            style={{ paddingVertical: height * 0.02, alignItems: "center" }}
          >
            <Text style={{ fontSize: width * 0.08, fontWeight: "bold" }}>
              Quick Access
            </Text>

            <View style={{ width: width * 0.92, marginTop: height * 0.02 }}>
              {/* Cards */}
              {[
                {
                  title: "Book an Appointment",
                  icon: icons.appointment,
                  bgColor: "blue",
                  route: "/bookappointment",
                },
                {
                  title: "Appointment Report",
                  icon: icons.medical_report,
                  bgColor: "#209F84",
                  route: "/appointmentreport",
                },
                {
                  title: "OPD Report",
                  icon: icons.report,
                  bgColor: "#EF4444",
                  route: "/opdreport",
                },
                {
                  title: "Upcoming Appointment",
                  icon: icons.nextappointment,
                  bgColor: "#2781D5",
                  route: "/nextappointment",
                },
              ].map((card, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push(card.route)}
                  style={{ marginVertical: height * 0.01 }}
                >
                  <Card
                    title={card.title}
                    icon={card.icon}
                    bgColor={card.bgColor}
                    textColor="text-white"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
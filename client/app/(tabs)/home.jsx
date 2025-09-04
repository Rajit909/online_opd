import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StyleSheet,
  Platform,
  BackHandler,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Header from "../components/Header";
import icons from "@/constants/icons";
import Card from "../components/Card";
import Banner from "../components/Banner";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        setUser(parsedUser?.user?.name || null);

        if (parsedUser?.user) {
          router.replace("/home");
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.replace("/");
      }
    };
    getUser();
  }, []);

  // Prevent back navigation if logged in
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (user) {
        return true; // block back navigation
      }
      return false; // allow default
    });

    return () => backHandler.remove();
  }, [user]);

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Quick access cards
  const quickAccess = [
    {
      title: "Book an Appointment",
      icon: icons.appointment,
      bgColor: Platform.OS === "ios" ? "purple" : "blue",
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header name={user || "Guest"} />

        <Banner
          data={
            Platform.OS === "ios"
              ? []
              : [
                  { id: "1", title: "Item" },
                  { id: "2", title: "Another" },
                ]
          }
        />

        <View style={styles.quickAccessContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <View style={styles.cardContainer}>
            {quickAccess.map((card, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(card.route)}
                activeOpacity={0.8}
                style={styles.cardTouchable}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContainer: { flexGrow: 1 },
  quickAccessContainer: {
    paddingVertical: height * 0.01,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#111827",
  },
  cardContainer: {
    width: width * 0.85,
    marginTop: height * 0.02,
  },
  cardTouchable: {
    marginVertical: height * 0.01,
  },
});

export default Home;

import React, { useEffect, useState } from "react";
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
  Alert
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
  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Handle back press to prevent going back to the login page
  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user?.name?.toString());

      // If the user is logged in, replace the login page
      if (parsedUser && parsedUser.user) {
        router.replace("/home");
      } else {
        router.replace("/"); // Navigate to login page if not logged in
      }
    };

    getUser();

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      // Prevent going back if user is logged in
      if (user && user !== "") {
        // Do nothing and prevent back navigation
        return true;
      }
      // Allow back navigation if user is not logged in (i.e., on login screen)
      return false;
    });

    // Cleanup the event listener when the component unmounts
    return () => backHandler.remove();
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.innerContainer}>
          {/* Header */}
          <Header name={user ? user : "Guest"} />

          {/* Banner */}
          <Banner data={Platform.OS === "ios" ? [] : [{ id: "1", title: "Item" }]} />

          {/* Quick Access Section */}
          <View style={styles.quickAccessContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>

            <View style={styles.cardContainer}>
              {[{ title: "Book an Appointment", icon: icons.appointment, bgColor: Platform.OS === "ios" ? "purple" : "blue", route: "/bookappointment" },
              { title: "Appointment Report", icon: icons.medical_report, bgColor: "#209F84", route: "/appointmentreport" },
              { title: "OPD Report", icon: icons.report, bgColor: "#EF4444", route: "/opdreport" },
              { title: "Upcoming Appointment", icon: icons.nextappointment, bgColor: "#2781D5", route: "/nextappointment" }]
                .map((card, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => router.push(card.route)}
                    style={styles.cardTouchable}
                  >
                    <Card
                      title={card.title}
                      icon={card.icon}
                      bgColor={card.bgColor}
                      textColor="text-white"

                      backHandler={BackHandler}

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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  innerContainer: { flex: 1 },
  quickAccessContainer: {
    paddingVertical: height * 0.02,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: width * (Platform.OS === "ios" ? 0.07 : 0.08),
    fontWeight: "bold",
  },
  cardContainer: {
    width: width * 0.8,
    marginTop: height * 0.02,
  },
  cardTouchable: { marginVertical: height * 0.01 },
});

export default Home;

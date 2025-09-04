import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import BackBtn from "../components/BackBtn";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_END_POINT_GET_ALL_APPOINTMENTS } from "@/api/Global";

const NextAppointment = () => {
  const [user, setUser] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user);
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_APPOINTMENTS}`)
      .then((response) => response.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const [usersAppointments, setUsersAppointments] = useState([]);
  useEffect(() => {
    if (appointments.length > 0) {
      const filterAppointments = appointments.filter(
        (appointment) => appointment.entby === (user ? user.mobile : "")
      );
      setUsersAppointments(filterAppointments);
    }
  }, [appointments, user]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Header name={user ? user.name : "Guest"} />
          <BackBtn
            styles={{ paddingHorizontal: 10, paddingVertical: 10 }}
            handlePress={() => router.replace("/home")}
          />

          <Text style={styles.title}>Upcoming Appointments</Text>

          {usersAppointments?.length > 0 ? (
            usersAppointments.map((appointment, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.doctor}>Dr. {appointment.doctor_name}</Text>
                <Text style={styles.info}>Department: {appointment.name}</Text>
                <Text style={styles.info}>Date: {appointment.ap_date}</Text>
                <Text style={styles.info}>Time: {appointment.ap_time}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                No upcoming appointments. Please book an appointment first.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  card: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctor: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  info: { fontSize: 16, color: "#555", marginVertical: 2 },
  emptyBox: {
    margin: 20,
    padding: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },
  emptyText: { fontSize: 16, color: "#777", textAlign: "center" },
});

export default NextAppointment;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_END_POINT_BOOK_APPOINTMENT } from "@/api/Global";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BackBtn from "../components/BackBtn";

const AppointmentPreview = () => {
  const {
    selectedDoctor,
    uhid,
    drid,
    fee,
    departments,
    selectedDate,
    selectedTime,
    patientName,
    patientAge,
    selectedGender,
    mobile,
    slectedStatus,
    email,
    address,
    city,
    slectedState,
    aadhar,
  } = useGlobalSearchParams();

  const [success, setSuccess] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user);
    };
    getUser();
  }, []);

  const submit = async () => {
    try {
      const appointment = {
        drid: drid,
        uhid: uhid,
        fee: fee,
        ap_date: selectedDate,
        ap_time: selectedTime,
        entby: mobile,
        id: user.id,
      };

      const response = await fetch(`${API_END_POINT_BOOK_APPOINTMENT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });

      const text = await response.text();
      let data = JSON.parse(text);

      if (response.ok) {
        setSuccess(data.message || "Appointment booked successfully!");
        Alert.alert("Success", data.message || "Appointment booked successfully!");
        setTimeout(() => router.replace("/nextappointment"), 2000);
      } else {
        Alert.alert("Error", data.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const renderRow = (label, value) => {
    if (!value) return null;
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <BackBtn
            styles={{ marginTop: 10, marginBottom: 20 }}
            handlePress={() => router.replace("/bookappointment")}
          />

          <Text style={styles.heading}>Appointment Preview</Text>

          <View style={styles.card}>
            {renderRow("Doctor", selectedDoctor)}
            {renderRow("Department", departments)}
            {renderRow("Date", selectedDate)}
            {renderRow("Time", selectedTime)}
          </View>

          <View style={styles.card}>
            {renderRow("Patient Name", patientName)}
            {renderRow("Age", patientAge)}
            {renderRow("Gender", selectedGender)}
            {renderRow("Mobile", mobile)}
            {renderRow("Email", email)}
            {renderRow("Marital Status", slectedStatus)}
            {renderRow("Address", address)}
            {renderRow("City", city)}
            {renderRow("State", slectedState)}
            {renderRow("Aadhar", aadhar)}
          </View>

          {success ? <Text style={styles.successBox}>{success}</Text> : null}

          <TouchableOpacity style={styles.confirmButton} onPress={submit}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  label: { fontWeight: "bold", fontSize: 16, color: "#333" },
  value: { fontSize: 16, color: "#555" },
  successBox: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  confirmText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default AppointmentPreview;
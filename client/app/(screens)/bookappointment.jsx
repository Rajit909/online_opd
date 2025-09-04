import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import BackBtn from "../components/BackBtn";
import SavedPatient from "../components/Savedpatient";
import OtherAppointment from "../components/Otherappointment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_END_POINT_GET_ALL_PATIENT } from "@/api/Global";

const BookAppointment = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [user, setUser] = useState({});
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_PATIENT}`)
      .then((response) => response.json())
      .then((data) => setPatientData(data))
      .catch((error) => console.error(error));
  }, []);

  const fetchPatient = patientData?.filter(
    (patient) => patient.mobile === user.mobile
  );

  const renderComponent = () => {
    if (selectedValue === "other") return <OtherAppointment />;
    if (selectedValue) return <SavedPatient id={selectedValue} />;
    return null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <BackBtn
            styles={{ paddingHorizontal: 10, paddingVertical: 20 }}
            handlePress={() => router.replace("/home")}
          />

          <Text style={styles.heading}>Book Appointment</Text>

          <Text style={styles.label}>Appointment For</Text>

          {/* Patient Selection */}
          <View style={styles.card}>
            <Picker
              selectedValue={selectedValue}
              style={styles.picker}
              dropdownIconColor="#555"
              onValueChange={(itemValue) => {
                setSelectedValue(itemValue);
                const patient = fetchPatient.find((p) => p.id === itemValue);
                setSelectedPatient(patient);
              }}
            >
              <Picker.Item label="Select patient" value="" />
              {fetchPatient.map((patient) => (
                <Picker.Item
                  key={patient.id}
                  label={patient.name}
                  value={patient.id}
                />
              ))}
              <Picker.Item label="Add Other patient" value="other" />
            </Picker>
          </View>

          {/* Render selected component */}
          <View style={styles.componentContainer}>{renderComponent()}</View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default BookAppointment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  scrollContent: { paddingBottom: 30 },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 20,
    color: "#555",
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    width: "100%",
    height: 70,
    borderRadius: 3
  },
  componentContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

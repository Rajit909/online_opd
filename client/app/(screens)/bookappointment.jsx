import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
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
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(""); // No default selection
  const [selectedPatient, setSelectedPatient] = useState(null); // To store selected patient details
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user);
    };
    getUser();
  }, []);


  const [patientData, setPatientData] = useState([]);

  // get all patients
  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_PATIENT}`)
      .then((response) => response.json())
      .then((data) => {
        setPatientData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  // Fetch patients by mobile number
  const fetchPatient = patientData?.filter((patient) => patient.mobile === user.mobile)

  
  // Components to render based on selection
  const renderComponent = () => {
    if (selectedValue === "other") {
      return <OtherAppointment />;
    }
    if (selectedValue) {
      return <SavedPatient id={selectedValue}/>;
    }
    return null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <BackBtn
            styles={{ paddingHorizontal: 10, paddingVertical: 20 }}
            handlePress={() => router.replace("/home")}
          />
          <Text style={styles.heading}>Book Appointment</Text>

          <Text style={styles.label}>Appointment for</Text>

          {/* Patient Selection */}
          <View style={styles.container}>
            <Picker
              selectedValue={selectedValue}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setSelectedValue(itemValue);

                // Update the selected patient details if it matches a saved patient
                const patient = fetchPatient.find((p) => p.id === itemValue);
                setSelectedPatient(patient);
              }}
            >
              <Picker.Item label="Select patient" value="" />
              {/* List all saved patients */}
              {fetchPatient.map((patient) => (
                <Picker.Item
                  key={patient.id}
                  label={patient.name}
                  value={patient.id}
                />
              ))}
              <Picker.Item label="Add Other patient" value="other" />
            </Picker>

            {/* Render the selected component */}
            <View style={styles.componentContainer}>{renderComponent()}</View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default BookAppointment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
    alignSelf: "center",
  },
  label: { fontSize: 18, marginVertical: 10, marginLeft: 20 },
  picker: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    minHeight: 20,
  },
  componentContainer: { marginTop: 20 },
});

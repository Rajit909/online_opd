import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  API_END_POINT_GET_ALL_CITY,
  API_END_POINT_SAVE_PATIENT,
} from "@/api/Global";

const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];

const OtherAppointment = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [age, setAge] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [mobile, setMobile] = useState("");
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user || {});
      setMobile(parsedUser.user?.mobile || "");
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_END_POINT_GET_ALL_CITY);
        if (!response.ok) throw new Error("Failed to fetch cities.");
        const cityData = await response.json();
        setData(cityData);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Unable to fetch cities. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);

  const states = [...new Set(data.map((item) => item.state))];

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity("");
    const filteredCities = data
      .filter((item) => item.state === state)
      .map((item) => item.city);
    setCities(filteredCities);
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (
      !first_name ||
      !fname ||
      !mobile ||
      !address ||
      !selectedState ||
      !selectedCity ||
      !selectedGender ||
      !age
    ) {
      setError("Please fill all the details to save patient.");
      setIsLoading(false);
      return;
    }

    if (!/^\d{12}$/.test(aadhar)) {
      setError("Aadhar number must be 12 digits.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_END_POINT_SAVE_PATIENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          fname,
          mob: mobile,
          email,
          aadhar,
          gender: selectedGender,
          marital: selectedStatus,
          age,
          address,
          city: selectedCity,
          state: selectedState,
        }),
      });

      if (!response.ok) throw new Error("HTTP error: " + response.status);

      const result = await response.json();
      if (result.success) {
        setSuccess("Patient saved successfully.");
        Alert.alert("Success", "Patient saved successfully.", [
          { text: "OK", onPress: () => router.push("/bookappointment") },
        ]);
      } else {
        setError(result.message || "An error occurred.");
      }
    } catch (error) {
      setError("Something went wrong, Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        )}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.heading}>Register New Patient</Text>

          <View style={styles.card}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter patient first name"
              value={first_name}
              onChangeText={setFirst_name}
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter patient last name"
              value={last_name}
              onChangeText={setLast_name}
            />

            <Text style={styles.label}>Father/Husband Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter father/husband name"
              value={fname}
              onChangeText={setFname}
            />

            <Text style={styles.label}>Patient Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter patient age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Select Gender</Text>
            <View style={styles.genderContainer}>
              {["Male", "Female"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    selectedGender === gender && styles.selected,
                  ]}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text
                    style={
                      selectedGender === gender
                        ? styles.selectedText
                        : styles.genderText
                    }
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Marital Status</Text>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={setSelectedStatus}
              style={styles.picker}
            >
              <Picker.Item label="Select status" value="" />
              {MARITAL_STATUSES.map((status) => (
                <Picker.Item key={status} label={status} value={status} />
              ))}
            </Picker>

            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile no."
              value={mobile}
              onChangeText={setMobile}
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>State</Text>
            <Picker
              selectedValue={selectedState}
              onValueChange={handleStateChange}
              style={styles.picker}
            >
              <Picker.Item label="Select state" value="" />
              {states.map((state) => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>

            {selectedState && (
              <>
                <Text style={styles.label}>City</Text>
                <Picker
                  selectedValue={selectedCity}
                  onValueChange={setSelectedCity}
                  style={styles.picker}
                >
                  <Picker.Item label="Select city" value="" />
                  {cities.map((city) => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </>
            )}

            <Text style={styles.label}>Aadhar No.</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Aadhar no."
              value={aadhar}
              onChangeText={setAadhar}
              keyboardType="number-pad"
            />

            {error ? <Text style={styles.errorBox}>{error}</Text> : null}
            {success ? <Text style={styles.successBox}>{success}</Text> : null}

            <TouchableOpacity style={styles.bookButton} onPress={submit}>
              <Text style={styles.bookButtonText}>Save Patient</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  card: {
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: "500", marginTop: 10, marginLeft: 5 },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fafafa",
  },
  picker: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    borderRadius: 8,
  },
  genderContainer: { flexDirection: "row", marginTop: 8, marginBottom: 12 },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    alignItems: "center",
  },
  selected: { backgroundColor: "#007bff", borderColor: "#007bff" },
  genderText: { textAlign: "center", color: "#333", fontWeight: "500" },
  selectedText: { textAlign: "center", color: "#fff", fontWeight: "600" },
  errorBox: {
    backgroundColor: "#ffe6e6",
    color: "#cc0000",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    textAlign: "center",
  },
  successBox: {
    backgroundColor: "#e6ffed",
    color: "#007f00",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: "#007bff",
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default OtherAppointment;

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
import BackBtn from "./BackBtn";
import {
  API_END_POINT_GET_ALL_CITY,
  API_END_POINT_GET_ALL_DOCTORS,
  API_END_POINT_GET_ALL_SCHEDULE,
  API_END_POINT_SAVE_PATIENT,
} from "@/api/Global";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtherAppointment = ({ patient }) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});

  // const [selectedDoctor, setSelectedDoctor] = useState('');
  // const [selectedDepartment, setSelectedDepartment] = useState('');
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [slectedStatus, setSelectedStatus] = useState("");
  const [mobile, setMobile] = useState(''); 
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");

  // const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  // const [docData, setDocData] = useState([]);

  // const [scheduleData, setScheduleData] = useState([]);
  // const [times, setTimes] = useState([]);
  // set date and time from toadys date


  useEffect(() => {
    const getUser = async () => {
      // Fetch user details from AsyncStorage
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user);
      setMobile(parsedUser.user.mobile);
    };
    getUser();
  }, []);
  


 



  // get all city
  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_CITY}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // get all doctors
  // useEffect(() => {
  //   fetch(`${API_END_POINT_GET_ALL_DOCTORS}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setDocData(data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  // get all schedule
  // useEffect(() => {
  //   fetch(`${API_END_POINT_GET_ALL_SCHEDULE}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setScheduleData(data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  // console.log("Schedule",scheduleData)

  // Extract unique states
  const states = [...new Set(data.map((item) => item.state))];

  // Handle state change and filter cities
  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity(""); // Reset selected city when state changes
    const filteredCities = data
      .filter((item) => item.state === state)
      .map((item) => item.city);
    setCities(filteredCities);
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Input validation
    if (
      !name ||
      !fname ||
      !mobile ||
      !email ||
      !address ||
      !selectedState ||
      !selectedCity ||
      !aadhar ||
      !selectedGender ||
      !slectedStatus ||
      !age
    ) {
      setError("Please fill all the details to save patient.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_END_POINT_SAVE_PATIENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          fname,
          mob: mobile,
          email,
          aadhar,
          gender: selectedGender,
          marital: slectedStatus,
          age,
          address,
          city: selectedCity,
          state: selectedState,
        }),
      });

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
      }

      const result = await response.json();
      if (result.success) {
        setSuccess("Patient saved successfully.");
        Alert.alert("Success", "Patient saved successfully.", [
          { text: "OK", onPress: () => router.push("/bookappointment") },
        ]);
        setTimeout(()=> {
          setSuccess("");
        },[3000])
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Something went wrong, Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView  style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Patient Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter patient name"
            value={name}
            onChangeText={setName}
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
            <TouchableOpacity
              style={[
                styles.genderButton,
                selectedGender === "Male" && styles.selected,
              ]}
              onPress={() => setSelectedGender("Male")}
            >
              <Text
                style={
                  selectedGender === "Male"
                    ? styles.selectedText
                    : styles.genderText
                }
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                selectedGender === "Female" && styles.selected,
              ]}
              onPress={() => setSelectedGender("Female")}
            >
              <Text
                style={
                  selectedGender === "Female"
                    ? styles.selectedText
                    : styles.genderText
                }
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Marital status</Text>
          <Picker
            selectedValue={slectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select anyone" value="" />

            {["Single", "Married", "Divorced", "Widowed"].map((status) => (
              <Picker.Item key={status.id} label={status} value={status} />
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
          <Text style={styles.label}>Email.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-pad"
          />

          <Text style={styles.label}>Address.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={address}
            onChangeText={setAddress}
            keyboardType="email-pad"
          />

          {/* State Selection */}
          <Text style={styles.label}>State</Text>
          <Picker
            selectedValue={selectedState}
            onValueChange={(value) => handleStateChange(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select State" value="" />
            {states.map((state, index) => (
              <Picker.Item key={index} label={state} value={state} />
            ))}
          </Picker>

          {/* City Selection */}
          {selectedState && (
            <>
              <Text style={styles.label}>City</Text>
              <Picker
                selectedValue={selectedCity}
                onValueChange={(value) => setSelectedCity(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select City" value="" />
                {cities.map((city, index) => (
                  <Picker.Item key={index} label={city} value={city} />
                ))}
              </Picker>
            </>
          )}

          <Text style={styles.label}>Aadhar No.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Aadhar No."
            value={aadhar}
            onChangeText={setAadhar}
            keyboardType="number-pad"
          />

          {error ? (
            <Text style={{ color: "red", marginHorizontal: 20 }}>{error}</Text>
          ) : null}

          {success ? (
            <Text style={{ color: "green", marginHorizontal: 20 }}>
              {success}
            </Text>
          ) : null}
          <TouchableOpacity style={styles.bookButton} onPress={submit}>
            <Text style={styles.bookButtonText}>Save patient</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default OtherAppointment;

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
  dateButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    alignItems: "center",
  },
  dateText: { fontSize: 14, color: "#333" },
  timeButton: {
    margin: 8,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    alignItems: "center",
    width: "45%",
  },
  timeText: { fontSize: 14, color: "#333" },
  timeText2: { backgroundColor: "#FE7646", color: "#ddd" },
  timeText3: { color: "#ddd" },
  selected: { backgroundColor: "#007bff", borderColor: "#007bff" },
  selectedText: { color: "#fff" },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  genderButton: {
    padding: 10,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  genderText: { fontSize: 16, color: "#333" },
  bookButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  bookButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

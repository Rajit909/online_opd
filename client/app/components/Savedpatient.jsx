import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import {
  API_END_POINT_GET_ALL_DOCTORS,
  API_END_POINT_GET_ALL_PATIENT,
} from "@/api/Global";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SavedPatient = ({ id }) => {
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const [patientData, setPatientData] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [docData, setDocData] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  // today’s date (formatted as YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

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

  const fetchedPatient = patientData.filter(
    (patient) => patient.mobile === user.mobile
  );
  const filteredPatient = fetchedPatient.find((patient) => patient.id == id);

  useEffect(() => {
    if (filteredPatient) {
      setPatientName(filteredPatient.name);
      setPatientAge(filteredPatient.age);
      setMobile(filteredPatient.mobile);
      setSelectedGender(filteredPatient.gender);
    }
  }, [filteredPatient]);

  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_DOCTORS}`)
      .then((response) => response.json())
      .then((data) => setDocData(data))
      .catch((error) => console.error(error));
  }, []);

  // generate time slots locally (e.g. 9 AM - 5 PM, every 30 min)
  const generateTimeSlots = (startTime = "09:00", endTime = "17:00") => {
    const slots = [];
    let current = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    while (current <= end) {
      slots.push(
        current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      current = new Date(current.getTime() + 30 * 60000); // 30 min step
    }
    return slots;
  };

  useEffect(() => {
    // whenever doctor is selected, regenerate time slots
    if (selectedDoctor) {
      const slots = generateTimeSlots("09:00", "17:00");
      setTimes(slots);
    }
  }, [selectedDoctor]);

  const departments = docData
    .filter((doctor) => doctor.name === selectedDoctor)
    .map((doctor) => doctor.dept);

  const selectedDoctors = docData.find(
    (doctor) => doctor.name === selectedDoctor
  );
  const drid = selectedDoctors?.id;
  const fee = selectedDoctors?.fee;
  const uhid = filteredPatient?.uhid;

  const handleNext = () => {
    if (!selectedDoctor || !selectedTime || !patientName || !selectedGender) {
      setError("Please fill all the details to book an appointment.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    router.push({
      pathname: "/appointmentpreview",
      params: {
        selectedDoctor,
        departments,
        uhid,
        drid,
        fee,
        selectedDate: today, // always today
        selectedTime,
        patientName,
        patientAge,
        selectedGender,
        mobile,
      },
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Patient Details</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={patientName} editable={false} />

            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} value={patientAge} editable={false} />

            <Text style={styles.label}>Mobile</Text>
            <TextInput style={styles.input} value={mobile} editable={false} />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {["Male", "Female"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    selectedGender === gender && styles.selected,
                  ]}
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
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Doctor Selection</Text>

            <Text style={styles.label}>Select Doctor</Text>
            <Picker
              selectedValue={selectedDoctor}
              onValueChange={(value) => setSelectedDoctor(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Doctor" value="" />
              {docData.map((doctor) => (
                <Picker.Item
                  key={doctor.id}
                  label={doctor.name}
                  value={doctor.name}
                />
              ))}
            </Picker>

            <Text style={styles.label}>Department</Text>
            <Text style={styles.infoText}>
              {departments.length > 0
                ? departments.join(", ")
                : "Select Doctor first"}
            </Text>

            <Text style={styles.label}>Date</Text>
            <Text style={styles.infoText}>{today}</Text>

            {selectedDoctor && (
              <>
                <Text style={styles.label}>Time</Text>
                <Picker
                  selectedValue={selectedTime}
                  onValueChange={(value) => setSelectedTime(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Time Slot" value="" />
                  {times.map((time, index) => (
                    <Picker.Item key={index} label={time} value={time} />
                  ))}
                </Picker>
              </>
            )}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.bookButton} onPress={handleNext}>
            <Text style={styles.bookButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SavedPatient;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: { padding: 3 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#333" },
  label: { fontSize: 16, marginVertical: 6, color: "#555" },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  infoText: { fontSize: 16, color: "#333", marginBottom: 10 },
  genderContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  genderText: { fontSize: 16, color: "#333" },
  selected: { backgroundColor: "#007bff", borderColor: "#007bff" },
  selectedText: { fontSize: 16, color: "#fff" },
  errorBox: {
    backgroundColor: "#ffe5e5",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: "#ffcccc",
    borderWidth: 1,
  },
  errorText: { color: "#d32f2f", fontSize: 14, textAlign: "center" },
  bookButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  bookButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

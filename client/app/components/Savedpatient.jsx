import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { router} from 'expo-router';
import { API_END_POINT_GET_ALL_CITY, API_END_POINT_GET_ALL_DOCTORS, API_END_POINT_GET_ALL_PATIENT, API_END_POINT_GET_ALL_SCHEDULE } from '@/api/Global';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SavedPatient = ({id}) => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);

  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      // Fetch user details from AsyncStorage
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
  const fetchedPatient = patientData.filter((patient) => patient.mob === user.mobile)
  // console.log("fetchPatient",fetchedPatient)
  // find patient by id from fecthedPatient 
  const filteredPatient = fetchedPatient.find((patient) => patient.id == id)
  // console.log("filteredPatient",filteredPatient)
  
  useEffect(() => {
    if (filteredPatient) {
      setPatientName(filteredPatient.name);
      setPatientAge(filteredPatient.age);
      setMobile(filteredPatient.mob);
      setSelectedGender(filteredPatient.gender);
    }
  }, [filteredPatient]);

  const [patientName, setPatientName] = useState(filteredPatient ? filteredPatient.name : "");
const [patientAge, setPatientAge] = useState(filteredPatient ? filteredPatient.age : "");
const [mobile, setMobile] = useState('');

  
  const [docData, setDocData] = useState([]);
  
  const [scheduleData, setScheduleData] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  // console.log(selectedDoctor, selectedDepartment, selectedDate, selectedTime, patientName, selectedGender);

  // get all doctors
  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_DOCTORS}`)
      .then((response) => response.json())  
      .then((data) => {
        setDocData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // get all schedule
  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_SCHEDULE}`)
      .then((response) => response.json())  
      .then((data) => {
        setScheduleData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  
 
  const dates = [
    ...new Set(
      scheduleData
        .map((item) => new Date(item.date))
        .filter((date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(today.getDate() + 7);
          // skip sunday date
          if(date.getDay() === 0) return false;
          return date >= today && date <= sevenDaysFromNow;
        })
        .map((date) => date.toISOString().split('T')[0])
    ),
  ];

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    let current = new Date(`1970-01-01T${startTime}`); // Convert start time to Date object
    const end = new Date(`1970-01-01T${endTime}`); // Convert end time to Date object
  
    // Log current and end times
    // console.log("Current Time:", current);
    // console.log("End Time:", end);
  
    while (current <= end) {
      slots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Add time in HH:MM format
      current = new Date(current.getTime() + 10 * 60000); // Increment by 10 minutes
    }
  
    // console.log("Generated Time Slots:", slots); // Log generated slots
    return slots;
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset selected time when date changes
  
    // Filter scheduleData for selected date
    const startTimes = scheduleData
      .filter((item) => item.date === date)
      .map((item) => item.time1); // Get start times
  
    const endTimes = scheduleData
      .filter((item) => item.date === date)
      .map((item) => item.time2); // Get end times

    if (startTimes.length > 0 && endTimes.length > 0) {
      const startTime = startTimes[0]; // Get the first start time
      const endTime = endTimes[0]; // Get the first end time
  
      // Generate time slots
      const timeSlots = generateTimeSlots(startTime, endTime);
      setTimes(timeSlots); // Update state with generated time slots
    } else {
      setTimes([]); // No time slots available for the selected date
    }
  };
  
  
  
  // slecting department based on doctor using id 
  const departments = docData.filter(doctor => doctor.name === selectedDoctor).map(doctor => doctor.quali)
    
  const handleNext = () => {
    if (!selectedDoctor || !selectedDate || (!selectedTime && !null) || !patientName || !selectedGender) {
      Alert.alert('Error', 'Please fill all the details to book an appointment.');
      setError('Please fill all the details to book an appointment.');
      setTimeout(() => {
        setError('');
      }
      , 3000);
      return;
    }
    
    router.push({
      pathname: '/appointmentpreview',
      params: {
        selectedDoctor,
        departments,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        patientName,
        patientAge,
        selectedGender,
        mobile,
      },
    });
  }

  
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <ScrollView>
      {/* <Text style={styles.label}>Patient Name</Text> */}
        {/* <TextInput
          style={styles.input}
          placeholder="Enter patient name"
          value={patientName}
          onChangeText={setPatientName}
        /> */}

        <Text style={styles.label}>Patient Age</Text>
        <TextInput
          style={styles.input} 
          placeholder="Enter patient age"
          value={patientAge}
          onChangeText={setPatientAge}
          keyboardType="number-pad"
          editable={false}
        />
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input} 
          placeholder="Enter patient age"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="number-pad"
          editable={false}
        />

        <Text style={styles.label}>Select Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Male' && styles.selected]}
          >
            <Text style={selectedGender === 'Male' ? styles.selectedText : styles.genderText} >Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Female' && styles.selected]}
            
          >
          
          <Text style={selectedGender === 'Female' ? styles.selectedText : styles.genderText}  >Female</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.label}>Select Doctor</Text>
        <Picker
          selectedValue={selectedDoctor}
          onValueChange={(value) => {
            setSelectedDoctor(value);
            setSelectedDepartment(''); // Reset department if doctor changes
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select Doctor" value="" />
          {docData.map((doctor) => (
            
            <Picker.Item key={doctor.id} label={doctor.name} value={doctor.name} />
          ))}
        </Picker>

        <Text style={styles.label}>Doctor's Department</Text>
        <Text style={styles.picker}>
        {departments.length > 0 ? departments.join(", ") : 'Select Doctor first'}
        </Text>


          {/* Date Selection */}
        <Text style={styles.label}>Date</Text>
          <Picker
            selectedValue={selectedDate}
            onValueChange={(value) => handleDateChange(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Date" value="" />
            {dates.map((date, index) => (
              <Picker.Item key={index} label={date} value={date} />
            ))}
          </Picker>

          {/* Time Selection */}
          {selectedDate && (
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

        {error ? <Text style={{ color: 'red', marginHorizontal: 20 }}>{error}</Text> : null}
   
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  heading: { fontSize: 24, fontWeight: 'bold', margin: 20, alignSelf: 'center' },
  label: { fontSize: 18, marginVertical: 10, marginLeft: 20 },
  picker: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    minHeight: 20
  },
  dateButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
  },
  dateText: { fontSize: 14, color: '#333' },
  timeButton: {
    margin: 8,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
    width: '45%',
  },
  timeText: { fontSize: 14, color: '#333' },
  timeText2: { backgroundColor: '#FE7646', color: '#ddd'},
  timeText3: { color: '#ddd'},
  selected: { backgroundColor: '#007bff', borderColor: '#007bff' },
  selectedText: { color: '#fff' },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  genderButton: {
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  genderText: { fontSize: 16, color: '#333' },
  bookButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});


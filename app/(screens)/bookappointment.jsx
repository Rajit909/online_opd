import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { router} from 'expo-router';
import BackBtn from '../components/BackBtn';


const BookAppointment = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isloading, setIsLoading] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);

  console.log(selectedDoctor, selectedDepartment, selectedDate, selectedTime, patientName, selectedGender);

  const doctors = [
    { id: '1', name: 'Dr. John Doe' , department: 'Cardiology'},
    { id: '2', name: 'Dr. Sarah Smith', department: 'Orthopedics' },
    { id: '3', name: 'Dr. Michael Brown', department: 'Dermatology' },
  ]

  // slecting department based on doctor using id 
  const departments = doctors.filter(doctor => doctor.name === selectedDoctor).map(doctor => doctor.department)
  console.log(departments)

  // Generate dates for the next 7 days starting from today and hide weekends
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    // Get day name with date
    const day = date.toLocaleDateString('en-US', { weekday: 'short' , });
    const dayDate = date.toLocaleDateString('en-US', { day: 'numeric' , month: 'short' }); 
    return { id: i + 1, day, dayDate };
  }
).filter(date => !['Sun'].includes(date.day));

  const times = [
    { id: 1, slot: '10:00 AM - 10:05 AM', isAvailable: true },
    { id: 2, slot: '10:05 AM - 10:10 AM', isAvailable: false },
    { id: 3, slot: '10:10 AM - 10:15 AM', isAvailable: true },
    { id: 4, slot: '10:15 AM - 10:20 AM', isAvailable: true },
    { id: 5, slot: '10:20 AM - 10:25 AM', isAvailable: false },
    { id: 6, slot: '10:25 AM - 10:30 AM', isAvailable: true },
    { id: 7, slot: '10:30 AM - 10:35 AM', isAvailable: true },
    { id: 8, slot: '10:35 AM - 10:40 AM', isAvailable: false },
    { id: 9, slot: '10:40 AM - 10:45 AM', isAvailable: true },
    { id: 10, slot: '10:45 AM - 10:50 AM', isAvailable: true },
    { id: 11, slot: '10:50 AM - 10:55 AM', isAvailable: false },
    { id: 12, slot: '10:55 AM - 11:00 AM', isAvailable: true },
    { id: 13, slot: '11:00 AM - 11:05 AM', isAvailable: true },
    { id: 14, slot: '11:05 AM - 11:10 AM', isAvailable: false },
    { id: 15, slot: '11:10 AM - 11:15 AM', isAvailable: true },
    { id: 16, slot: '11:15 AM - 11:20 AM', isAvailable: true },
    { id: 17, slot: '11:20 AM - 11:25 AM', isAvailable: false },
    { id: 18, slot: '11:25 AM - 11:30 AM', isAvailable: true },
    { id: 19, slot: '11:30 AM - 11:35 AM', isAvailable: true },
    { id: 20, slot: '11:35 AM - 11:40 AM', isAvailable: false },
    { id: 21, slot: '11:40 AM - 11:45 AM', isAvailable: true },
    { id: 22, slot: '11:45 AM - 11:50 AM', isAvailable: true },
    { id: 23, slot: '11:50 AM - 11:55 AM', isAvailable: false },
    { id: 24, slot: '11:55 AM - 12:00 PM', isAvailable: true },
    { id: 25, slot: '12:00 PM - 12:05 PM', isAvailable: true },
    { id: 26, slot: '12:05 PM - 12:10 PM', isAvailable: false },
    { id: 27, slot: '12:10 PM - 12:15 PM', isAvailable: true },
    { id: 28, slot: '12:15 PM - 12:20 PM', isAvailable: true },
    { id: 29, slot: '12:20 PM - 12:25 PM', isAvailable: false },
    { id: 30, slot: '12:25 PM - 12:30 PM', isAvailable: true },
    { id: 31, slot: '12:30 PM - 12:35 PM', isAvailable: true },
    { id: 32, slot: '12:35 PM - 12:40 PM', isAvailable: false },
    { id: 33, slot: '12:40 PM - 12:45 PM', isAvailable: true },
    { id: 34, slot: '12:45 PM - 12:50 PM', isAvailable: true },
    { id: 35, slot: '12:50 PM - 12:55 PM', isAvailable: false },
    { id: 36, slot: '12:55 PM - 01:00 PM', isAvailable: true },
    { id: 37, slot: '01:00 PM - 01:05 PM', isAvailable: true },
    { id: 38, slot: '01:05 PM - 01:10 PM', isAvailable: false },
    { id: 39, slot: '01:10 PM - 01:15 PM', isAvailable: true },
    { id: 40, slot: '01:15 PM - 01:20 PM', isAvailable: true },
    { id: 41, slot: '01:20 PM - 01:25 PM', isAvailable: false },
    { id: 42, slot: '01:25 PM - 01:30 PM', isAvailable: true },
    { id: 43, slot: '01:30 PM - 01:35 PM', isAvailable: true },
    { id: 44, slot: '01:35 PM - 01:40 PM', isAvailable: false },
    { id: 45, slot: '01:40 PM - 01:45 PM', isAvailable: true },
    { id: 46, slot: '01:45 PM - 01:50 PM', isAvailable: true },
    { id: 47, slot: '01:50 PM - 01:55 PM', isAvailable: false },
    { id: 48, slot: '01:55 PM - 02:00 PM', isAvailable: true },
    { id: 49, slot: '02:00 PM - 02:05 PM', isAvailable: true },
  ];

  
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
        selectedDate: selectedDate.day,
        selectedTime: selectedTime.slot,
        patientName,
        patientAge,
        selectedGender,
      },
    });
  }
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <BackBtn styles={{paddingHorizontal: 10, paddingVertical: 20}} handlePress={() => router.replace('/home')}/>
        <Text style={styles.heading}>Book Appointment</Text>
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
          {doctors.map((doctor) => (
            
            <Picker.Item key={doctor.id} label={doctor.name} value={doctor.name} />
          ))}
        </Picker>

        <Text style={styles.label}>Doctor's Department</Text>
        <Text style={styles.picker}>
        {departments.length > 0 ? departments.join(", ") : 'Select Doctor first'}
        </Text>
        
      <ScrollView >
        <Text style={styles.label}>Select Date</Text>
        <FlatList
          data={dates}
          nestedScrollEnabled={true}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.dateButton, selectedDate?.id === item.id && styles.selected]}
              onPress={() => setSelectedDate(item)}
            >
              <Text style={selectedDate?.id === item.id ? styles.selectedText : styles.dateText}>{item.day + "-" + item.dayDate}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
        </ScrollView>

        <ScrollView>

        <Text style={styles.label}>Select Time</Text>
        <FlatList
          data={times}
          numColumns={2}
          nestedScrollEnabled={true}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={item.isAvailable == true ? [styles.timeButton, selectedTime?.id === item.id && styles.selected] : [styles.timeButton, styles.timeText2]}
              onPress={() => setSelectedTime(item.isAvailable==true ? item : null)}
            >
              <Text style={item.isAvailable==true ? (selectedTime?.id === item.id ? styles.selectedText : styles.timeText): styles.timeText3 }>{
                  item.isAvailable == true ? item.slot : `${item.slot} (Not Available)`
                }</Text>
            </TouchableOpacity>
          )}
          />
          </ScrollView>
        <Text style={styles.label}>Patient Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient name"
          value={patientName}
          onChangeText={setPatientName}
        />

        <Text style={styles.label}>Patient Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient age"
          value={patientAge}
          onChangeText={setPatientAge}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Select Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Male' && styles.selected]}
            onPress={() => setSelectedGender('Male')}
          >
            <Text style={selectedGender === 'Male' ? styles.selectedText : styles.genderText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Female' && styles.selected]}
            onPress={() => setSelectedGender('Female')}
          >
            <Text style={selectedGender === 'Female' ? styles.selectedText : styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={{ color: 'red', marginHorizontal: 20 }}>{error}</Text> : null}
   
        <TouchableOpacity style={styles.bookButton} onPress={handleNext}>
          <Text style={styles.bookButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default BookAppointment;


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
    padding: 10,
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

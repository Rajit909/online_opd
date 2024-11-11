import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { router} from 'expo-router';


const BookAppointment = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isloading, setIsLoading] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientName, setPatientName] = useState('');
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

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return { id: i, day: date.toDateString() };
  });

  const times = [
    { id: 1, slot: '10:00 AM - 12:00 PM' },
    { id: 2, slot: '12:00 PM - 02:00 PM' },
    { id: 3, slot: '02:00 PM - 04:00 PM' },
    { id: 4, slot: '04:00 PM - 06:00 PM' },
  ];

  
  const handleNext = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !patientName || !selectedGender) {
      Alert.alert('Error', 'Please fill all the details to book an appointment.');
      setError('Please fill all the details to book an appointment.');
      setTimeout(() => {
        setError('');
      }
      , 3000);
      return;
    }
    
    router.push({
      pathname: '/appointmentreport',
      params: {
        selectedDoctor,
        departments,
        selectedDate: selectedDate.day,
        selectedTime: selectedTime.slot,
        patientName,
        selectedGender,
      },
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
        

        <Text style={styles.label}>Select Date</Text>
        <FlatList
          data={dates}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.dateButton, selectedDate?.id === item.id && styles.selected]}
              onPress={() => setSelectedDate(item)}
            >
              <Text style={selectedDate?.id === item.id ? styles.selectedText : styles.dateText}>{item.day}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.label}>Select Time</Text>
        <FlatList
          data={times}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.timeButton, selectedTime?.id === item.id && styles.selected]}
              onPress={() => setSelectedTime(item)}
            >
              <Text style={selectedTime?.id === item.id ? styles.selectedText : styles.timeText}>{item.slot}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.label}>Patient Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient name"
          value={patientName}
          onChangeText={setPatientName}
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
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
    width: '45%',
  },
  timeText: { fontSize: 14, color: '#333' },
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

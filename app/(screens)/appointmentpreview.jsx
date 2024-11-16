import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_END_POINT_BOOK_APPOINTMENT } from '@/api/Global';

 
const AppointmentPreview = () => {
  const { selectedDoctor, departments, selectedDate, selectedTime, patientName, patientAge, selectedGender } = useGlobalSearchParams();
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser.user);
      }
    getUser();
  }, []);

  const submit = async () => {
    try {
      const appointment = {
        doctor: selectedDoctor,
        department: departments,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        patient_name: patientName,
        patient_age: patientAge,
        gender: selectedGender,
        id: user.id, // Assuming the user has an id in the user object
      };
  
      // Send the data to the PHP backend to save in the database
      const response = await fetch(`${API_END_POINT_BOOK_APPOINTMENT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
  
      const text = await response.text(); // Capture the raw response as text
      console.log("Raw Response:", text);
  
      // Try to parse the response as JSON
      let data;
        data = JSON.parse(text);
        if (response.ok) {
          setSuccess(data.message || 'Appointment booked successfully!');
          Alert.alert('Success', data.message || 'Appointment booked successfully!');
          // store appointment in user object in AsyncStorage
          const storedUser = await AsyncStorage.getItem("user");
          const parsedUser = storedUser ? JSON.parse(storedUser) : {};
          const updatedUser = { ...parsedUser, appointments: [...(parsedUser.appointments || []), appointment] };
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
          console.log("Updated User:", updatedUser);
          router.push('/nextappointment');
        } else {
          Alert.alert('Error', data.message || 'Failed to book appointment. Please try again later.');
        }
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Appointment Preview</Text>

      <Text style={styles.label}>Doctor: {selectedDoctor}</Text>
      <Text style={styles.label}>Department: {departments}</Text>
      <Text style={styles.label}>Date: {selectedDate}</Text>
      <Text style={styles.label}>Time: {selectedTime}</Text>
      <Text style={styles.label}>Patient Name: {patientName}</Text>
      <Text style={styles.label}>Patient Age: {patientAge}</Text>
      <Text style={styles.label}>Gender: {selectedGender}</Text>

      {
        success ? (
          <Text style={{ color: 'green', textAlign: 'center', marginVertical: 10 }}>{success}</Text>
        ) : null
      }

      <TouchableOpacity style={styles.bookButton} onPress={() => router.replace('/bookappointment')}>
        <Text style={styles.bookButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bookButton} onPress={submit}>
        <Text style={styles.bookButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 18, marginVertical: 10 },
  bookButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AppointmentPreview;

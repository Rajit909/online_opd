import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

 
const AppointmentPreview = () => {
  const { selectedDoctor, departments, selectedDate, selectedTime, patientName, patientAge, selectedGender } = useGlobalSearchParams();
  const [success, setSuccess] = useState('');

  const submit = async () => {

    try{
      // get the user from the async storage
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      //create appointments and store the appointment in the async storage for the user
      const appointment = {
        doctor: selectedDoctor,
        department: departments,
        date: selectedDate,
        time: selectedTime,
        patientName: patientName,
        patientAge: patientAge,
        patientGender: selectedGender,
      };
      // save appointment to the user
      const appointments = parsedUser.appointments || [];
      appointments.push(appointment);
      parsedUser.appointments = appointments;
      await AsyncStorage.setItem("user", JSON.stringify(parsedUser));
      Alert.alert('Appointment Booked!');
      setSuccess('Appointment Booked!');
      setTimeout(() => {
        setSuccess('');
        router.replace('/nextappointment');
      }, 2000);
      console.log(parsedUser);
    }catch(error){
      console.log(error);
    }
  }


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

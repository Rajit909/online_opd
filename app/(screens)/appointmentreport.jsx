import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';

 
const AppointmentPreview = () => {
  const { selectedDoctor, departments, selectedDate, selectedTime, patientName, selectedGender } = useGlobalSearchParams();
  const [success, setSuccess] = useState('');

  const submit = () => {
    Alert.alert('Appointment Booked!');
    setSuccess('Appointment Booked!');
    setTimeout(() => {
      setSuccess('');
      router.replace('/home');
    }, 2000);
  }


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Appointment Preview</Text>

      <Text style={styles.label}>Doctor: {selectedDoctor}</Text>
      <Text style={styles.label}>Department: {departments}</Text>
      <Text style={styles.label}>Date: {selectedDate}</Text>
      <Text style={styles.label}>Time: {selectedTime}</Text>
      <Text style={styles.label}>Patient Name: {patientName}</Text>
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

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_END_POINT_BOOK_APPOINTMENT } from '@/api/Global';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BackBtn from '../components/BackBtn';

 
const AppointmentPreview = () => {
  const { selectedDoctor, departments, selectedDate, selectedTime, patientName, patientAge, selectedGender, mobile, slectedStatus, email, address, city, slectedState, aadhar} = useGlobalSearchParams();
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
        drname: selectedDoctor,
        dept: departments,
        ap_date: selectedDate,
        ap_time: selectedTime,
        entby: mobile,
        id: user.id, // Assuming the user has an id in the user object
      };

      console.log("Appointment preview:", appointment);
  
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
          // // store appointment in user object in AsyncStorage
          // const storedUser = await AsyncStorage.getItem("user");
          // const parsedUser = storedUser ? JSON.parse(storedUser) : {};
          // const updatedUser = { ...parsedUser, appointments: [...(parsedUser.appointments || []), appointment] };
          // await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
          // console.log("Updated User:", updatedUser);
          setTimeout(() => {
            router.replace('/nextappointment');
          }
          , 3000);
        } else {
          Alert.alert('Error', data.message || 'Failed to book appointment. Please try again later.');
        }
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };
  

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
      <View style={styles.container}>
      <View >
      <BackBtn
            styles={{marginTop: 20 }}
            handlePress={() => router.replace('/bookappointment')}
          />
      <Text style={styles.heading}>Appointment Preview</Text>
      </View>

      <Text style={styles.label}>Doctor: {selectedDoctor}</Text>
      <Text style={styles.label}>Department: {departments}</Text>
      <Text style={styles.label}>Date: {selectedDate}</Text>
      <Text style={styles.label}>Time: {selectedTime}</Text>
      <Text style={styles.label}>Patient Name: {patientName}</Text>
      <Text style={styles.label}>Patient Age: {patientAge}</Text>
      <Text style={styles.label}>Gender: {selectedGender}</Text>
      <Text style={styles.label}>Mobile: {mobile}</Text>
      {
        email ? (
          <Text style={styles.label}>Email: {email}</Text>
        ) : null
      }
      {
        slectedStatus ? (
          <Text style={styles.label}>Marital Status: {slectedStatus}</Text>
        ) : null
      }
      {
        address ? (
          <Text style={styles.label}>Address: {address}</Text>
        ) : null
      }
      {
        city ? (
          <Text style={styles.label}>City: {city}</Text>
        ) : null
      }
      {
        slectedState ? (
          <Text style={styles.label}>State: {slectedState}</Text>
        ) : null
      }
      {
        aadhar ? (
          <Text style={styles.label}>Aadhar: {aadhar}</Text>
        ) : null
      }
      {
        success ? (
          <Text style={{ color: 'green', textAlign: 'center', marginVertical: 10 }}>{success}</Text>
        ) : null
      }
{/* 
      <TouchableOpacity style={styles.bookButton} onPress={() => router.replace('/bookappointment')}>
        <Text style={styles.bookButtonText}>Edit</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.bookButton} onPress={submit}>
        <Text style={styles.bookButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
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

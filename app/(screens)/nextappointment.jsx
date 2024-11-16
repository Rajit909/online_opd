import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BackBtn from '../components/BackBtn';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NextAppointment = () => {
  const [user, setUser] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);


  useEffect(() => {
    const getUser = async () => {
      // Fetch user details from AsyncStorage
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setLoading(false);
      setUser(parsedUser.user);
      setAppointments(parsedUser.appointments || []);
    };
    getUser();
  }, []);

  console.log("user at next appoin...",user);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full">
        <ScrollView contentContainerStyle={{ height: '100vh', display: 'flex' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{paddingHorizontal:10}}>
            <Header name={user.firstname} />
            <BackBtn
              styles={{ paddingHorizontal: 10, paddingVertical: 10 }}
              handlePress={() => router.replace('/home')}
            />

            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Upcoming Appointments</Text>

            {
             appointments?.length > 0 ? (
              appointments.map((appointment, idx) => (
                <View
                  key={idx}
                  style={{
                    marginVertical: 10,
                    padding: 15,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Doctor:{appointment.doctor} </Text>
                  <Text>Date:{appointment.appointment_date} </Text>
                  <Text>Time:{appointment.appointment_time} </Text>
                  <Text>Department:{appointment.department} </Text>
                </View>
              ))
            ) : (
              <Text style={{ marginTop: 20 }}>No upcoming appointments. Please Book a Appointment First.</Text>
            )
            
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default NextAppointment;

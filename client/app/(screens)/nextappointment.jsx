import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BackBtn from '../components/BackBtn';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_END_POINT_GET_ALL_APPOINTMENTS } from '@/api/Global';

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
    };
    getUser();
  }, []);



  console.log("user at next appoin...",user);

  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_APPOINTMENTS}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setAppointments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });           
  
  },[])

  const [usersAppointments, setUsersAppointments] = useState([]);
  useEffect(() => {
    if(appointments.length > 0){
      const filterAppointments = appointments.filter(appointment => appointment.entby === (user?user.mobile:""));
      setUsersAppointments(filterAppointments);
    }
  },[appointments])

  console.log("usersAppointments", usersAppointments);
  
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
            <Header name={user? user.name: "Guest"} />
            <BackBtn
              styles={{ paddingHorizontal: 10, paddingVertical: 10 }}
              handlePress={() => router.replace('/home')}
            />

            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Upcoming Appointments</Text>

            {
             usersAppointments?.length > 0 ? (
              usersAppointments.map((appointment, idx) => (
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
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Doctor:{appointment.drname} </Text>
                  <Text>Date:{appointment.ap_date} </Text>
                  <Text>Time:{appointment.ap_time} </Text>
                  <Text>Department:{appointment.dept} </Text>
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

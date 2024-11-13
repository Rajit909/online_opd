import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BackBtn from '../components/BackBtn';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OpdReport = () => {
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
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser);
      setLoading(false);
      setAppointments(parsedUser.appointments);
    };
    getUser();
  }, []);

  console.log("user's appointments",user.appointments);

  const opdReport = [
    {
      id: 1,
      opdreport : "No report available"
    }
  ]

  // const fetchAppointments = async (userId) => {
  //   try {
  //     // Replace with your API endpoint for fetching appointments
  //     const response = await fetch(`https://api.example.com/appointments?userId=${userId}`);
  //     const data = await response.json();
      
  //     setAppointments(data.upcomingAppointments); // Adjust based on actual API response
  //   } catch (error) {
  //     console.error("Error fetching appointments:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

 

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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        >
            <Header name={user.firstname} />
          <View style={{paddingHorizontal:10}}>
            <BackBtn
              styles={{ paddingVertical: 10 }}
              handlePress={() => router.replace('/home')}
            />

            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Opd Reports</Text>

            {
             opdReport?.length > 0 ? (
              opdReport.map((item) => (
                <View
                  key={item.id}
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
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Doctor's Report: {item.opdreport}</Text>
                  
                </View>
              ))
            ) : (
              <Text style={{ marginTop: 20 }}></Text>
            )
            
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default OpdReport;
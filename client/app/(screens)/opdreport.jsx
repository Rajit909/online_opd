import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BackBtn from '../components/BackBtn';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OpdReport = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setLoading(false);
      setUser(parsedUser.user);
    };
    getUser();
  }, []);

  const opdReport = [
    {
      id: 1,
      opdreport: 'No report available',
    },
  ];

  if (loading) {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Header */}
          <Header name={user ? user.name : 'Guest'} />

          {/* Back Button */}
          <View style={{ paddingHorizontal: 16 }}>
            <BackBtn
              styles={{ paddingVertical: 10 }}
              handlePress={() => router.replace('/home')}
            />

            {/* Title */}
            <Text style={styles.title}>OPD Reports</Text>

            {/* Reports List */}
            {opdReport?.length > 0 ? (
              opdReport.map((item) => (
                <View key={item.id} style={styles.reportCard}>
                  <Text style={styles.reportText}>
                    Doctor's Report: {item.opdreport}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReportText}>No reports available.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default OpdReport;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    color: '#111',
  },
  reportCard: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  noReportText: {
    marginTop: 20,
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});

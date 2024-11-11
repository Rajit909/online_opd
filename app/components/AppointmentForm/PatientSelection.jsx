import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const patients = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Devid' },
];

const PatientSelection = ({ onNext, setFormData, formData }) => {
  const selectPatient = (patient) => {
    setFormData({ ...formData, patient });
    onNext();
  };

  return (
    <SafeAreaView>
    <View style={{padding: 20}} className=' border border-gray-400 rounded-md shadow-slate-300'>
      <Text className='text-2xl font-psemibold border-b border-gray-400 rounded-md '>Select a Patient:</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectPatient(item)}>
            <Text className='py-2 my-2 rounded-md font-semibold px-1 border border-gray-400'>{item.name}</Text>
          </TouchableOpacity>
        )}
        />
    </View>
  </SafeAreaView>
  );
};

export default PatientSelection;

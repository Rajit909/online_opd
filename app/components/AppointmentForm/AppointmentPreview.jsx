import React from 'react';
import { View, Text, Button } from 'react-native';

const AppointmentPreview = ({ formData, onBack }) => {
  return (
    <View>
      <Text>Review Your Appointment:</Text>
      <Text>Patient: {formData.patient?.name}</Text>
      <Text>Department: {formData.department}</Text>
      <Text>Doctor: {formData.doctor?.name}</Text>
      <Text>Date: {formData.date ? new Date(formData.date).toDateString() : 'No date selected'}</Text>
<View className=' mb-5'>
      <Button title="Confirm Appointment" onPress={() => alert('Appointment Confirmed')} />
</View>
      
      <Button title="Back" onPress={onBack} />
    </View>
  );
};

export default AppointmentPreview;

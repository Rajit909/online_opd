import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';

const departments = ['Cardiology', 'Neurology', 'Pediatrics'];
const doctors = {
  Cardiology: [{ id: '1', name: 'Dr. Smith' },
    { id: '2', name: 'Dr. devid' }
  ],
  Neurology: [{ id: '2', name: 'Dr. Brown' },
    { id: '3', name: 'Dr. jason ' }
  ],
  Pediatrics: [{ id: '3', name: 'Dr. Johnson' },
    { id: '4', name: 'Dr. jacob' }
  ],
};

const DepartmentDoctorSelection = ({ onNext, setFormData, formData }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const selectDoctor = (doctor) => {
    setFormData({ ...formData, doctor });
    onNext();
  };

  return (
    <View style={{padding:10}} className=' border border-gray-400 rounded-md '>
      <Text className=' border-b pt-4 pb-2 font-psemibold'>Select Department:</Text>
      <Picker 
        selectedValue={selectedDepartment}
        onValueChange={(value) => {
          setSelectedDepartment(value);
          setFormData({ ...formData, department: value, doctor: "" });
        }}
      >
        {departments.map((dept) => (
          <Picker.Item key={dept} label={dept} value={dept} />
        ))}
      </Picker>

      {selectedDepartment && (
        <>
          <Text className=' pt-8 text-md font-psemibold border-b border-gray-400 pb-1 '>Select Doctor:</Text>
          <FlatList
            data={doctors[selectedDepartment]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectDoctor(item)}>
                <Text className=' font-semibold pt-2 border border-gray-400  p-2 mt-2 rounded-md '>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

export default DepartmentDoctorSelection;

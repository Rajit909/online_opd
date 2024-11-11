import React from "react";
import { View, Text, Button } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import moment from "moment";

const AppointmentSchedule = ({ onNext, setFormData, formData }) => {
  // Generate an array of date options in the format "MM-DD-YYYY"
  const dateOptions = [];
  const today = moment();
  for (let i = 0; i < 30; i++) {
    dateOptions.push({
      label: today.clone().add(i, "days").format("MM-DD-YYYY"),
      value: today.clone().add(i, "days").format("YYYY-MM-DD"),
    });
  }

  const selectDate = (value) => {
    setFormData({ ...formData, date: value });
    onNext();
  };

  return (
    <View style={{padding: 10}} className=" border border-gray-400 rounded-md">
      <Text className=" font-psemibold ">Select Date:</Text>
      <RNPickerSelect
        onValueChange={selectDate}
        items={dateOptions}
        value={formData.date || null}
      />
    </View>
  );
};

export default AppointmentSchedule;

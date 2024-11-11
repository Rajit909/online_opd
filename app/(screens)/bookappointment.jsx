import React, { useState } from "react";
import { View, Text, Button, ScrollView, Dimensions } from "react-native";
import {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import PatientSelection from "../components/AppointmentForm/PatientSelection";
import DepartmentDoctorSelection from "../components/AppointmentForm/DepartmentDoctorSelection";
import AppointmentSchedule from "../components/AppointmentForm/AppointmentSchedule";
import AppointmentPreview from "../components/AppointmentForm/AppointmentPreview";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import images from "@/constants/images";

const BookAppointment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    patient: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
  });

  const progress = useSharedValue(0);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    progress.value = withSpring(currentStep / 4);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      progress.value = withSpring((currentStep - 1) / 4);
    }
  };

  // const animatedProgressStyle = useAnimatedStyle(() => ({
  //   width: `${progress.value * 100}%`,
  // }));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientSelection
            onNext={handleNext}
            setFormData={setFormData}
            formData={formData}
          />
        );
      case 2:
        return (
          <DepartmentDoctorSelection
            onNext={handleNext}
            setFormData={setFormData}
            formData={formData}
          />
        );
      case 3:
        return (
          <AppointmentSchedule
            onNext={handleNext}
            setFormData={setFormData}
            formData={formData}
          />
        );
      case 4:
        return <AppointmentPreview formData={formData} onBack={handleBack} />;
      default:
        return "";
    }
  };

  return (
    <SafeAreaView className=" h-full">
        <View
          className="text-2xl font-semibold text-white"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            style={{ width: 220, height: 220 }}
            resizeMode="contain"
          />
        <View style={{ flex: 1, padding: 20 }}>
          
          {renderStep()}
          {currentStep < 4 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              {currentStep > 1 && <Button title="Back" onPress={handleBack} />}
              <Button title="Next" onPress={handleNext} />
            </View>
          )}
        </View>
        </View>
  
    </SafeAreaView>
  );
};

export default BookAppointment;
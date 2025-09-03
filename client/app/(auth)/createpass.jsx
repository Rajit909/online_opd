import { View, Text, ScrollView, Dimensions, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  API_END_POINT_GET_ALL_PATIENT,
  API_END_POINT_UPDATE_PASS,
} from "@/api/Global";

const Createpassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [patientData, setPatientData] = useState([]);

  const [form, setForm] = useState({
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchMobileNumber = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem("mobile");
        if (storedMobile) {
          setForm((prevForm) => ({
            ...prevForm,
            mobile: storedMobile,
          }));
        }
      } catch (error) {
        console.error("Error retrieving mobile number", error);
      }
    };
    fetchMobileNumber();
  }, []);

  // fetch all patients
  useEffect(() => {
    fetch(`${API_END_POINT_GET_ALL_PATIENT}`)
      .then((response) => response.json())
      .then((data) => setPatientData(data))
      .catch((error) => console.error(error));
  }, []);

  const patient = patientData?.find((item) => item?.mobile === form.mobile);
  const patient_id = patient?.id;

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const { mobile, password, confirmPassword } = form;

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      Alert.alert("Please enter the same password");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT_UPDATE_PASS}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          mobile,
          password,
          patient_id,
        }).toString(),
      });

      const result = await response.json();

      if (result.message === "Password updated successfully") {
        setSuccess("Password updated successfully!");
        setForm({ password: "", confirmPassword: "" });
        router.push("/sign-in");
      } else {
        setError(result.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <ScrollView
        contentContainerStyle={{
          minHeight: Dimensions.get("window").height - 50,
          paddingHorizontal: 20,
          paddingTop: 40,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={images.logo}
          style={{ width: 180, height: 180 }}
          resizeMode="contain"
        />

        {/* Title */}
        <Text className="text-2xl font-extrabold text-blue-900 mt-6 text-center">
          Create New Password
        </Text>
        <Text className="text-base text-gray-600 text-center mt-2 px-6">
          Please enter a new password to secure your account.
        </Text>

        {/* Password fields */}
        <View className="w-full mt-6">
          <FormField
            title="New Password"
            placeholder="Enter new password"
            required
            value={form.password}
            onChangeText={(e) => setForm({ ...form, password: e })}
          />
        </View>

        <View className="w-full mt-4">
          <FormField
            title="Confirm Password"
            placeholder="Re-enter password"
            required
            value={form.confirmPassword}
            onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
          />
        </View>

        {/* Error & Success */}
        {error ? (
          <Text className="text-red-500 text-sm mt-3 text-center">{error}</Text>
        ) : null}
        {success ? (
          <Text className="text-green-600 text-sm mt-3 text-center">
            {success}
          </Text>
        ) : null}

        {/* Button */}
        <CustomButton
          title="Reset Password"
          containerStyle="mt-8 w-full"
          handlePress={submit}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Createpassword;

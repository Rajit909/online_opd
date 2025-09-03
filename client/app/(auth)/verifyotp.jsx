import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_END_POINT_VERIFY_OTP } from "@/api/Global";

const VerifyOtp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mobile, setMobile] = useState("");

  const [form, setForm] = useState({
    otp: "",
  });

  useEffect(() => {
    // fetch mobile number from async storage
    AsyncStorage.getItem("mobile").then((storedMobile) => {
      setMobile(storedMobile || "");
    });
  }, []);

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_END_POINT_VERIFY_OTP}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: form.otp, mobile }),
      });

      const data = await response.json();
      console.log("data", data);

      if (!response.ok) {
        setError(data.message || "Verification failed");
        setIsSubmitting(false);
        return;
      }

      if (data.message === "OTP verified successfully") {
        setSuccess("OTP verified successfully!");
        router.push("/sign-up");
      }
    } catch (error) {
      console.error("OTP verify error:", error);
      setError("Something went wrong. Please try again.");
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

        {/* Heading */}
        <Text className="text-2xl font-extrabold text-blue-900 mt-6 text-center">
          Verify OTP
        </Text>
        <Text className="text-base text-gray-600 text-center mt-2 px-6">
          Enter the OTP sent to your registered mobile number
        </Text>

        {/* Form Fields */}
        <View className="w-full mt-6">
          <FormField
            title="Mobile Number"
            value={mobile}
            editable={false} // keep it read-only
            otherStyles="bg-gray-100 text-gray-500"
          />
        </View>

        <View className="w-full mt-4">
          <FormField
            title="OTP"
            placeholder="Enter OTP"
            keyboardType="numeric"
            required
            value={form.otp}
            onChangeText={(e) => setForm({ ...form, otp: e })}
          />
        </View>

        {/* Error & Success messages */}
        {error ? (
          <Text className="text-red-500 text-sm mt-3 text-center">{error}</Text>
        ) : null}
        {success ? (
          <Text className="text-green-600 text-sm mt-3 text-center">
            {success}
          </Text>
        ) : null}

        {/* Verify Button */}
        <CustomButton
          title="Verify OTP"
          containerStyle="mt-8 w-full"
          handlePress={submit}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyOtp;

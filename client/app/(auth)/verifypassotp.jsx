import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_END_POINT_VERIFY_OTP } from "@/api/Global";

const VerifyPassOtp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mobile, setMobile] = useState("");

  const [form, setForm] = useState({ otp: "" });

  useEffect(() => {
    AsyncStorage.getItem("mobile").then((storedMobile) => {
      if (storedMobile) setMobile(storedMobile);
    });
  }, []);

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const { otp } = form;

      const response = await fetch(`${API_END_POINT_VERIFY_OTP}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, mobile }),
      });

      const data = await response.json();
      console.log("OTP Verify Response:", data);

      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      if (data.message === "OTP verified successfully") {
        setSuccess("OTP verified successfully!");
        router.push("/createpass");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
      console.log("OTP Verify Error:", error);
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
        <Text className="text-2xl font-extrabold text-blue-900">
          Verify OTP
        </Text>
        <Text className="text-base text-gray-600 text-center mt-2 px-4">
          We’ve sent an OTP to your registered mobile number. Enter it below to
          proceed.
        </Text>

        {/* Mobile (Read-only) */}
        <View className="w-full mt-6">
          <FormField
            title="Mobile Number"
            value={mobile}
            editable={false}
            otherStyles="w-full"
          />
        </View>

        {/* OTP Input */}
        <View className="w-full mt-4">
          <FormField
            title="OTP"
            placeholder="Enter OTP"
            required={true}
            value={form.otp}
            onChangeText={(e) => setForm({ ...form, otp: e })}
            keyboardType="number-pad"
            otherStyles="w-full"
          />
        </View>

        {/* Error & Success Messages */}
        {error ? (
          <Text className="text-red-500 text-sm mt-3">{error}</Text>
        ) : null}
        {success ? (
          <Text className="text-green-600 text-sm mt-3">{success}</Text>
        ) : null}

        {/* Button */}
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

export default VerifyPassOtp;

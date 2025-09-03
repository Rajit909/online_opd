import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { API_END_POINT_VERIFY_PASS_MOBILE } from "@/api/Global";

const ForgetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    mobile: "",
  });

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const { mobile } = form;

    if (!mobile) {
      setError("Mobile Number is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT_VERIFY_PASS_MOBILE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      if (data.message === "OTP sent successfully") {
        setSuccess("OTP sent successfully");

        await AsyncStorage.setItem("mobile", mobile);

        router.push("/verifypassotp");
      }
    } catch (error) {
      setError("Error sending OTP");
      console.log(error);
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
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />

        {/* Heading */}
        <Text className="text-2xl font-extrabold text-blue-900 mt-6">
          Reset Password
        </Text>
        <Text className="text-base text-gray-600 text-center mt-2 px-4">
          Enter your registered mobile number below. We’ll send you an OTP to
          reset your password.
        </Text>

        {/* Input */}
        <View className="w-full mt-6">
          <FormField
            title="Mobile Number"
            required={true}
            placeholder="Enter Mobile Number"
            otherStyles="w-full"
            onChangeText={(e) => setForm({ ...form, mobile: e })}
            value={form.mobile}
            keyboardType="number-pad"
          />
        </View>

        {/* Error & Success Messages */}
        {error ? (
          <Text className="text-red-500 text-sm mt-2">{error}</Text>
        ) : null}
        {success ? (
          <Text className="text-green-600 text-sm mt-2">{success}</Text>
        ) : null}

        {/* Button */}
        <CustomButton
          title="Send OTP"
          containerStyle="mt-8 w-full"
          handlePress={submit}
          isLoading={isSubmitting}
        />

        {/* Footer */}
        <Text className="text-center text-gray-600 mt-6">
          Remembered your password?{" "}
          <Link href={"/sign-in"} className="text-blue-700 font-semibold">
            Sign In
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgetPassword;

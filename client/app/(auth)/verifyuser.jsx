import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { API_END_POINT_VERIFY_MOBILE } from "@/api/Global";

const VerifyUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ mobile: "" });

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const { mobile } = form;

    if (!mobile) {
      setError("Mobile number is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT_VERIFY_MOBILE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
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

        router.push("/verifyotp");
      }
    } catch (error) {
      setError("Error sending OTP. Please try again.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 40,
          minHeight: Dimensions.get("window").height - 100,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            source={images.logo}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-blue-900">
            Verify Account
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            Enter your registered mobile number to verify your account.
          </Text>
        </View>

       <View className="w-[80%]">
         {/* Input Field */}
        <FormField
          title="Mobile Number"
          required={true}
          placeholder="Enter Mobile Number"
          otherStyles="mt-1"
          onChangeText={(e) => setForm({ ...form, mobile: e })}
          value={form.mobile}
          keyboardType="number-pad"
        />
       </View>

        {/* Error / Success */}
        {error ? (
          <Text className="text-red-500 text-sm text-center mt-3">{error}</Text>
        ) : null}
        {success ? (
          <Text className="text-green-600 text-sm text-center mt-3">
            {success}
          </Text>
        ) : null}

        {/* Button */}
        <CustomButton
          title="Verify"
          containerStyle="bg-blue-600 rounded-full mt-10 shadow-md w-[80%]"
          textStyle="text-white text-lg font-semibold"
          handlePress={submit}
          isLoading={isSubmitting}
        />

        {/* Footer */}
        <Text className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href={"/sign-in"} className="text-blue-700 font-semibold">
            Sign In
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyUser;

import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import { API_END_POINT_SIGN_IN } from "@/api/Global";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const submit = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const { mobile, password } = form;

    if (!mobile || !password) {
      setError("Mobile and password are required!");
      Alert.alert("Validation Error", "Please enter both mobile number and password.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT_SIGN_IN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (response.ok) {
        setSuccess(data.message || "Login successful!");
        Alert.alert("Success", data.message || "Login successful!");
        await AsyncStorage.setItem("user", JSON.stringify(data));
        router.push("/home");
      } else {
        setError(data.message || "Login failed!");
        Alert.alert("Error", data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError("An unexpected error occurred. Please try again.");
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View className="items-center mb-8">
            <Image
              source={images.logo}
              style={{ width: 180, height: 180 }}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-extrabold text-blue-900 text-center">
              Welcome Back 👋
            </Text>
            <Text className="text-base text-gray-600 text-center mt-2">
              Log in to manage your appointments and records.
            </Text>
          </View>

          {/* Form */}
          <FormField
            title="Mobile Number"
            placeholder="Enter your mobile number"
            otherStyles="mt-2"
            onChangeText={(e) => setForm({ ...form, mobile: e })}
            value={form.mobile}
            keyboardType="number-pad"

          />
          <FormField
            title="Password"
            placeholder="Enter your password"
            otherStyles="mt-6"
            onChangeText={(e) => setForm({ ...form, password: e })}
            value={form.password}
         
          />

          {/* Forgot Password */}
          <View className="w-full mt-2">
            <Text className="text-blue-700 font-semibold text-right">
              <Link href={"/forgetpassword"}>Forgot Password?</Link>
            </Text>
          </View>

          {/* Error / Success */}
          {error ? <Text className="text-red-500 text-center mt-4">{error}</Text> : null}
          {success ? <Text className="text-green-600 text-center mt-4">{success}</Text> : null}

          {/* Button */}
          <CustomButton
            title="Log In"
            containerStyle="bg-blue-600 rounded-full py-4 mt-10 shadow-md"
            textStyle="text-white text-lg font-semibold"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          {/* Footer */}
          <Text className="text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link href={"/verifyuser"} className="text-blue-700 font-semibold">
              Sign Up
            </Link>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SignIn;

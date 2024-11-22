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

    // Client-side validation
    if (!mobile || !password) {
      setError("Mobile and password are required!");
      Alert.alert("Validation Error", "Please enter both mobile number and password.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT_SIGN_IN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, password }),
      });
    
      const text = await response.text(); // Capture the raw response as text
      // console.log("Raw Response:", text);
    
      const data = JSON.parse(text); // Parse JSON only if it's 
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
    }
     finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="bg-gray-400 h-full" edges={["top"]}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="text-2xl font-semibold text-white"
            style={{ width: "100%", paddingHorizontal: 20 }}
          >
            <Image
              source={images.logo}
              style={{ width: 220, height: 220 }}
              resizeMode="contain"
            />

            <Text className="text-white text-xl font-bold mb-4">
              Log In to continue
            </Text>

            <FormField
              title="Mobile Number"
              placeholder="Enter Mobile Number"
              otherStyles="mt-5"
              onChangeText={(e) => setForm({ ...form, mobile: e })}
              value={form.mobile}
              keyboardType="number-pad"
            />
            <FormField
              title="Password"
              placeholder="Enter Password"
              otherStyles="mt-5"
              onChangeText={(e) => setForm({ ...form, password: e })}
              value={form.password}
              secureTextEntry // Hides the password input
            />
            <Text className="text-blue-700 pt-1 font-semibold text-end">
              <Link href={"/forgetpassword"}>Forgot Password?</Link>
            </Text>

            {error && <Text className="text-red-500 text-center mt-5">{error}</Text>}
            {success && <Text className="text-green-500 text-center mt-5">{success}</Text>}

            <CustomButton
              title="Log In"
              containerStyle="mt-10"
              handlePress={submit}
              isLoading={isSubmitting}
            />

            <Text className="text-center mt-5">
              Don't have an account?{" "}
              <Link href={"/verifyuser"} className="text-blue-800">
                Sign Up
              </Link>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SignIn;
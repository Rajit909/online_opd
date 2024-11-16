import { View, Text, ScrollView, Dimensions, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_END_POINT_SIGN_UP } from "@/api/Global";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
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

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
  
    const { firstname, lastname, mobile, password, confirmPassword } = form;
  
    // Client-side validation
    if (!firstname || !lastname || !password || !confirmPassword) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Password does not match");
      Alert.alert("Please enter the same password");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await fetch(`${API_END_POINT_SIGN_UP}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          firstname,
          lastname,
          mobile,
          password,
        }).toString(),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setSuccess(result.message || "Account created successfully");
        setForm({
          firstname: "",
          lastname: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });
        router.push("/sign-in");
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView className="bg-gray-400 h-full">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 20,
        }}
      >
        <View
          className="text-2xl font-semibold text-white"
          style={{ minHeight: Dimensions.get("window").height - 100 }}
        >
          <Image
            source={images.logo}
            style={{ width: 220, height: 120 }}
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-bold">Create Account</Text>
          <FormField
            title="First Name"
            placeholder="Enter your first name"
            otherStyles="mt-5"
            value={form.firstname}
            onChangeText={(e) => setForm({ ...form, firstname: e })}
          />
          <FormField
            title="Last Name"
            placeholder="Enter your last name"
            otherStyles="mt-5"
            value={form.lastname}
            onChangeText={(e) => setForm({ ...form, lastname: e })}
          />
          <FormField
            title={"Password"}
            placeholder={"Enter Password"}
            otherStyles="mt-5"
            value={form.password}
            onChangeText={(e) => setForm({ ...form, password: e })}
          />
          <FormField
            title={"Confirm Password"}
            placeholder={"Confirm Password"}
            otherStyles="mt-5"
            value={form.confirmPassword}
            onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
          />
          {error && (
            <Text className="text-red-600 text-center mt-5">{error}</Text>
          )}
          {success && (
            <Text className="text-green-500 text-center mt-5">{success}</Text>
          )}
          <CustomButton
            title="Create Account"
            containerStyle="mt-5"
            handlePress={submit}
            isLoading={isSubmitting}
          />
          <Text className="text-center my-5">
            Already have an account? <Link href={"/verifyuser"}>Log In</Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

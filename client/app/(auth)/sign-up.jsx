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

    if (!firstname || !lastname || !password || !confirmPassword) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      Alert.alert("Validation Error", "Please enter the same password.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT_SIGN_UP}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          firstname,
          lastname,
          mobile,
          password,
        }).toString(),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || "Account created successfully!");
        setForm({
          firstname: "",
          lastname: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });
        router.push("/sign-in");
      } else {
        setError(result.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
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
            style={{ width: 200, height: 120 }}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-blue-900">
            Create Account
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            Join us to book appointments and access services easily.
          </Text>
        </View>

        {/* Form Fields */}
        <FormField
          title="First Name"
          placeholder="Enter your first name"
          otherStyles="mt-2"
          value={form.firstname}
          onChangeText={(e) => setForm({ ...form, firstname: e })}
        />
        <FormField
          title="Last Name"
          placeholder="Enter your last name"
          otherStyles="mt-6"
          value={form.lastname}
          onChangeText={(e) => setForm({ ...form, lastname: e })}
        />
        <FormField
          title="Password"
          placeholder="Enter password"
          otherStyles="mt-6"
          value={form.password}
          onChangeText={(e) => setForm({ ...form, password: e })}
          secureTextEntry
        />
        <FormField
          title="Confirm Password"
          placeholder="Confirm password"
          otherStyles="mt-6"
          value={form.confirmPassword}
          onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
          secureTextEntry
        />

        {/* Error / Success */}
        {error ? <Text className="text-red-500 text-center mt-4">{error}</Text> : null}
        {success ? <Text className="text-green-600 text-center mt-4">{success}</Text> : null}

        {/* Button */}
        <CustomButton
          title="Create Account"
          containerStyle="bg-blue-600 rounded-full py-4 mt-10 shadow-md"
          textStyle="text-white text-lg font-semibold"
          handlePress={submit}
          isLoading={isSubmitting}
        />

        {/* Footer */}
        <Text className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href={"/sign-in"} className="text-blue-700 font-semibold">
            Log In
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

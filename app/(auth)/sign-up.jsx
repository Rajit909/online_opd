import { View, Text, ScrollView, Dimensions, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        const storedMobile = await AsyncStorage.getItem("user_mobile");
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
    try {
      const { firstname, lastname, mobile, password, confirmPassword } = form;
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
      const storedUsers = await AsyncStorage.getItem("users");
      const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
      const userExists = parsedUsers.find((user) => user.mobile === mobile);
      if (userExists) {
        setError("User already exists");
        setIsSubmitting(false);
        return;
      }

      const newUser = { firstname, lastname, mobile, password };
      const updatedUsers = [...parsedUsers, newUser];
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      setSuccess("Account created successfully");
      setForm({
        firstname: "",
        lastname: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
      setError("Failed to create account");
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

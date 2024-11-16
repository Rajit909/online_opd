import { View, Text, ScrollView, Image, Dimensions, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_END_POINT_SIGN_IN } from "@/api/Global";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  // const submit = async () => {
  //   setIsSubmitting(true);
  //   setError("");
  //   setSuccess("");
  //   try {
  //     const { mobile, password } = form;
  //     if (!mobile || !password) {
  //       setError("All fields are required");
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     const storedUsers = await AsyncStorage.getItem("users");
  //     const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
  //     const userExists = parsedUsers.find(
  //       (user) => user.mobile === mobile && user.password === password
  //     );
  //     if (!userExists) {
  //       setError("User does not exist");
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     await AsyncStorage.setItem("user", JSON.stringify(userExists));
  //     setSuccess("Login successful");
  //     router.push("/home");
  //   } catch (error) {
  //     console.error("Login failed", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  console.log(mobile, password);
  const submit = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);
  
    try {
      const response = await fetch(`${API_END_POINT_SIGN_IN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || "An error occurred");
      } else {
        setSuccess(data.message);
        console.log(data)
        router.push("/home");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error(error);
    } finally {
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
              onChangeText={(e) => setMobile(e)}
              value={mobile}
              keyboardType="number-pad"
            />
            <FormField
              title="Password"
              placeholder="Enter Password"
              otherStyles="mt-5"
              onChangeText={(e) => setPassword(e)}
              value={password}
            />
            <Text className="text-blue-700 pt-1 font-semibold text-end">
              <Link href={"/forgetpassword"}>Forgot Password?</Link>
            </Text>

            {error && (
              <Text className="text-red-500 text-center mt-5">{error}</Text>
            )}
            {success && (
              <Text className="text-green-500 text-center mt-5">{success}</Text>
            )}

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

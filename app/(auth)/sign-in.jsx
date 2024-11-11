import { View, Text, ScrollView, Image, Dimensions, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'


const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });
  // console.log(form)

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const { mobile, password } = form;
      if (!mobile || !password) {
        setError("All fields are required");
        setIsSubmitting(false);
        return;
      }
      
      const storedUsers = await AsyncStorage.getItem("users");
      const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
      const userExists = parsedUsers.find(
        (user) => user.mobile === mobile && user.password === password
      );
      if (!userExists) {
        setError("User does not exist");
        setIsSubmitting(false);
        return;
      }

      // console.log(parsedUsers)


      await AsyncStorage.setItem("user", JSON.stringify(userExists));
      setSuccess("Login successful");
      router.push("/home");

    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  


  return (
    <>
    <SafeAreaProvider>
      <SafeAreaView className="bg-gray-400 h-full" edges={['top']}>
        <ScrollView
        alwaysBounceVertical={true}
          contentContainerStyle={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View  className="text-2xl font-semibold text-white"
           style={{
              minHeight: Dimensions.get("window").height - 100,
            }}>
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
    </>
  );
};

export default SignIn;

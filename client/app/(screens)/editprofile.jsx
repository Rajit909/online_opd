import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackBtn from "../components/BackBtn";
import { API_END_POINT_EDIT_PROFILE } from "@/api/Global";

const EditProfile = () => {
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
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        const storedMobile = parsedUser.user?.mobile?.toString();
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

 

  // console.log("User at edit profile", user);

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
  
    const { firstname, lastname, mobile, password, confirmPassword } = form;
  
    if (!firstname || !lastname || !mobile || !password || !confirmPassword) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await fetch(`${API_END_POINT_EDIT_PROFILE}`, {
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
  
      if (response.status === 400) {
        setError(result.error || "Invalid request");
      } else if (response.status === 404) {
        setError(result.message || "User not found");
      } else if (response.status === 500) {
        setError(result.message || "Server error. Please try again.");
      } else if (result.success) {
        setSuccess(result.message || "Profile updated successfully");
        setForm({
          firstname: "",
          lastname: "",
          password: "",
          confirmPassword: "",
        });
        router.push("/profile");
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Server error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <SafeAreaView className="bg-indigo-200 h-full">
      <BackBtn title={"Profile"} styles={{paddingHorizontal: 20, paddingVertical: 5}} handlePress={()=> router.replace("/profile")}/>
        <ScrollView
          contentContainerStyle={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="text-2xl font-semibold text-white"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >

            <Image
              source={images.logo}
              style={{ width: 220, height: 100 }}
              resizeMode="contain"
            />

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
          

            {/* password field */}
            <FormField
              title={"Password"}
              placeholder={"Enter Password"}
              otherStyles="mt-5"
              value={form.password}
              onChangeText={(e) => setForm({ ...form, password: e })}
            />

            {/* confirm password field */}

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
              title="Update Profile"
              containerStyle="my-5"
              handlePress={submit}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  profileHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    marginVertical: 20,
  },
});

import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
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
          setForm((prevForm) => ({ ...prevForm, mobile: storedMobile }));
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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ firstname, lastname, mobile, password }).toString(),
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
        setForm({ firstname: "", lastname: "", password: "", confirmPassword: "" });
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
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <BackBtn
          title={"Profile"}
          styles={{ paddingHorizontal: 20, paddingVertical: 5 }}
          handlePress={() => router.replace("/profile")}
        />
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Image
            source={images.logo}
            style={{ width: 180, height: 80, alignSelf: "center" }}
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

          <FormField
            title="Password"
            placeholder="Enter Password"
            otherStyles="mt-5"
            value={form.password}
            secureTextEntry
            onChangeText={(e) => setForm({ ...form, password: e })}
          />

          <FormField
            title="Confirm Password"
            placeholder="Confirm Password"
            otherStyles="mt-5"
            value={form.confirmPassword}
            secureTextEntry
            onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : success ? (
            <Text style={styles.successText}>{success}</Text>
          ) : null}

          <CustomButton
            title="Update Profile"
            containerStyle="my-6"
            handlePress={submit}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#111",
  },
  formCard: {
    margin: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  errorText: {
    color: "#E53935",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "500",
  },
  successText: {
    color: "#43A047",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "500",
  },
});
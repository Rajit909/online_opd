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
import Icon from "react-native-vector-icons/MaterialIcons";
import icons from "@/constants/icons";
import BackBtn from "../components/BackBtn";

const EditProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUser(parsedUser);
    };
    getUser();
  }, []);

  // console.log("User at edit profile", user);

  const submit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      // check if all fields are filled
      const { firstname, lastname, age, password, confirmPassword } = form;

      // check if password and confirm password are the same
      if (password !== confirmPassword) {
        setError("Password does not match");
        Alert.alert("Please enter same password");
        setIsSubmitting(false);
        return;
      }
      // get user details from local storage
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      // console.log("parsed user", parsedUser);
      // update user details
      const updatedUser = {
        ...parsedUser,
        firstname,
        lastname,
        age,
        password,
      };
      // console.log("updated user", updatedUser);
      // save updated user details to local storage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully");
      router.push("/profile");
    } catch (error) {
      console.log(error);
      setError("Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <SafeAreaView className="bg-indigo-200 h-full">
      <BackBtn title={"Profile"} styles={{paddingHorizontal: 20, paddingVertical: 20}} handlePress={()=> router.replace("/profile")}/>
        <ScrollView
          contentContainerStyle={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
            <FormField
              title="Patient Age"
              placeholder="Enter your age"
              otherStyles="mt-5"
              value={form.age}
              onChangeText={(e) => setForm({ ...form, age: e })}
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
              containerStyle="mt-5"
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

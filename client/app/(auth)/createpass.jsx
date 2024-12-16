import { View, Text, ScrollView, Dimensions, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { API_END_POINT_UPDATE_PASS } from '@/api/Global'

const Createpassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const [form, setForm] = useState({
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
      console.log("form", storedMobile)

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
      
        const { mobile, password, confirmPassword } = form;
      
        // Client-side validation
        if ( !password || !confirmPassword) {
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
          const response = await fetch(`${API_END_POINT_UPDATE_PASS}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              mobile,
              password,
            }).toString(),
          });
      
          const result = await response.json();
      
          if (result.success) {
            setSuccess(result.message || "Account created successfully");
            setForm({
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
   <>
    <SafeAreaView className="bg-gray-400 h-full">
        <ScrollView
          contentContainerStyle={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
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
            <Text className=' text-xl text-gray-200 font-bold'>Create New Password</Text>
            <Text className=' text-gray-200'>Create your new password to access your account</Text>
            <FormField
                title="Password"
                required={true}
                placeholder="Create Password"
                otherStyles="mt-5"
                onChangeText={(e) => setForm({ ...form, password: e })}
                value={form.password}
            />
            <FormField
                title="Confirm Password"
                required={true}
                placeholder="Confirm Password"
                otherStyles="mt-5 px-2"
                onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                value={form.confirmPassword}
            />

            {
                error ? <Text className="text-red-500 text-sm mt-2">{error}</Text> : null
                }
                {
                success ? <Text className="text-green-500 text-sm mt-2">{success}</Text> : null
            }

            <CustomButton
              title="Reset Password"
              containerStyle="mt-10"
              handlePress={submit}
              isLoading={isSubmitting}
            />
            </View>
        </ScrollView>
        </SafeAreaView>
   
   </>
  )
}

export default Createpassword
 
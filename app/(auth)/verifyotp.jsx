import { View, Text, ScrollView, Dimensions, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const VerifyOtp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [form, setForm] = useState({
      otp: "",
    });


    const submit = async () => {
      setIsSubmitting(true);
      setError("");
      setSuccess("");
      try {
        const storedOtp = await AsyncStorage.getItem("userotp");
        const { otp } = form;
    
        if (storedOtp === otp) {
          setSuccess("OTP verified successfully.");
          Alert.alert("OTP verified successfully.");
          const mobile = await AsyncStorage.getItem("user_mobile");
          await AsyncStorage.setItem("user_mobile_verified", mobile);
          router.push("/sign-up");
        } else {
          setError("Invalid OTP.");
        }
      } catch (error) {
        setError("Error verifying OTP. Please try again.");
        console.log(error);
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
            <Text className=' text-xl text-gray-200 font-bold'>Verify Otp</Text>
            <Text>{}</Text>
            <Text className=' text-gray-200'>Enter Otp below to verify mobile number </Text>
            <FormField
                title="Otp"
                required={true}
                placeholder="Enter Otp "
                otherStyles="mt-5"
                onChangeText={(e) => setForm({ ...form, otp: e })}
                value={form.otp}
            />

            {
                error ? <Text className="text-red-500 text-sm mt-2">{error}</Text> : null
                }
                {
                success ? <Text className="text-green-500 text-sm mt-2">{success}</Text> : null
            }

            <CustomButton
              title="Verify Otp"
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

export default VerifyOtp
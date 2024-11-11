import { View, Text, ScrollView, Dimensions, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, router } from 'expo-router'
import { store } from 'expo-router/build/global-state/router-store'

const VerifyUser = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const [form, setForm] = useState({
        mobile: "",
    });


    const submit = async () => {
        setIsSubmitting(true);
        setError("");
        setSuccess("");
        try {

            const { mobile } = form;
            // check if the mobile number is valid
            if (!mobile) {
                setError("Mobile Number is required");
                setIsSubmitting(false);
                return;
            }
            // check if the mobile number is exist
            const storedUsers = await AsyncStorage.getItem("users");
            const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
            const userExist = parsedUsers.find((user) => user.mobile === mobile);
            if (userExist) {
                setError("Mobile Number already exists");
                setIsSubmitting(false);
                return;
            }


            // send otp to the mobile number
            const userotp = 2222;
            await AsyncStorage.setItem("userotp", userotp.toString());
            setSuccess("Otp sent successfully");
              // store the mobile number in local storage
              await AsyncStorage.setItem("user_mobile", mobile);
              setSuccess("Mobile Number saved successfully");
            router.push("/verifyotp");
        } catch (error) {
            console.log(error)
        }finally{
            setIsSubmitting(false);
        }
    }
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
            <Text className=' text-xl text-gray-200 font-bold'>Verify account </Text>
            <Text className=' text-gray-200'>Enter your Mobile Number below to Verify your account</Text>
            <FormField
                title="Mobile Number"
                required={true}
                placeholder="Enter Mobile Number"
                otherStyles="mt-5"
                onChangeText={(e) => setForm({ ...form, mobile: e })}
                value={form.mobile}
                keyboardType="number-pad"
            />

            {
                error ? <Text className="text-red-500 text-sm mt-2">{error}</Text> : null
                }
                {
                success ? <Text className="text-green-500 text-sm mt-2">{success}</Text> : null
            }

            <CustomButton
              title="Verify"
              containerStyle="mt-10"
              handlePress={submit}
              isLoading={isSubmitting}
            />

            <Text className="text-center mt-5">
              Already have an Account?{" "}
              <Link href={"/sign-in"} className='text-blue-800 font-psemibold'>
                Sign In
              </Link>
            </Text>
            </View>
        </ScrollView>
        </SafeAreaView>
   
   </>
  )
}

export default VerifyUser
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
        
            //get the users details from the AsyncStorage
            const storedUsers = await AsyncStorage.getItem("users");
            const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
            const userExists = parsedUsers.find(
              (user) => user.mobile === mobile
            );
            if (!userExists) {
                setError("Incorrect Mobile Number");
                setIsSubmitting(false);
                return;
            }
            // let userotp = Math.floor(1000 + Math.random() * 9000);
            let userotp = 2222;

            //store the otp in the AsyncStorage
            await AsyncStorage.setItem("userotp", JSON.stringify(userotp));
            // store the mobile number in the AsyncStorage
            await AsyncStorage.setItem("usermobile", JSON.stringify(mobile));
            // store the user details in the AsyncStorage
            await AsyncStorage.setItem("userdetails", JSON.stringify(userExists));
            console.log(userotp);
            console.log("user in verfy",userExists)
            setSuccess("OTP sent successfully");
            Alert.alert("OTP sent successfully");
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
              Don't have an account?{" "}
              <Link href={"/sign-up"}>
              Sign Up
              </Link>
            </Text>
            </View>
        </ScrollView>
        </SafeAreaView>
   
   </>
  )
}

export default VerifyUser
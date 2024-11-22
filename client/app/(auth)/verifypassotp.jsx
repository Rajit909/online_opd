import { View, Text, ScrollView, Dimensions, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const VerifyPassOtp = () => {
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
          const userOtp = await AsyncStorage.getItem("userotp");
          // console.log(userOtp)
            const { otp } = form;
            //get the users details from the AsyncStorage
            const storedUsers = await AsyncStorage.getItem("users");
            const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
            const userMobile = await AsyncStorage.getItem("usermobile");
            // console.log(userMobile)

            // find the user with the mobile number
            const userDetails = await AsyncStorage.getItem("userdetails");
           

            // check if the otp is valid
            // console.log(parsedUsers)
            
            if (userOtp == otp) {
                setSuccess("Otp verified successfully");
                Alert.alert("Otp verified successfully");
                // login the user
                await AsyncStorage.setItem("user", JSON.stringify(userDetails));
                router.push("/createpass");
                setForm({ otp: "" });
            }else{
                setError("Invalid Otp");
                setIsSubmitting(false);
                return;
            }
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
            <Text className=' text-xl text-gray-200 font-bold'>Verify Otp</Text>
            <Text>{}</Text>
            <Text className=' text-gray-200 text-wrap'>Enter Otp below to verify mobile number to create new password </Text>
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

export default VerifyPassOtp
import { View, Text, ScrollView, Dimensions, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const Createpassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });


    const submit = async () => {
        setIsSubmitting(true);
        setError("");
        setSuccess("");
        try {

            const { password, confirmPassword } = form;
            //get the users details from the AsyncStorage
            const storedUsers = await AsyncStorage.getItem("users");
            const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];

            // check if password and confirm password are the same
            if (password !== confirmPassword) {
                setError("Password and Confirm Password do not match");
                setIsSubmitting(false);
                return;
            }
            

            // update the users password
            const updateUsersDetails = parsedUsers.map((user) => {
                if (user.mobile) {
                    return { ...user, password };
                }
                return user;
            });
            await AsyncStorage.setItem("users", JSON.stringify(updateUsersDetails));
            setSuccess("Password updated successfully");
            Alert.alert("Password updated successfully");
            router.push("/sign-in");

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
 
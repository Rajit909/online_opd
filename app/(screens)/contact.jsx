import {
    View,
    Text,
    ScrollView,
    Dimensions,
    Image,
    Alert,
    TouchableOpacity,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import images from "@/constants/images";
  import { router } from "expo-router";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import BackBtn from "../components/BackBtn";
  
  const EditProfile = () => {

    const [user, setUser] = useState({});
  
    useEffect(() => {
      const getUser = async () => {
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        setUser(parsedUser);
      };
      getUser();
    }, []);
  
  
    
    return (
      <>
        <SafeAreaView className="bg-indigo-100 h-full">
        <BackBtn title={"Contact Us"} styles={{paddingHorizontal: 20, paddingVertical: 20}} handlePress={()=> router.replace("/profile")}/>
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
                display: "flex",
                alignItems: "center",
                paddingHorizontal: 20
              }}
            >
  
              <Image
                source={images.logo}
                style={{ width: 220, height: 100 }}
                resizeMode="contain"
              />
                    <Text className="font-pmedium" style={{fontSize:16, marginTop: 40, marginHorizontal:20}}>If you want any help feel free to contact us.</Text>

                <View className="border rounded-lg p-4 py-10 bg-green-100" style={{marginTop: 40}}>
                    <Text className="font-pmedium border m-1 bg-indigo-200 rounded-md p-1" style={{fontSize:16}}>
                        <Text className=" border-r pr-1">Email:</Text> abc@gmail.com</Text>
                    <Text className="font-pmedium border m-1 bg-indigo-200 rounded-md p-1" style={{fontSize:16}}> <Text className=" border-r pr-1">Phone:</Text>  123456789</Text>
                    <Text className="font-pmedium border m-1 bg-indigo-200 rounded-md p-1" style={{fontSize:16}}>
                    <Text className=" border-r pr-1">Address:</Text> 
                         123, abc street, xyz city</Text>
                </View>

  
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };
  
  export default EditProfile;
  
 
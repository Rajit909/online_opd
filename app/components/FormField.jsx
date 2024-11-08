import icons from "@/constants/icons";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
// import { icons } from "../../constants";

const FormField = ({
  title,
  value,
  required,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}
        {required ? <Text className="text-red-600"> *</Text> : null}
      </Text>
      <View className="w-full h-14 px-4 bg-gray-100 rounded-2xl  focus:border-yellow-200 flex flex-row items-center">
        <TextInput
          className="flex-1  font-psemibold text-base"
          value={value}
          type="password"
          placeholder={placeholder}
          secureTextEntry={showPassword ? true : false}
          placeholderTextColor="#000"
          onChangeText={handleChangeText}
          {...props}
        />

        {
            title === 'Password' && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={!showPassword ? icons.eye : icons.eyeHide}
                  className="w-[30px] h-[30px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )
        }

      </View>
    </View>
  );
};

export default FormField;
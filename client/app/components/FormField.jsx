import icons from "@/constants/icons";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";


const FormField = ({
  title,
  value,
  required,
  placeholder,
  handleChangeText,
  otherStyles,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animated values
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  // Interpolate animation for floating effect
  const labelStyle = {
    position: "absolute",
    left: 1,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [13, 1], // moves label up
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 10], // smaller font when floated
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#000", "#545b5e"], // grey → black
    }),
  };


  return (
    <View style={[{ marginBottom: 20 }, containerStyle]}>
      <View className={`w-full h-18 px-4 bg-gray-100 rounded-xl flex flex-row items-center ${otherStyles}`}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {/* Floating Label */}
          <Animated.Text style={labelStyle}>
            {title}
            {required ? <Text style={{ color: "red" }}> *</Text> : null}
          </Animated.Text>

          {/* Input Field */}
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              paddingTop: 20,
              color: "#000",
              fontFamily: "System",
            }}
            value={value}
            placeholder={isFocused ? "" : ""}
            placeholderTextColor="#999"
            secureTextEntry={title === "Password" && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={handleChangeText}
            {...props}
          />
        </View>

        {/* Password eye toggle */}
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              style={{ width: 25, height: 25, tintColor: "#666" }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

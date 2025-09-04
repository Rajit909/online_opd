import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import images from "@/constants/images";

const BackBtn = ({ handlePress, styles, title }) => {
  return (
    <View style={styles}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={stylesBtn.container}
      >
        <Image source={images.backbtn} style={stylesBtn.icon} />
        {title ? <Text style={stylesBtn.title}>{title}</Text> : null}
      </TouchableOpacity>
    </View>
  );
};

const stylesBtn = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});

export default BackBtn;

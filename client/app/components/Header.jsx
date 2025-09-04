import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import icons from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_END_POINT_LOGOUT } from "@/api/Global";

const Header = ({ name }) => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    try {
      const response = await fetch(`${API_END_POINT_LOGOUT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.message === "Logout successful") {
        await AsyncStorage.clear();
        Alert.alert("Success", data.message);
        router.replace("/");
      } else {
        Alert.alert("Error", "Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        setUser(parsedUser?.user || null);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (!user) {
        router.replace("/");
        return true; // prevent default back action
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [user]);

  return (
    <View style={styles.headerContainer}>
      {/* Profile Image and Greeting */}
      <View style={styles.profileContainer}>
        <Image source={icons.profile} style={styles.profileImage} />
        <View>
          <Text style={styles.greetingText}>Good Morning 👋</Text>
          <Text style={styles.nameText}>{user?.name || name || "Guest"}</Text>
        </View>
      </View>

      {/* Action Icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={logout}>
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  greetingText: {
    fontSize: 12,
    color: "gray",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default Header;

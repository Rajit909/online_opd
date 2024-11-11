import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{
          width: 20,
          height: 20,
          // tintColor: focused ? color : "gray"
        }}
      />
      <Text style={{ color: color }}>{name}</Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            borderTopColor: "#232533",
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="bookappointment"
          options={{
            title: "BookaApointment",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.appointment}
                color={color}
                name="Book appoint"
                focused={focused}
              />
            ),
          }}
        /> */}
        {/* <Tabs.Screen
          name="nextappointment"
          options={{
            title: "NextAppointment",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.nextappointment}
                color={color}
                name="Next appoint"
                focused={focused}
              />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="report"
          options={{
            title: "AppointmentReport",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.report}
                color={color}
                name="Report"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

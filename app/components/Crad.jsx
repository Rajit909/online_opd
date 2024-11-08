import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const Crad = ({
    handlePress, 
  containerStyle, 
  isLoading,
  bgColor,
  textColor,
  title,
  icon
}) => {
  return (
   <>
     <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                className={`w-96 rounded-xl min-h-28 flex flex-row items-center ${containerStyle} ${
                  isLoading ? "opacity-50" : ""
                } `}
                style={{ backgroundColor: bgColor }}
                disabled={isLoading}
              >
              <View
                style={{ borderRadius: 20,}}
              >
                <Image
                  source={icon}
                  resizeMode="contain"
                  className="ml-8 "
                  style={{ width: 40, height: 40}}
                  />
                </View>

                <Text
                  className={`font-psemibold text-xl ml-8 ${textColor}`}
                >
                  {title}
                </Text>
              </TouchableOpacity>
   </>
  )
}

export default Crad
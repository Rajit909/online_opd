import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'

const { width, height, margin } = Dimensions.get("window");


const Card = ({
  containerStyle, 
  isLoading,
  bgColor,
  textColor,
  title,
  cardWidth,
  icon
}) => {
  return (
   <>
     <View
                activeOpacity={0.7}
                className={` rounded-xl min-h-28 flex flex-row items-center ${containerStyle} ${
                  isLoading ? "opacity-50" : ""
                } `}
                style={{ backgroundColor: bgColor, width: width* 0.83}}
                disabled={isLoading}
              >
              <View
                style={{ borderRadius: 20,}}
              >
                <Image
                  source={icon}
                  resizeMode="contain"
                  className="ml-6 "
                  style={{ width: 40, height: 40}}
                  />
                </View>

                <Text
                  className={`font-psemibold text-xl ml-6 ${textColor}`}
                >
                  {title}
                </Text>
              </View>
   </>
  )
}

export default Card
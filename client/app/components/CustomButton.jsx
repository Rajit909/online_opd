import { ActivityIndicator, Text, TouchableOpacity  } from 'react-native'
import React from 'react'

const CustomButton = ({
    title,
    handlePress,
    containerStyle,
    textStyle,
    isLoading
}) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-yellow-500 w-72 rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyle} ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
    >
        <Text className={`text-blue-800 font-psemibold text-xl ${textStyle}`}>
            {title}
        </Text>

        {
            isLoading && (
                <ActivityIndicator 
                    animating={isLoading}
                    size="small"
                    color="#ffffff"
                    className="ml-2"
                />
            )
        }
        
    </TouchableOpacity>
  )
}

export default CustomButton
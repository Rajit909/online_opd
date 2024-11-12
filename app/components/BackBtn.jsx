import { View, Text, Image, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import images from '@/constants/images'

const BackBtn = ({handlePress, styles, title}) => {
  return (
    <View style={styles}>
        <TouchableOpacity onPress={handlePress}
        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
        >
        <Image
            source={images.backbtn}
            style={{ width: 30, height: 30 }}
        />
        <Text className='text-2xl font-psemibold' style={{marginRight:30}}>
            {title}
        </Text>
        <Text></Text>
        </TouchableOpacity>
    </View>
  )
}

export default BackBtn
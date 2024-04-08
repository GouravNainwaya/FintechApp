import React, { memo } from 'react';
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  Pressable
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
    responsiveFontSize,
    responsiveWidth,
    responsiveHeight,
  } from 'react-native-responsive-dimensions';

const CircularIcon = ({ color, size, iconName , containerStyles, iconColor, onPress}) => {
    const circleSize = size * 1; // Twice the size for both width and height
  
    return (
      <Pressable
      onPress={onPress}
      style={{
        padding: responsiveWidth(1.90),
        borderRadius: responsiveWidth(size),
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
        ...containerStyles, // Spread the styles from the prop
      }}
      >
        <AntDesign name={iconName} size={size} color={iconColor || "#fff"} style={{ fontWeight: 'bold' }} />
      </Pressable>
    );
  };

export default memo(CircularIcon)
import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Fonts from '../../config/Theme/fonts';
import colors from '../../config/Theme/theme';

const HorizontalCardList = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: item.backgroundColor, // Card background color
          padding: responsiveWidth(6), // Inner padding of the card
          paddingVertical: responsiveWidth(4), // Inner padding of the card
          borderRadius: responsiveWidth(5), // Card border radius
          margin: responsiveWidth(5), // Margin around the card
        }}>
        {/* Row View */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* Left Side Image */}
          <Image
            source={item.image}
            style={{
              width: responsiveWidth(25),
              height: responsiveWidth(25),
              borderRadius: 8,
              marginRight: responsiveWidth(20),
            }}
            resizeMode="contain"
          />
  
          {/* Right Side View with Three Texts */}
          <View style={{justifyContent: 'space-between'}}>
            <Text
              style={{
                ...Fonts?.fontLight,
                fontSize: responsiveFontSize(3.5),
                color: colors.background,
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                ...Fonts?.fontBold,
                fontSize: responsiveFontSize(4),
                color: colors.background,
              }}>
              {item.subtitle}
            </Text>
            <Text
              style={{
                ...Fonts?.fontLight,
                fontSize: responsiveFontSize(1.8),
                color: colors.background,
              }}>
              {item.description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  export default HorizontalCardList
import {StyleSheet, Text, View} from 'react-native';
import React, { memo } from 'react';
import Entypo from 'react-native-vector-icons/Entypo'; // Make sure to install the appropriate icon library
import colors from '../config/Theme/theme';
import Fonts from '../config/Theme/fonts';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import CircularIcon from './CircularIconButton';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Header = ({text, leftIcon,rightIconColor}) => {
  
  const cartItems = useSelector((state) => state.cart.cart);
  const navigation = useNavigation();
  return (
    <View style={styles.row}>
      {leftIcon ? (
        <CircularIcon onPress={() => navigation.goBack()} containerStyles={{padding: responsiveWidth(3)}} color="#E7ECF0"  iconColor="#A9B4BC" size={14} iconName="left" />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
      <View style={{}}>
      <Entypo
        name="shopping-bag"
        size={24}
        color={rightIconColor}
        style={styles.icon}
        onPress={() => {
          if (cartItems?.length) {
            navigation.navigate("ProductCart")
          }else{
            console.warn("please add at least one Item");
          }
        }}
      />
      {!!cartItems?.length && (
        <View
          style={{
            position: 'absolute',
            top: responsiveHeight(-1),
            right: responsiveWidth(-2),
            backgroundColor: 'red',
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 12 ,textAlign: 'center', lineHeight: 20 }}>{cartItems?.length}</Text>
      </View>
      )}
      </View>

    </View>
  );
};

export default memo(Header);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: responsiveFontSize(3),
    ...Fonts.fontSemiBold,
    color: colors.background,
  },
  icon: {
    marginLeft: 10,
  },
});

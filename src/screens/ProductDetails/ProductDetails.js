import React, {useState} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Fonts from '../../config/Theme/fonts';
import colors from '../../config/Theme/theme';
import {Rating} from 'react-native-ratings';
const {width} = Dimensions.get('window');
import {useSelector, useDispatch} from 'react-redux';
import {SliderBox} from 'react-native-image-slider-box';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/Header';
import { addItem } from '../../redux/slices/cartSlice';

export const CustomButton = ({ title, onPress, buttonStyle, textStyle, isLoading, disabled }) => {
  return (
    <Pressable
      style={[buttonStyle, { opacity: disabled || isLoading ? 0.5 : 1 }]}
      disabled={disabled || isLoading}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator size={'small'} color="white" />
      ) : (
        <Text numberOfLines={1} style={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

const ProductDetails = ({navigation, route}) => {
  const {item} = route?.params;
  const dispatch = useDispatch();

  const handleOutlineButtonPress = item => {
    const addItems = {...item, quantity: 1};
    dispatch(addItem(addItems));
    navigation?.navigate('EcommerceHome');
    console.log('Outline Button Pressed');
  };

  const handlePrimaryButtonPress = () => {
    console.log('Primary Button Pressed');
  };

  const handleAddToFavouritesItem = (item, isExist) => {
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: colors.background}}>
      <Header text="Hey, Rahul" leftIcon={true} rightIconColor={'black'} />
      <View style={{paddingHorizontal: 15, marginTop: responsiveHeight(4)}}>
        <Text
          style={{
            fontSize: responsiveFontSize(7),
            color: colors.black,
            ...Fonts?.fontSemiBold,
          }}>
          Thin Choise Top Orange
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: responsiveHeight(2),
          }}>
          <Rating count={5} defaultRating={5} imageSize={20} />
          <Text
            style={{
              fontSize: responsiveFontSize(1.7),
              color: colors.lightGray,
              ...Fonts?.fontSemiBold,
            }}>
            117 Reviews
          </Text>
        </View>
        <View style={{}}>
          <SliderBox
            images={item?.images}
            ImageComponentStyle={{marginVertical: responsiveHeight(1)}}
            dotColor="orange"
            inactiveDotColor="gray"
            circleLoop={true}
            dotStyle={{height: 5, width: 15, borderRadius: responsiveWidth(5), marginBottom: responsiveHeight(2.50),}}
            paginationBoxStyle={{alignSelf: 'flex-start'}}
            imageLoadingColor="black"
          />
          <View
            style={{
              width: responsiveWidth(15), // Adjust the size as needed
              height: responsiveWidth(15), // Adjust the size as needed
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: responsiveWidth(3),
              position: 'absolute',
              right: responsiveWidth(1),
              top: responsiveHeight(3),
            }}>
            <Pressable
              onPress={() =>{}
                // handleAddToFavouritesItem(item, isFavouritesExist)
              }>
              <AntDesign
                name={false ? 'heart' : 'hearto'}
                size={30}
                color={'black'}
              />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: responsiveHeight(3),
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.3),
              color: colors.blue,
              ...Fonts?.fontBold,
            }}>
            $34.70/KG
          </Text>
          <View
            style={{
              padding: responsiveWidth(1.5),
              marginLeft: 10,
              paddingHorizontal: responsiveWidth(6),
              backgroundColor: colors.purple,
              borderRadius: responsiveWidth(7),
            }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.6),
                color: colors.background,
                ...Fonts?.fontLight,
              }}>
              $22.04 OFF
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: responsiveHeight(2.6),
            // justifyContent: 'space-between',
          }}>
          <CustomButton
            title="Add To Cart"
            onPress={() => handleOutlineButtonPress(item)}
            buttonStyle={{
              borderWidth: 1,
              borderColor: colors.blue,
              borderRadius: responsiveWidth(5),
              padding: responsiveWidth(5),
              paddingHorizontal: responsiveWidth(9),
              marginRight: 'auto',
            }}
            textStyle={{
              fontSize: responsiveFontSize(2),
              ...Fonts?.fontSemiBold,
              textAlign: 'center',
              color: colors.blue,
            }}
          />

          <CustomButton
            title="Buy Now"
            onPress={handlePrimaryButtonPress}
            buttonStyle={{
              backgroundColor: colors.blue,
              borderRadius: responsiveWidth(5),
              padding: responsiveWidth(5),
              paddingHorizontal: responsiveWidth(14),
            }}
            textStyle={{
              fontSize: responsiveFontSize(2),
              ...Fonts?.fontSemiBold,
              textAlign: 'center',
              color: 'white',
            }}
          />
        </View>

        <Text
          style={{
            fontSize: responsiveFontSize(2.4),
            color: colors.black,
            ...Fonts?.fontRegular,
            marginVertical: responsiveHeight(2),
          }}>
          ProductDetails
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(2.2),
            color: '#8891A5',
            ...Fonts?.fontMedium,
            paddingBottom: 10,
          }}>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Nullam quis risus eget urna mollis ornare vel eu leo.
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    // height: responsiveHeight(29),
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  slideText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#333',
  },
});

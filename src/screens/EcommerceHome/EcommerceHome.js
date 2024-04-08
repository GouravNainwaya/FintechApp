import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Fonts from '../../config/Theme/fonts';
import colors from '../../config/Theme/theme';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import CustomAcrivitityIndicator from '../../components/CustomAcrivitityIndicator';
import HorizontalCardList from './HorizontalCardList';
import {addItem, removeItem} from '../../redux/slices/cartSlice';
import Header from '../../components/Header';
import CircularIcon from '../../components/CircularIconButton';

const datas = [
  {
    id: '1',
    image: require('../../assets/ImagePlaceHolder.png'),
    title: 'Get',
    subtitle: '50% off',
    description: 'on First 03 Order',
    backgroundColor: '#F9B023',
  },
  {
    id: '2',
    image: require('../../assets/ImagePlaceHolder.png'),
    title: 'Special Offer',
    subtitle: 'Limited Time!',
    description: 'Buy 2, Get 1 Free',
    backgroundColor: 'pink',
  },
  {
    id: '3',
    image: require('../../assets/ImagePlaceHolder.png'),
    title: 'Special Offer',
    subtitle: 'Limited Time!',
    description: 'Buy 2, Get 1 Free',
    backgroundColor: colors.blue,
  },

  // Add more items as needed
];

const spaceBetweenElements = responsiveWidth(1); // Adjust the space as needed

const EcommerceHome = ({navigation}) => {
  const cartItems = useSelector(state => state.cart.cart);
  console.log(
    '🚀 ~ file: EcommerceHome.js:150 ~ EcommerceHome ~ cartItems:',
    cartItems,
  );
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const handleAddItem = (item, index, isExist) => {
    // const updatedIndexes = [...selectedIndexes];

    if (isExist) {
      // updatedIndexes.splice(updatedIndexes.indexOf(index), 1);
      dispatch(removeItem({id: item?.id}));
    } else {
      // updatedIndexes.push(index);
      const addItems = {...item, quantity: 1};
      delete addItems.discountPercentage;
      console.log("addItems:", addItems)
      dispatch(addItem(addItems));
    }

    // setSelectedIndexes(updatedIndexes);
  };

  const handleAddToFavouritesItem = (item, index, isExist) => {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setData(response.data?.products);
        setFilteredData(response.data?.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setLoading(false);
        // Handle the error, e.g., set an error state or show a message to the user
      }
    };

    fetchData(); // Call the async function

    // You can add dependencies to the useEffect dependency array if needed
  }, []);

  const handleSearch = text => {
    setSearchQuery(text);

    // Filter the data based on the search query
    const filtered = data.filter(item =>
      item?.title?.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredData(filtered);
  };

  // console.log("cartItems", JSON.stringify(cartItems, null, 2));
  // console.log("favourites", JSON.stringify(favourites, null, 2));

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      {loading ? (
        <CustomAcrivitityIndicator />
      ) : (
        <>
          <View
            style={{
              flex: 0.2,
              backgroundColor: colors.blue,
              paddingHorizontal: 10,
              paddingBottom: 15,
            }}>
            <Header text="Hey, Rahul" />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
                marginVertical: responsiveHeight(3),
                backgroundColor: colors.purple,
                borderRadius: responsiveWidth(10),
                overflow: 'hidden',
                padding: 8,
                paddingHorizontal: responsiveWidth(6),
              }}>
              <Feather
                name="search"
                size={20}
                color={colors.background}
                style={{marginLeft: 10, marginRight: 10}}
              />
              <TextInput
                style={{
                  ...Fonts?.fontMedium,
                  fontSize: responsiveFontSize(2),
                }}
                placeholder={'Search Products or stored'}
                placeholderTextColor="#8891A5"
                onChangeText={handleSearch}
                value={searchQuery}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{}}>
                <Text
                  style={{
                    ...Fonts?.fontBold,
                    fontSize: responsiveFontSize(1.6),
                    textTransform: 'uppercase',
                    color: '#A9B4BC',
                  }}>
                  Delivery to
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 3,
                  }}>
                  <Text
                    style={{
                      ...Fonts?.fontMedium,
                      fontSize: responsiveFontSize(2),
                      color: colors.background,
                    }}>
                    Green Way 3000, Sylhet
                  </Text>
                  <AntDesign
                    name="down"
                    size={15}
                    color={colors.background}
                    style={{marginLeft: 10}}
                  />
                </View>
              </View>

              <View style={{}}>
                <Text
                  style={{
                    ...Fonts?.fontBold,
                    fontSize: responsiveFontSize(1.6),
                    textTransform: 'uppercase',
                    color: '#A9B4BC',
                  }}>
                  Within
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 3,
                  }}>
                  <Text
                    style={{
                      ...Fonts?.fontMedium,
                      fontSize: responsiveFontSize(2),
                      color: colors.background,
                      marginRight: 10,
                    }}>
                    1 Hour
                  </Text>
                  <AntDesign
                    name="down"
                    size={13}
                    color={'#ffffff'}
                    style={{}}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 4,
              backgroundColor: colors.background,
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                marginTop: responsiveHeight(2),
                marginBottom: responsiveHeight(2.8),
              }}>
              <FlatList
                data={datas}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={HorizontalCardList}
              />
            </View>
            {/* recoomend  */}
            <Text
              style={{
                ...Fonts?.fontMedium,
                fontSize: responsiveFontSize(3),
                color: '#1B262E',
                // marginBottom: responsiveHeight(2)
              }}>
              Recommended
            </Text>
            {/* recoomend  */}

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                margin: spaceBetweenElements / 2,
              }}>
              {filteredData?.map((item, index) => {
                // console.log("item", JSON.stringify(item.thumbnail, null, 2));

                const isExist = cartItems?.some(obj => obj.id === item?.id);
                return (
                  <Pressable
                    key={item.id}
                    style={{
                      width: responsiveWidth(45),
                      padding: responsiveWidth(3),
                      paddingTop: responsiveWidth(12),
                      paddingBottom: responsiveWidth(5),
                      backgroundColor: '#E7ECF0',
                      borderRadius: responsiveWidth(4),
                      marginVertical: responsiveWidth(3),
                      marginRight: spaceBetweenElements,
                    }}
                    onPress={() =>
                      navigation?.navigate('ProductDetails', {item})
                    }>
                    <Pressable
                      onPress={() => handleAddToFavouritesItem(item, index)}
                      style={{
                        position: 'absolute',
                        top: responsiveHeight(2),
                        left: responsiveWidth(3),
                      }}>
                      <AntDesign
                        name={false ? 'heart' : 'hearto'}
                        size={24}
                        color={'red'}
                      />
                    </Pressable>
                    <View style={{alignSelf: 'center'}}>
                      <Image
                        source={{uri: item?.thumbnail}}
                        style={{
                          width: responsiveWidth(25),
                          height: responsiveWidth(25),
                          borderRadius: 8,
                          // tintColor: 'gray',
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={{marginTop: responsiveHeight(5)}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View>
                          <Text
                            style={{
                              ...Fonts?.fontBold,
                              fontSize: responsiveFontSize(2.2),
                              marginRight: responsiveWidth(2),
                              color: colors.black,
                            }}>
                            ${item.price}
                          </Text>
                        </View>
                        <Pressable>
                          <CircularIcon
                            onPress={() => handleAddItem(item, index, isExist)}
                            rightIconColor={colors.background}
                            color="#2A4BA0"
                            size={14}
                            iconName={isExist ? 'minus' : 'plus'}
                          />
                        </Pressable>
                      </View>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.8),
                          color: '#616A7D',
                          ...Fonts?.fontLight,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default EcommerceHome;

const styles = StyleSheet.create({});

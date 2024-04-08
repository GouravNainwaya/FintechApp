import React, {useEffect,useState} from 'react';
import {View, FlatList, StyleSheet, Text, Image, TouchableOpacity, Modal} from 'react-native';
import Fonts from '../../config/Theme/fonts';
import colors from '../../config/Theme/theme';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import CircularIcon from '../../components/CircularIconButton';
import { useNavigation} from '@react-navigation/native';
import {CustomButton} from '../ProductDetails/ProductDetails';
import {useSelector, useDispatch} from 'react-redux';
import {updateQuantity} from '../../redux/slices/cartSlice';
import ButtonComp from '../../components/ButtonComp';
import {
  useGetTokenQuery,
  useCreateOrderMutation,
  useCapturePaymentMutation,
} from '../../redux/slices/apiSlice'; // Import useCreateOrderMutation
import {WebView} from 'react-native-webview';
import queryString from 'query-string';

const ReusableRow = ({
  leftText,
  rightText,
  leftTextStyle,
  rightTextStyle,
  containerStyle,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        ...containerStyle,
      }}>
      <Text
        style={{
          fontSize: responsiveFontSize(2),
          //   fontWeight: 'bold',
          color: '#616A7D',
          ...leftTextStyle,
          ...Fonts?.fontLight,
        }}>
        {leftText}
      </Text>
      <Text
        style={{
          fontSize: responsiveFontSize(2),
          color: '#1E222B',
          ...rightTextStyle,
          ...Fonts?.fontSemiBold,
        }}>
        {rightText}
      </Text>
    </View>
  );
};

const ProductCart = () => {
  const cartItems = useSelector(state => state?.cart?.cart);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [paypalUrl, setPaypalUrl] = useState(null);
  console.log('🚀 ~ file: Payment.js:45 ~ Payment ~ paypalUrl:', paypalUrl);
  const [accessToken, setAccessToken] = useState(null);
  console.log(JSON.stringify(orderDetail, null, 2)); // Output the orderDetail object

  const [
    capturePayment,
    {
      isLoading: isCapturing,
      isSuccess: captureSuccess,
      isError: captureError,
      error: captureErrorMessage,
    },
  ] = useCapturePaymentMutation();
  
  const {
    data: token,
    error: tokenError,
    isLoading: isTokenLoading,
  } = useGetTokenQuery();
  const [
    createOrder,
    {isLoading: isOrderLoading, isError: isOrderError, error: orderError},
  ] = useCreateOrderMutation();

  useEffect(() => {
    // Use the token or handle error/loading state here
    if (token) {
      console.log('Token:', token?.access_token);
      // You can perform additional actions with the token here
    }

    if (tokenError) {
      console.error('Error fetching token:', tokenError);
      // Handle error state here
    }
  }, [token, tokenError]);

  // useEffect(() => {
  //   // Call the capturePayment mutation when the component mounts or when orderID/authToken changes
  //   capturePayment({id: orderID, token});
  // }, [capturePayment, orderID, tokenError]);

  // Calculate total price of items in cart without discounts
const totalPrice = cartItems.reduce((total, item) => {
  return total + item.price * item.quantity;
}, 0);

// Calculate the factor to reduce the total price to $100
const factor = 100 / totalPrice;

// Adjust the prices of items proportionally to fit within the $100 limit
cartItems.forEach(item => {
  item.price = Math.round(item.price * factor); // Adjust price
});

// Recalculate the total price after adjusting prices
const itemTotalValue = cartItems.reduce((total, item) => {
  return total + item.price * item.quantity;
}, 0);

// Create orderDetail object with adjusted prices
const orderDetail = {
  intent: "CAPTURE",
  purchase_units: [
    {
      items: cartItems.map(item => ({
        name: item.title,
        description: item.description,
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: "USD",
          value: item.price.toFixed(2) // Unit amount without discount
        }
      })),
      amount: {
        currency_code: "USD",
        value: itemTotalValue.toFixed(2), // Use the calculated item_total value
        breakdown: {
          item_total: {
            currency_code: "USD",
            value: itemTotalValue.toFixed(2) // Use the calculated item_total value
          }
        }
      }
    }
  ],
  application_context: {
    return_url: "https://example.com/return",
    cancel_url: "https://example.com/cancel"
  }
}

  const onPressPaypal = async () => {
    try {
      const result = await createOrder({
        token: token?.access_token,
        orderDetail,
      }); // Added await since createOrder seems to be an asynchronous function
      setAccessToken(token);
      console.log('result:', JSON.stringify(result, null, 2)); // Changed res to result here and added a colon
      if (!!result?.data?.links) {
        const findUrl = result?.data?.links.find(
          data => data?.rel == 'approve',
        );
        setPaypalUrl(findUrl.href);
      }
      // Alert.alert('Order created'); // Changed 'User created' to 'Order created' for clarity
      console.info("🚀 Order created:" )
      console.log('🚀 ~ file: Payment.js:81 ~ onPressPaypal ~ result:', result);
      // Handle success scenario
    } catch (error) {
      // Handle error scenario
      console.error('Error creating order:', error);
    }
  };

  const onUrlChange = webviewState => {
    console.log('webviewStatewebviewState', webviewState);
    if (webviewState.url.includes('https://example.com/cancel')) {
      clearPaypalState();
      return;
    }
    if (webviewState.url.includes('https://example.com/return')) {
      const urlValues = queryString.parseUrl(webviewState.url);
      console.log('my urls value', urlValues);
      const {token} = urlValues.query;
      if (!!token) {
        paymentSucess(token);
      }
    }
  };

  const paymentSucess = async id => {
    try {
      const res = capturePayment({id, token});
      console.log('capturePayment res++++', res);
      alert('Payment sucessfull...!!!');
      clearPaypalState();
    } catch (error) {
      console.log('error raised in payment capture', error);
    }
  };

  const clearPaypalState = () => {
    setPaypalUrl(null);
    setAccessToken(null);
  };

  const handleIncreaseQuantity = id => {
    const currentItem = cartItems.find(item => item.id === id);
    if (currentItem) {
      const newQuantity = currentItem.quantity + 1;
      dispatch(updateQuantity({id: id, quantity: newQuantity}));
    }
  };

  const handleDecreaseQuantity = id => {
    const currentItem = cartItems.find(item => item.id === id);
    if (currentItem && currentItem.quantity > 1) {
      const newQuantity = currentItem.quantity - 1;
      dispatch(updateQuantity({id: id, quantity: newQuantity}));
    }
  };

  const calculateSubtotal = () => {
    return cartItems?.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal;
  };

  const renderItem = ({item}) => (
    <View
      key={item?.id?.toString()}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: responsiveHeight(2),
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Image
          source={{
            uri: item?.thumbnail,
          }}
          style={{width: 50, height: 50, marginRight: 10, borderRadius: 25}}
          resizeMode="cover"
        />
        {/* View with Texts */}
        <View style={{marginLeft: 10}}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.2),
              color: '#1E222B',
              ...Fonts?.fontMedium,
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: responsiveFontSize(2.2),
              color: '#1E222B',
              ...Fonts?.fontRegular,
            }}>
            {item.price}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <CircularIcon
          onPress={() => handleIncreaseQuantity(item?.id)}
          containerStyles={{padding: responsiveWidth(3)}}
          color="#E7ECF0"
          iconColor="black"
          size={14}
          iconName="plus"
        />
        <Text
          style={{
            fontSize: responsiveFontSize(2.3),
            color: '#1E222B',
            ...Fonts?.fontRegular,
            marginHorizontal: responsiveWidth(3),
          }}>
          {item?.quantity}
        </Text>
        <CircularIcon
          onPress={() => handleDecreaseQuantity(item?.id)}
          containerStyles={{padding: responsiveWidth(3)}}
          color="#E7ECF0"
          iconColor="black"
          size={14}
          iconName="minus"
        />
      </View>
    </View>
  );

  return (
    <View
      style={{
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 15,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
        <CircularIcon
          onPress={() => navigation.goBack()}
          containerStyles={{padding: responsiveWidth(3)}}
          color="#E7ECF0"
          iconColor="#A9B4BC"
          size={14}
          iconName="left"
        />
        <Text
          style={{
            fontSize: responsiveFontSize(2.5),
            color: '#1E222B',
            ...Fonts?.fontMedium,
            marginLeft: responsiveWidth(7),
          }}>
          Shopping Cart ({cartItems?.length})
        </Text>
      </View>
      <View style={{}}>
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{marginTop: responsiveHeight(3)}}
        />
      </View>
      <Text
        style={{
          fontSize: responsiveFontSize(1.9),
          color: colors.blue,
          ...Fonts?.fontMedium,
          textAlign: 'right',
        }}>
        Edit
      </Text>

      <View
        style={{
          padding: 16,
          borderRadius: 8,
          backgroundColor: '#E7ECF0',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginTop: 'auto',
          marginBottom: 10,
        }}>
        <View
          style={{
            padding: 16,
          }}>
          <ReusableRow
            leftText="Total"
            rightText={`$${calculateTotal()}`}
            containerStyle={{marginBottom: 10}}
          />
          <CustomButton
            title="Proceed  To checkout"
            onPress={onPressPaypal}
            buttonStyle={{
              backgroundColor: colors.blue,
              borderRadius: responsiveWidth(5),
              padding: responsiveWidth(5),
              paddingHorizontal: responsiveWidth(20),
              marginVertical: 10,
            }}
            textStyle={{
              fontSize: responsiveFontSize(1.8),
              ...Fonts?.fontSemiBold,
              textAlign: 'center',
              color: 'white',
              width: '100%',
            }}
            disabled={isTokenLoading || isOrderLoading}
            isLoading={isTokenLoading || isOrderLoading}
          />
                <Modal visible={!!paypalUrl}>
        <TouchableOpacity onPress={clearPaypalState} style={{margin: 24}}>
          <Text style={{color: 'black'}}>Closed</Text>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <WebView
            source={{uri: paypalUrl}}
            onNavigationStateChange={onUrlChange}
            incognito={true}
            allowGoBack={true} // Enable the ability to go back
          />
        </View>
      </Modal>
        </View>
      </View>
    </View>
  );
};

export default ProductCart;

const styles = StyleSheet.create({});

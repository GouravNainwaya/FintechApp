import React, {useEffect,useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import ButtonComp from '../../components/ButtonComp';
import {
  useGetTokenQuery,
  useCreateOrderMutation,
  useCapturePaymentMutation,
} from '../../redux/slices/apiSlice'; // Import useCreateOrderMutation
import {WebView} from 'react-native-webview';
import queryString from 'query-string';

import {useSelector, useDispatch} from 'react-redux';

const Payment = () => {
  const [paypalUrl, setPaypalUrl] = useState(null);
  const cartItems = useSelector(state => state?.cart?.cart);
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

  // useEffect(() => {
  //   // Call the capturePayment mutation when the component mounts or when orderID/authToken changes
  //   capturePayment({id: orderID, token});
  // }, [capturePayment, orderID, tokenError]);

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

  return (
    <ScreenWrapper>
      <ButtonComp
        onPress={onPressPaypal}
        disabled={isTokenLoading || isOrderLoading}
        btnStyle={{backgroundColor: '#0f4fa3', marginVertical: 16}}
        text="PayPal"
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
    </ScreenWrapper>
  );
};

export default Payment;

const styles = StyleSheet.create({});

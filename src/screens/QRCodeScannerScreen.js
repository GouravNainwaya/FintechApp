import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View,BackHandler} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';
import Toast from 'react-native-toast-message';
import ClientUrl from '../../config';

const QRCodeScannerScreen = ({navigation, route}) => {
  const {loggedinUserData} = route?.params;
  const [response, setResponse] = useState({});

  const showToast = ({type, message}) => {
    Toast.show({
      type: type, // or 'error', 'info', 'warning'
      text1: message,
    });
  };

  const onReadCode = async event => {
      try {
        // Get the scanned data from the event
        const scannedData = event.nativeEvent.codeStringValue;

        const scannedValue = scannedData.includes('=')? scannedData.split('=')[1]: null;
        const responses = await axios.get(
          `${ClientUrl}makePaymentsUsingUpiId?upiId=${scannedValue}`,
        );

        if (response?.status === 400) {
          showToast({type: "error", message: response?.data?.message})
          return 
        }
  
        if (response?.status === 404) {
          showToast({type: "error", message: response?.data?.message})
          return 
        }
        // Assuming the API response contains the quote you want to display
        const {data} = responses;
        // console.log("data", data.users);
        setResponse(data?.inputUidUser);
        console.log('status', responses.status);
        // console.log("QRCodeScannerScreen response", JSON.stringify(data?.inputUidUser, null, 2));
        if (data.success) {
          showToast({type: "success", message: response?.data?.message})
          navigation.navigate('RupessInput', {
            loggedinUserData,
            userDataUPiID: response.upiId,
            userDataName: response?.username,
          })
        }

        // setQuote(data.quote);
        // setLoading(false);
      } catch (error) {
        showToast({type: "error", message: error.message})
        // setLoading(false);
      }
    // Navigate to a new screen with the scanned data
    // if (scannedData) {
    //   navigation.navigate('ScannedDataScreen', { scannedData });
    // }
  };

  const handleBackButton = () => {
    // Add a confirmation dialog or logic to exit the app.
    // You may want to ask the user for confirmation.
    // For a simple exit without confirmation:
    // BackHandler.exitApp();
    navigation.navigate("HomeScreen")
    return true;
  };
  

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <CameraScreen
        // Barcode props
        scanBarcode={true}
        onReadCode={onReadCode} // optional
        showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
        laserColor="red" // (default red) optional, color of laser in scanner frame
        frameColor="white" // (default white) optional, color of border of scanner frame
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: 'white',
    textAlign: 'center',
  },
});

export default QRCodeScannerScreen;

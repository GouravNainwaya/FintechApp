import {BackHandler, Button, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import QRCode from 'react-native-qrcode-svg';
import {Appbar} from 'react-native-paper';

const Profile = ({navigation, route}) => {
  const {loggedinUserData} = route?.params;

  const handleBackButton = () => {
    // Add a confirmation dialog or logic to exit the app.
    // You may want to ask the user for confirmation.
    // For a simple exit without confirmation:
    // BackHandler.exitApp();
    navigation?.navigate("HomeScreen")
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      BackHandler.remove();
    };
  }, []);
  // alert(JSON.stringify(loggedinUserData, null, 2))
  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('HomeScreen')} />
        <Appbar.Content title="Profle and Scanner" />
      </Appbar.Header>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <QRCode
          value={`upi://pay?pa=${loggedinUserData?.upiId}`} // Generate UPI payment URL
          size={200} // Set the size of the QR code
          color="black" // Set the color of the QR code
          backgroundColor="white" // Set the background color of the QR code
        />
        <View style={{height: '10%'}}></View>
        <Button
          title="Scan Qr Code"
          onPress={() =>
            navigation.navigate('QRCodeScannerScreen', {loggedinUserData})
          }
        />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});

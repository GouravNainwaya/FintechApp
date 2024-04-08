import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {Appbar} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import ClientUrl from '../../config';
import Entypo from 'react-native-vector-icons/Entypo'; // Make sure to install the appropriate icon library
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import colors from '../utlis/colors';

const HomeScreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [loggedinUserData, setLoggedinUserData] = useState();
  const [loggedinUserBalance, setLoggedinUserBalance] = useState();
  const [recentTransactionsUser, setRecentTransactionsUser] = useState([]);
  const [loading, setLoading] = useState(false);
  let butonss = [
    {label: 'Account', id: 1},
    {label: 'Debit Card', id: 2},
    {label: 'Loans', id: 3},
  ];

  const [cardData, setCardData] = useState({});

  const handleCardDataChange = (formData) => {
    setCardData(formData);
  };

  const handlePayment = () => {
    // Implement your payment logic using cardData
    console.log(cardData);
  };

  let squareBtns = [
    {label: 'Bank Transfer', id: 1, onPress: () => {}, icon: <FontAwesome
    name="bank"
    color="gray"
    style={{margin: 10}}
    size={30}
  />},
    {
      label: 'Scan QR Code',
      id: 2,
      icon: <Ionicons
    name="scan-sharp"
    color="gray"
    style={{margin: 10}}
    size={30}
  />,
      onPress: () =>
        navigation.navigate('QRCodeScannerScreen', {loggedinUserData}),
    },
    {
      label: 'upi transfer',
      id: 3,
      icon: <Foundation
    name="at-sign"
    color="gray"
    style={{margin: 10}}
    size={30}
  />,
      onPress: () => navigation?.navigate('UPIidInput', {loggedinUserData}),
    },
    {label: 'view expenses', id: 4,icon: <Foundation
    name="clipboard-notes"
    color="gray"
    style={{margin: 10}}
    size={30}
  />, onPress: () => {}},
    {label: 'View Products', id: 4,icon: <Entypo
    name="shop"
    color="gray"
    style={{margin: 10}}
    size={30}
  />, onPress: () => navigation?.navigate('EcommerceHome')},
  ];

  const showToast = ({type, message}) => {
    Toast.show({
      type: type, // or 'error', 'info', 'warning'
      text1: message,
    });
  };

  const RenderHeading = ({text}) => {
    return (
      <Text
        style={{
          fontSize: responsiveFontSize(2),
          marginVertical: responsiveHeight(3),
          fontWeight: '500',
          color: 'black',
          textTransform: 'capitalize',
        }}>
        {text}
      </Text>
    );
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${ClientUrl}getAllUsers`);

      if (response?.status === 404) {
        showToast({type: 'error', message: response?.data?.message});
        return;
      }

      if (response?.status === 500) {
        showToast({type: 'error', message: response?.data?.message});
        return;
      }
      // Assuming the API response contains the quote you want to display
      const {data} = response;
      // console.log("data", data.users);
      if (response.status == 200) {
        const jsonValue = await AsyncStorage.getItem('my-key');
        const localStorage = jsonValue != null ? JSON.parse(jsonValue) : null;
        setLoggedinUserData(localStorage);
        setAllUsers(
          data?.users.filter(item => item.username !== localStorage.username),
        );
        showToast({type: 'success', message: 'AllUsers Fetched Successfully'});
      }

      // alert(JSON.stringify(localStorage, null, 2))
      return 0;
      // setQuote(data.quote);
      // setLoading(false);
    } catch (error) {
      showToast({type: 'error', message: error.message});
      return 0;
      // setLoading(false);
    }
  };

  const getloggedinUserBalance = async () => {
    try {
      const response = await axios.get(
        `${ClientUrl}getloggedinUserBalance?upiId=${loggedinUserData?.upiId}`,
      );
      if (response?.status === 400) {
        showToast({type: 'error', message: response?.data?.message});
        return;
      }

      if (response?.status === 404) {
        showToast({type: 'error', message: response?.data?.message});
        return;
      }
      const {data} = response;
      // console.log("getloggedinUserBalance Data", JSON.stringify(data?.loggedInUser, null, 2));
      if (response.status == 200) {
        setLoggedinUserBalance(data?.loggedInUser?.Balance);
        showToast({
          type: 'success',
          message: 'recent User getloggedinUserBalance Successfully',
        });
      }
      // alert(response.status);
    } catch (error) {
      showToast({type: 'error', message: error.message});
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Your code to run when the screen gains focus
      getAllUsers(); // Call the function you want to run on focus
    });

    return unsubscribe; // Cleanup when the component unmounts
  }, [navigation, getAllUsers]);


  useFocusEffect(
    React.useCallback(() => {
      // This code will run when the screen gains focus after navigation.
      // Call your function here.
      getloggedinUserBalance();
    }, [getloggedinUserBalance])
  );


  const fetchData = useCallback(async () => {
    // alert(JSON.stringify(loggedinUserData))
    try {
      const response = await axios.get(
        `${ClientUrl}getrecentTrxUsers?upiId=${loggedinUserData?.upiId}`,
      );
      const {data} = response;

      // alert(JSON.stringify(data.recentTrxUsers))

      if (response?.status === 400) {
        showToast({type: 'error', message: response?.data?.message});
        return;
      }

      if (response?.status === 404) {
        showToast({type: 'error', message: response?.data?.message});
        return;
      }
      if (data?.success) {
        await setRecentTransactionsUser(data?.recentTrxUsers);
        showToast({
          type: 'success',
          message: 'recent User Fetched Successfully',
        });
      }
    } catch (error) {
      showToast({type: 'error', message: error.message});
    }
  }, [loggedinUserData?.upiId]);

  useFocusEffect(
    React.useCallback(() => {
      // This code will run when the screen gains focus after navigation.
      // Call your function here.
      fetchData();
    }, [fetchData])
  );

  // useFocusEffect(fetchData);

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('my-key');
    } catch (e) {
      console.log('error removeValue', e);
      // remove error
    }
    showToast({type: 'error', message: 'User Logout Successfully'});
  };

  const handleBackButton = () => {
    // Add a confirmation dialog or logic to exit the app.
    // You may want to ask the user for confirmation.
    // For a simple exit without confirmation:
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(loggedinUserData?.upiId);
      // Optionally, you can provide feedback to the user that the text has been copied.
      showToast({type: 'success', message: 'Text copied to clipboard!'});
    } catch (error) {
      // Handle errors, e.g., by displaying an error message.
      showToast({
        type: 'error',
        message: `Failed to copy text to clipboard. ${loggedinUserData?.upiId}`,
      });
    }
  };

  // console.log("fd", JSON.stringify(allUsers, null, 2));

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.Action
          icon="menu"
          onPress={() => {
            // Handle the left icon click
            navigation?.navigate('Profile', {loggedinUserData});
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginLeft: responsiveWidth(60),
            alignItems: 'center',
          }}>
          <Appbar.Action
            onPress={() => {
              // Handle the first right icon click
            }}
            icon="bell"
          />
          <Appbar.Action
            icon="microphone-question-outline"
            onPress={() => {
              // Handle the second right icon click
            }}
          />
        </View>
      </Appbar.Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, paddingHorizontal: responsiveWidth(5)}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: responsiveHeight(2),
            }}>
            {butonss.map((item, index) => {
              return (
                <TouchableOpacity
                  key={`hello${index}`}
                  onPress={() => setSelectedButton(item.id)}>
                  <View
                    style={[
                      selectedButton === item.id
                        ? styles.selectedBtn
                        : styles.unSelectedBtn,
                    ]}>
                    <Text
                      style={[
                        selectedButton === item.id
                          ? styles.selectedbuttonText
                          : styles.unSelectedbuttonText,
                      ]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={{marginLeft: 'auto'}}>
              <Button
                title="Logout"
                onPress={() => {
                  removeValue();
                  navigation.navigate('SignIn');
                }}
              />
            </TouchableOpacity>
          </View>

          {/* <LinearGradient
            colors={['#FF1493', '#FF0000']} // Pink to Red
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.rectangle}>
            <View style={{margin: responsiveWidth(5)}}>
              <LinearGradient
                colors={['#FF1493', '#FFC0CB']} // Pink to Light Pink
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  width: responsiveWidth(55), // Adjust the width as needed
                  height: responsiveHeight(10), // Adjust the height as needed
                  borderRadius: 10, // If you want rounded corners
                }}>
                <View style={{margin: responsiveWidth(4)}}>
                  <Text
                    style={{color: 'white', fontSize: responsiveFontSize(1.9)}}>
                    Walllet Balance
                  </Text>
                  <Text
                    style={{color: 'white', fontSize: responsiveFontSize(1.9)}}>
                    ₹{loggedinUserBalance}
                  </Text>
                </View>
              </LinearGradient>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{color: 'white', fontSize: responsiveFontSize(1.9)}}>
                  <Text style={{}}>
                    UPI ID:{' '}
                    <Text style={{color: 'white'}}>
                      {loggedinUserData?.upiId}
                    </Text>
                  </Text>
                </Text>
                <AntDesign
                  name="copy1"
                  style={{margin: 10}}
                  color="white"
                  size={16}
                  onPress={copyToClipboard}
                />
              </View>
              <TouchableOpacity style={styles.buttonContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: responsiveWidth(5),
                    alignItems: 'center',
                  }}>
                  <Text style={styles.buttonText}>Add money</Text>
                  <AntDesign
                    name="right"
                    style={{marginLeft: responsiveWidth(1)}}
                    color="white"
                    size={13}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient> */}
        <CreditCardInput onChange={handleCardDataChange} labelStyle={{color: "black"}}/>

          {/* box row */}
          <View
            style={{
              alignItems: 'center',
              marginTop: responsiveHeight(4),
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            {squareBtns.map((item, index) => {
              return (
                <View key={`hello${index}`}>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#ffffff',
                      elevation: 2,
                      width: responsiveWidth(16),
                      height: responsiveHeight(8),
                      borderRadius: responsiveWidth(1.5),
                    }}
                    onPress={item.onPress}>
                    {item?.icon}
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.4),
                      textTransform: 'capitalize',
                      textAlign: 'center',
                      fontWeight: '400',
                      width: responsiveWidth(15),
                      color: 'grey',
                      marginTop: responsiveHeight(1),
                    }}>
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>
          {/* box row */}
          {/* recent transaction */}
          <RenderHeading text={'recent transaction'} />

          {recentTransactionsUser?.map((item, index) => {
            const LastSendedRupee = item?.payments[item?.payments?.length - 1]?.receiverAmount
            return (
              <TouchableOpacity
                key={`hello${index}`}
                onPress={() =>
                  {
                    navigation.navigate('PaymentsAddAndHistory', {
                      loggedinUserData,
                      userDataUPiID: item.receiver,
                      userDataName: item?.name,
                      title: 'Payments Pending',
                    })
                    console.log("recet item", JSON.stringify(item))
                  }
                }
                style={[
                  styles.rowContent,
                  {paddingHorizontal: responsiveWidth(2)},
                ]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.rowIcon} />
                  <View style={{marginLeft: responsiveWidth(4)}}>
                    <Text style={styles.rowTitle}>{item?.name}</Text>
                    <Text style={styles.rowSubtitle}>
                      Drag the row left and right
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    fontWeight: '500',
                    textAlign: 'center',
                    color: 'black',
                    textTransform: 'capitalize',
                  }}>
                  {LastSendedRupee}Rs
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* recent transaction */}

          <RenderHeading text={'Payments Pending'} />

          {allUsers.map((item, index) => {
            return (
              <TouchableOpacity
                key={`hello${index}`}
                onPress={() =>
                  navigation.navigate('PaymentsAddAndHistory', {
                    loggedinUserData,
                    userDataUPiID: item.upiId,
                    userDataName: item?.username,
                    title: 'Payments Pending',
                  })
                }
                style={[styles.rowContent, {}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.rowIcon} />
                  <View style={{marginLeft: responsiveWidth(4)}}>
                    <Text style={styles.rowTitle}>{item.username}</Text>
                    <Text style={styles.rowSubtitle}>
                      Drag the row left and right
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  key={item._id}
                  onPress={() =>
                    navigation.navigate('RupessInput', {
                      loggedinUserData,
                      userDataUPiID: item.upiId,
                      userDataName: item?.username,
                      title: 'Payments Pending',
                    })
                  }>
                  <View
                    style={[
                      styles.unSelectedBtn,
                      {width: responsiveWidth(25), marginRight: 0},
                    ]}>
                    <Text style={styles.unSelectedbuttonText}>Send Money</Text>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  selectedBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    width: responsiveWidth(20),
    borderRadius: responsiveWidth(1.5),
    padding: 5,
    marginRight: 5,
    elevation: 1,
  },
  unSelectedBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    width: responsiveWidth(20),
    borderRadius: responsiveWidth(1.5),
    padding: 5,
    marginRight: 10,
    // elevation: 1,
  },
  selectedbuttonText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: 'white',
  },
  unSelectedbuttonText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: 'grey',
  },
  gradient: {
    width: 200, // Adjust the width of the gradient box as needed
    height: 100, // Adjust the height of the gradient box as needed
    borderRadius: 10, // Adjust the border radius as needed
    padding: 10,
  },
  content: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 0.2,
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1),
    borderTopColor: 'maroon',
    borderBottomColor: 'maroon',
    borderBottomWidth: 0.3,
    borderTopWidth: 0.3,
  },
  rowIcon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    borderRadius: 25,
    backgroundColor: 'red',
    // margin: 20
  },
  rowTitle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: responsiveFontSize(1.8),
  },
  rowSubtitle: {
    fontSize: responsiveFontSize(1.45),
    color: 'gray',
  },
  button: {
    width: 40,
    height: 40,
  },
  rectangle: {
    width: responsiveWidth(92), // Adjust the width as needed
    // height: responsiveHeight(21), // Adjust the height as needed
    borderRadius: responsiveWidth(5),
  },
  buttonContainer: {
    width: responsiveWidth(32), // Adjust the width to control the oval shape
    height: responsiveHeight(5), // Adjust the height to control the oval shape
    borderRadius: 30, // Half of the button's height to make it an oval
    backgroundColor: 'maroon', // Button background color
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.7),
  },
});
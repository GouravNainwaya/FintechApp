import axios from 'axios';
import React, { useReducer, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Toast from 'react-native-toast-message';
import ClientUrl from '../../config';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'confirm'];

const initialPin = { a: '', b: '', c: '', d: '' };

const RupessInput = ({route,navigation}) => {
  const { userDataUPiID ,loggedinUserData,userDataName} = route?.params;
  const [pin, setPin] = useState({ ...initialPin });
  const [hidden, setHidden] = useState(true);

  // alert(JSON.stringify(userDataUPiID ,userDataName))

  const showToast = ({type, message}) => {
    Toast.show({
      type: type, // or 'error', 'info', 'warning'
      text1: message,
    });
  };

  const AddPayments = async (pinValue) => {
    // alert(userData.upiId)
    try {
      const requestData = {
        "name": userDataName, // for receiverName
        "upiId": loggedinUserData?.upiId, // for sender up id 
        "sender": loggedinUserData?.upiId,
        "receiver": userDataUPiID,
        "payments": [
          {
            "senderAmount": Number(pinValue),
            "receiverAmount": Number(pinValue),
            "sender": loggedinUserData?.upiId,
            "receiver": userDataUPiID,
            "date": new Date()
          }
        ]
      }
  
      console.log("requestData AddPayments", JSON.stringify(requestData, null, 2));
      const response = await axios.post(`${ClientUrl}addPayments`, requestData);
  
      if (response?.status === 400) {
        showToast({ type: "error", message: response?.data?.message || 'Bad Request' });
        return;
      }
  
      if (response?.status === 404) {
        showToast({ type: "error", message: response?.data?.message || 'Not Found' });
        return;
      }
  
      if (response.status === 201) {
        showToast({ type: "success", message: "Payments Successfully" });
        navigation.navigate("PaymentsAddAndHistory", { userDataUPiID, loggedinUserData });
      }
  
      // You can access other data from the response as needed.
      const { data } = response;
      // setQuote(data.quote);
      // setLoading(false);
    } catch (error) {
      showToast({ type: "error", message: error.message || 'An unexpected error occurred' });
      // setLoading(false);
    }
  };

  const onEnterPin = (btn) => {
    if (typeof btn === 'number') {
      for (let i = 0; i < Object.keys(pin).length; i += 1) {
        let key = Object.keys(pin)[i];
        if (!pin[key]) {
          const newPin = { ...pin };
          newPin[key] = btn.toString();
          setPin(newPin);
          break;
        }
      }
    } else {
      if (btn === 'clear') {
        for (let i = 0; i < Object.keys(pin).length; i += 1) {
          let key = Object.keys(pin).reverse()[i];
          if (pin[key]) {
            const newPin = { ...pin };
            newPin[key] = '';
            setPin(newPin);
            break;
          }
        }
      }
      if (btn === 'confirm') {
        let pinValue = Object.keys(pin)
          .map((pinKey) => pin[pinKey])
          .filter((x) => x)
          .join('');
        // alert(
        //   pinValue.length !== Object.keys(pin).length
        //     ? 'Please enter ' + Object.keys(pin).length + ' digit PIN'
        //     : 'pin you entered is - ' + pinValue
        // );
        AddPayments(pinValue)
        if (pinValue.length === Object.keys(pin).length) {
          setPin({ ...initialPin });
          // do your action
        }
      }
    }
  };


  let pinValue = Object.keys(pin)
    .map((pinKey) => pin[pinKey])
    .filter((x) => x)
    .join(' ');

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.optConteiner}>
          {Object.keys(pin).map((pinKey) => (
            <View key={pinKey} style={styles.optSubConteiner}>
              {pin[pinKey] ? (
                hidden ? (
                  <View style={styles.pinDot} />
                ) : (
                  <Text style={styles.pin}>{pin[pinKey]}</Text>
                )
              ) : (
                <View style={styles.empty} />
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.hideBtn, !pinValue && { opacity: 0.2 }]}
          disabled={!pinValue}
          onPress={() => setHidden(!hidden)}>
          <Text>{hidden ? 'SHOW' : 'HIDE'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.numberContainer}>
        {data.map((btn) => (
          <View key={btn} style={styles.btn}>
            <TouchableNativeFeedback onPress={() => onEnterPin(btn)}>
              <View style={styles.btn1}>
                <Text style={styles.btnTxt}>{btn}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000'
  },
  optConteiner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#000000'
  },
  btn: {
    width: '33.33%',
    backgroundColor: '#eee',
  },
  btn1: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#000000'
  },
  btnTxt: {
    fontSize: 30,
    color: '#ffff'
  },
  optSubConteiner: {
    width: 60,
    height: 40,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    height: 15,
    width: 15,
    borderRadius: 10,
    backgroundColor: '#444',
  },
  pin: {
    fontSize: 20,
  },
  empty: {
    height: 2,
    width: '100%',
    backgroundColor: '#666',
  },
  hideBtn: {
    padding: 20,
  },
});

export default RupessInput;

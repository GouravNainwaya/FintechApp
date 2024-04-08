import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {Appbar} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ClientUrl from '../../config';

function UPIidInput({navigation, route}) {
  const {loggedinUserData} = route.params;
  const [upiId, setUPIId] = useState('');
  const [response, setResponse] = useState({});

  const showToast = ({type, message}) => {
    Toast.show({
      type: type, // or 'error', 'info', 'warning'
      text1: message,
    });
  };

  

  const handleSubmit = async () => {
    if (upiId && loggedinUserData.upiId != upiId.trim().toLowerCase()) {
      // console.log("loggedinUserData?.upiId", loggedinUserData?.upiId);
      // console.log("inputupiId", JSON.stringify(upiId));
      try {
        const responses = await axios.get(
          `${ClientUrl}makePaymentsUsingUpiId?upiId=${upiId.trim().toLowerCase()}`,
        );
        const {data} = responses;

        if (data.success) {
          navigation.navigate('RupessInput', {
            loggedinUserData,
            userDataUPiID: data?.inputUidUser.upiId,
            userDataName: data?.inputUidUser?.username,
          });
          showToast({type: 'success', message: response?.data?.message});
        } else if (response.status === 400 || response.status === 500) {
          showToast({ type: "error", message: response.data.message });
        }  else if (response.status === 404 || response.status === 500) {
          showToast({ type: "error", message: response.data.message });
        }else {
          console.log("response handleLogin", response);
          showToast({ type: "error", message: "Unknown error occurred" });
        }
        // Assuming the API response contains the quote you want to display
        // console.log("data", data.users);
        setResponse(data?.inputUidUser);
        // console.log(
        //   'UPIidInput response',
        //   JSON.stringify(data?.inputUidUser.upiId, null, 2),
        // );
        // setQuote(data.quote);
        // setLoading(false);
      } catch (error) {
        showToast({type: 'error ', message: error.message});
        // console.warn('Error fetching data: UPIidInput', error);
        // setLoading(false);
      }
    } else {
      showToast({type: 'error', message: 'Please fill All Fields or Dont use LoggedinUser upi Account ID'});
    }
  };


  return (
    <View style={{flex: 1, backgroundColor: '#000000'}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('HomeScreen')} />
        <Appbar.Content title="UPIidInput" />
      </Appbar.Header>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <MaterialIcons
          name="sensor-occupied"
          type="material-community"
          size={100}
          color="white"
        />
        <Text style={{color: 'white', marginVertical: 5}}>
          Enter Receiver UPI ID
        </Text>
        <TextInput
          style={{
            width: 200,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginTop: 10,
            paddingLeft: 10,
            color: 'white',
          }}
          onChangeText={text => setUPIId(text)}
          value={upiId}
          placeholder="yourname@okicici"
        />
        <View style={{height: '5%'}} />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
}

export default UPIidInput;

import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import { BackHandler, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ClientUrl from '../../config';

export default function PaymentsAddAndHistory({route,navigation}) {
  const { userDataUPiID ,loggedinUserData} = route.params;
  const [messages, setMessages] = useState([]);
  let filterData2

  const showToast = ({type, message}) => {
    Toast.show({
      type: type, // or 'error', 'info', 'warning'
      text1: message,
    });
  };

  const backAction = () => {
    if (navigation.isFocused()) {
      // Navigate to the home screen
      navigation.navigate('HomeScreen');
      return true; // To prevent default back button behavior
    }
    return false; // Allow default back button behavior
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [navigation]);

  useEffect(() => {
    // alert(loggedinUserData.upiId)
    const getFetchUser = async () => {
      try {
        const response = await axios.get(`${ClientUrl}fetchUser`);
                  console.log("loggedinUserData?.upiId", loggedinUserData?.upiId);
          console.log("userData?.upiId", JSON.stringify(userDataUPiID));
          if (response.status === 200) {
            const { data } = response;

          if (loggedinUserData?.upiId == userDataUPiID) {
            filterData2 = data?.fetchUser?.filter(item => (
              (item.sender === loggedinUserData?.upiId || item.sender === userDataUPiID) ||
              (item.receiver === userDataUPiID || item.receiver === loggedinUserData?.upiId)
            ));
          }else{
          // Filter the data based on your conditions
          filterData2 = data?.fetchUser?.filter(item => (
            (item.sender === loggedinUserData?.upiId || item.sender === userDataUPiID) &&
            (item.receiver === userDataUPiID || item.receiver === loggedinUserData?.upiId)
          ));
          }

          if (filterData2.length > 0) {
            setMessages(filterData2[0]?.payments);
            showToast({ type: "success", message: "Payments Fetched Successfully" });
          } else {
            showToast({ type: "error", message: "No matching data found" });
          }
        } else {
          showToast({ type: "error", message: "Failed to fetch data" });
        }
      } catch (error) {
        showToast({ type: "error", message: error.message });
        // Handle the error or log it as needed
        // console.error('Error fetching data: getFetchUser', error);
      }
    };
    
    getFetchUser()
  }, [])

  // console.log("messages", messages);
  // console.log("loggedinUserData.upiId", loggedinUserData.upiId);

  return (
    <View style={styles.container}>
        <Appbar.Header>
    <Appbar.BackAction onPress={() => navigation.navigate("HomeScreen")} />
    <Appbar.Content title="Payments Add And History" />
  </Appbar.Header>
      <FlatList
        data={messages}
        // keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ChatItemMemo  item={item} index={index} loggedinUserData={loggedinUserData} />
        )}
        inverted
        contentContainerStyle={styles.listStyle}
      />
    </View>
  );
}

function ChatItem({item , loggedinUserData}) {
  const dateString = new Date();

  // Parse the date string into a JavaScript Date object
  const date = new Date(dateString);

  // Format the date and time
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short' 
  };

  const formattedDate = date.toLocaleDateString(undefined, options);
    // alert(JSON.stringify(item, null, 2))
    // console.log("item",JSON.stringify(item, null, 2))
  return (
    <View style={[styles.chatMessage, item.sender === loggedinUserData.upiId  ? styles.send : styles.receive]}>
    <Text style={styles.dateText}>{formattedDate}</Text>
    <Text>{item?.senderAmount} Rs</Text>
  </View>
  );
}

const ChatItemMemo = memo(ChatItem, () => true);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21211e'
  },
  bottom: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  chatItemCommon: {
    marginBottom: 2,
  },
  send: {
    alignSelf: 'flex-end',
  },
  receive: {
    alignSelf: 'flex-start',
  },
  msgtxt: {
    backgroundColor: 'lightgrey',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    maxWidth: '75%',
  },
  listStyle: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  chatMessage: {
    backgroundColor: 'darkslategray',
    color: 'white',
    padding: 10,
    borderRadius: 10,
  },
  dateText: {
    fontWeight: 'bold',
  },
});

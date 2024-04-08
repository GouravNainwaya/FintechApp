import React, {useRef, lazy, Suspense} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ActivityIndicator, View} from 'react-native';
import Payment from '../screens/Payment/Payment';
import Expneses from '../screens/Expenses/Expneses';
import Profile from '../screens/Profile';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loading from '../screens/auth/Loading';
import SignIn from '../screens/auth/SigIn';
import Login from '../screens/auth/Login';
import HomeScreen from '../screens/HomeScreen';
import QRCodeScannerScreen from '../screens/QRCodeScannerScreen';
import UPIidInput from '../screens/UPIidInput';
import { navigationRef } from '../Hooks/navigationRef';

const Stack = createNativeStackNavigator();

// Lazy load screen components
const LazyHome = lazy(() => import('../screens/Home/Home'));
const LazyPayment = lazy(() => import('../screens/Payment/Payment'));
const LazyProductCart = lazy(() =>
  import('../screens/ProductCart/ProductCart'),
); // Lazy load ProductCart component
const LazyProductDetails = lazy(() =>
  import('../screens/ProductDetails/ProductDetails'),
); // Lazy load ProductDetails component
const LazyEcommerceHome = lazy(() =>
  import('../screens/EcommerceHome/EcommerceHome'),
); // Lazy load EcommerceHome component

// Fallback component for Suspense
const SuspenseFallback = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" color="orange" />
  </View>
);
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }} >
      <Stack.Screen
        name="HomeScreen"
        options={{headerShown: false}}
        component={HomeScreen}
      />
      <Stack.Screen
        name="QRCodeScannerScreen"
        options={{headerShown: false}}
        component={QRCodeScannerScreen}
      />
      <Stack.Screen
        name="UPIidInput"
        options={{headerShown: false}}
        component={UPIidInput}
      />
      {/* <Stack.Screen options={{ headerShown: false }} name="Home">
        {props => (
          <Suspense fallback={<SuspenseFallback />}>
            <LazyHome {...props} />
          </Suspense>
        )}
      </Stack.Screen> */}
      <Stack.Screen name="Payment">
        {props => (
          <Suspense fallback={<SuspenseFallback />}>
            <LazyPayment {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="ProductCart">
        {props => (
          <Suspense fallback={<SuspenseFallback />}>
            <LazyProductCart {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="ProductDetails">
        {props => (
          <Suspense fallback={<SuspenseFallback />}>
            <LazyProductDetails {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="EcommerceHome">
        {props => (
          <Suspense fallback={<SuspenseFallback />}>
            <LazyEcommerceHome {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const TabNavigater = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let IconComponent;
          let iconName;

          if (route.name === 'Home') {
            IconComponent = AntDesign;
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Payment') {
            IconComponent = AntDesign;
            iconName = focused ? 'minussquareo' : 'minussquareo';
          } else if (route.name === 'Expneses') {
            IconComponent = FontAwesome;
            iconName = focused ? 'dollar' : 'dollar';
          } else if (route.name === 'Profile') {
            IconComponent = Ionicons;
            iconName = focused ? 'person' : 'person-outline';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        options={{headerShown: false}}
        component={HomeStack}
      />
      <Tab.Screen name="Payment" component={Payment} />
      <Tab.Screen
        options={{headerShown: false}}
        name="Expneses"
        component={Expneses}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const Navigation = () => {

  return (
    <NavigationContainer
      ref={navigationRef}
      fallback={<ActivityIndicator size="large" color="orange" />}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Loading"
          component={Loading}
          options={{headerShown: false}}
        />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Login" component={Login} /> 
        <Stack.Screen name="TabNavigater" component={TabNavigater} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

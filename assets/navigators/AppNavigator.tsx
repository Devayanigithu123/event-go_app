import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MyTicketsScreen from '../screens/MyTicketScreen';
import UserAccountScreen from '../screens/UserAccountScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import AdminPanel from '../screens/AdminPanel';


export type RootStackParamList = {
  Tab: undefined; 
  Home: undefined;
  QRScanner: undefined;
  Search: undefined;
  MyTicket: undefined;
  UserAccount: undefined;
  AdminPanel: undefined;
  EventDetails: { 
    eventId: string; 
    title?: string;  
  };
};

// 2. Create the navigator with typed params
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="MyTicket" component={MyTicketsScreen} />
      <Stack.Screen name="UserAccount" component={UserAccountScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="AdminPanel" component={AdminPanel} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './assets/navigators/TabNavigator';
import HomeScreen from './assets/screens/HomeScreen';
import SearchScreen from './assets/screens/SearchScreen';
import MyTicketsScreen from './assets/screens/MyTicketScreen';
import QRScannerScreen from './assets/screens/QRScannerScreen';
import UserAccountScreen from './assets/screens/UserAccountScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './assets/navigators/AppNavigator';
import EventDetailsScreen from './assets/screens/EventDetailsScreen';
import CreateEventScreen from './assets/screens/CreateEventScreen';
import AdminPanel from './assets/screens/AdminPanel';


const Stack = createStackNavigator();

console.log("✅ App started");


const App = () => {
  return (
    <NavigationContainer>
       <PaperProvider>
       <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tab" component={TabNavigator} options={{animation:'default'}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{animation:'slide_from_right'}}/>
        <Stack.Screen name="Search" component={SearchScreen} options={{animation:'slide_from_left'}}/>
        <Stack.Screen name="MyTicket" component={MyTicketsScreen} options={{animation:'slide_from_right'}}/>
        <Stack.Screen name="UserAccount" component={UserAccountScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{animation:'slide_from_bottom'}}/>
        <Stack.Screen 
          name="CreateEvent" 
          component={CreateEventScreen}
          options={{ title: 'Create Event' }}
        />
        <Stack.Screen 
          name="QRScanner" 
          component={QRScannerScreen}
          options={{ 
            title: 'Ticket Validation',
            headerShown: false 
          }} 
          />
        <Stack.Screen name="AdminPanel" component={AdminPanel} options={{animation:'slide_from_bottom'}}/>  
      </Stack.Navigator>
       </PaperProvider>
    </NavigationContainer>
  );
};


export default App;
 


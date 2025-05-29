import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import UserAccountScreen from '../screens/UserAccountScreen';
import MyTicketScreen from '../screens/MyTicketScreen';
import { FONTSIZE, SPACING } from '../../assets/theme/theme';
import CustomIcon from '../components/CustomIcon';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 68,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position:'absolute',
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="video" 
              label="Home"
            />
          )
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}  
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="search" 
              label="Search"
            />
          )
        }}
      />
      <Tab.Screen 
        name="MyTickets" 
        component={MyTicketScreen}  
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="ticket" 
              label="Tickets"
            />
          )
        }} 
      />
      <Tab.Screen 
        name="User" 
        component={UserAccountScreen}  
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="user" 
              label="Profile"
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const TabBarIcon = ({ focused, iconName, label }: { focused: boolean; iconName: string; label: string }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const opacityValue = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: focused ? 1.08 : 1,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(opacityValue, {
      toValue: focused ? 1 : 0.9,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={{
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
      }}>
        <CustomIcon 
          name={iconName} 
          color={focused ? '#FFA500' : '#888888'} 
          size={FONTSIZE.size_22}
        />
      </Animated.View>
      {focused && (
        <Animated.Text style={[styles.iconLabel, { opacity: opacityValue }]}>
          {label}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  iconLabel: {
    fontSize: FONTSIZE.size_10,
    fontWeight: '500',
    color: '#FFA500',
    marginTop: 4,
  },
});

export default TabNavigator;
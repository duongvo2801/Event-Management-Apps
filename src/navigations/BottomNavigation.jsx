import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import Icon from '../components/common/Icon';
import { Color } from '../components/styles/GlobalStyles';
import { axiosAuthGet } from '../configs/axiosInstance';
import { getAccessToken } from '../configs/utils/getAccessToken';
import {
  ProfileScreen,
  EventScreen,
  EmployeeScreen,
  ClientScreen,
  ChangePasswordScreen,
  AddClient,
  AddEvent,
  DetailEventScreen,
  DetailProfileScreen,
  StatisticsScreen,
  DetailEmployeeScreen,
  EditProfileScreen,
  DetailClientScreen,
  NotificationScreen,
} from '../screens';

const BottomNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="HomeNavigation">
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="AddClient" component={AddClient} options={{ headerShown: false }} />
      <Stack.Screen name="AddEvent" component={AddEvent} options={{ headerShown: false }} />
      <Stack.Screen
        name="DetailProfileScreen"
        component={DetailProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailEventScreen"
        component={DetailEventScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailEmployeeScreen"
        component={DetailEmployeeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StatisticsScreen"
        component={StatisticsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeNavigation"
        component={HomeNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailClientScreen"
        component={DetailClientScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const HomeNavigation = () => {
  const [isEmployee, setIsEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      const respone = await axiosAuthGet('/employee/get-employee-profile', accessToken);
      if (respone && respone.data && respone.data.employee) {
        if (respone.data.employee.name === 'Administrator') {
          setIsEmployee(false);
        } else {
          setIsEmployee(true);
        }
        setIsLoading(false);
      }
      // if (respone && respone.data && respone.data.employee) {
      //   if (respone.data.employee.name === 'Administrator') {
      //     setIsEmployee(false);
      //   } else {
      //     setIsEmployee(true);
      //   }
      //   setIsLoading(false);
      // }
    })();
  }, []);
  console.log(isEmployee);

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size={48} color={Color.primary} />
    </View>
  ) : isEmployee ? (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconSource;

          if (route.name === 'Event') {
            iconSource = require('../assets/icons/Event.png');
          } else if (route.name === 'Profile') {
            iconSource = require('../assets/icons/Manager.png');
          }

          return <Icon source={iconSource} color={color} style={{ marginTop: 8 }} />;
        },
        tabBarStyle: {
          height: 64,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          paddingHorizontal: 20,
        },
        tabBarActiveTintColor: Color.primary,
        tabBarInactiveTintColor: Color.neutral2,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        backgroundColor: 'red',
        borderTopWidth: 0,
      })}>
      <Tab.Screen name="Event" component={EventScreen} options={{ title: 'Sự kiện' }} />

      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
    </Tab.Navigator>
  ) : (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconSource;

          if (route.name === 'Event') {
            iconSource = require('../assets/icons/Event.png');
          } else if (route.name === 'Client') {
            iconSource = require('../assets/icons/GroupOutline.png');
          } else if (route.name === 'Employee') {
            iconSource = require('../assets/icons/BadgeOutline.png');
          } else if (route.name === 'Profile') {
            iconSource = require('../assets/icons/Manager.png');
          }

          return <Icon source={iconSource} color={color} style={{ marginTop: 8 }} />;
        },
        tabBarStyle: {
          height: 64,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          paddingHorizontal: 20,
        },
        tabBarActiveTintColor: Color.primary,
        tabBarInactiveTintColor: Color.neutral2,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        backgroundColor: 'red',
        borderTopWidth: 0,
      })}>
      <Tab.Screen name="Event" component={EventScreen} options={{ title: 'Sự kiện' }} />

      <Tab.Screen name="Client" component={ClientScreen} options={{ title: 'Khách hàng' }} />

      <Tab.Screen name="Employee" component={EmployeeScreen} options={{ title: 'Nhân viên' }} />

      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

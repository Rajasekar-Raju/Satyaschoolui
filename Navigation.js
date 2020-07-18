import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import Onboarding from './screens/onboarding';
import Auth from './screens/auth';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import Parent from './screens/auth/Parent';
import Physician from './screens/auth/Physician';
import Waiting from './screens/auth/Waiting';
import Success from './screens/auth/Success';
import Failure from './screens/auth/Failure';

import Left from './assets/images/common/left.png';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './utils/contants';

const isFirst = false;

const HeaderTitle = ({heading, subHeading}) => (
  <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
    <View style={{position: 'absolute', zIndex: 5}}>
      <Text style={{fontSize: 36, lineHeight: 49, color: `${colors.black}10`, fontFamily: 'Poppins_900Black'}}>{heading}</Text>
    </View>
    <View style={{position: 'relative', zIndex: 10}}>
      <Text style={{fontSize: 18, lineHeight: 24, color: colors.primary, fontFamily: 'Poppins_600SemiBold'}}>{subHeading}</Text>
    </View>
  </View>
);

const HeaderLeft = ({onPress}) => (
  <TouchableOpacity onPress={() => onPress()} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Image source={Left} />
  </TouchableOpacity>
);

const Stack = createStackNavigator();

const headerOptions = (heading, subHeading) => {
  return {
    headerStyle: {elevation: 0, shadowOpacity: 0},
    headerTitle: () => <HeaderTitle heading={heading} subHeading={subHeading} />,
    headerLeft: props => <HeaderLeft {...props} />,
    headerRight: props => <View></View>
  }
}

const RegisterStack = () => (
  <Stack.Navigator initialRouteName={'Register'}>
    <Stack.Screen name='Register' component={Register} options={headerOptions('Auth', 'Register')} />
    <Stack.Screen name='Parent' component={Parent} options={headerOptions('Auth', 'Register')} />
    <Stack.Screen name='Physician' component={Physician} options={headerOptions('Auth', 'Register')} />
    <Stack.Screen name='Waiting' component={Waiting} options={headerOptions('Auth', 'Register')} />
    <Stack.Screen name='Success' component={Success} options={headerOptions('Auth', 'Register')} />
    <Stack.Screen name='Failure' component={Failure} options={headerOptions('Auth', 'Register')} />
  </Stack.Navigator>
)

const AuthStack = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName={'Auth'}>
      <Stack.Screen name='Auth' component={Auth} options={{headerShown: false}} />
      <Stack.Screen name='Login' component={Login} options={headerOptions('Auth', 'Login')} />
      <Stack.Screen name='Register' component={RegisterStack} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>
)

const OnBoardStack = createSwitchNavigator({
  Onboarding: Onboarding,
  Auth: AuthStack,
}, {
  initialRouteName: 'Onboarding',
  lazy: false
});

const RootNavigator = createSwitchNavigator(isFirst ? {OnBoardStack} : {AuthStack});

export default createAppContainer(RootNavigator);

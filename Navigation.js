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

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colors, language } from './utils/contants';
import Questionnaire from './screens/dashboard/Qusetionnaire';
import Lang from './screens/auth/Lang';
import AsyncStorage from '@react-native-community/async-storage';

const isFirst = true;

const HeaderTitle = ({heading, subHeading}) => (
  <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
    <View style={{position: 'absolute', zIndex: 5}}>
      <Text style={{fontSize: 36, lineHeight: 49, color: `${colors.black}10`, fontFamily: 'Poppins_900Black'}} numberOfLines={1}>{heading}</Text>
    </View>
    <View style={{position: 'relative', zIndex: 10}}>
      <Text style={{fontSize: 18, lineHeight: 24, color: colors.primary, fontFamily: 'Poppins_600SemiBold', fontWeight: 'bold'}} numberOfLines={1}>{subHeading}</Text>
    </View>
  </View>
);

const HeaderLeft = ({onPress}) => (
  <TouchableOpacity onPress={() => onPress()} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Image source={Left} />
  </TouchableOpacity>
);

const Stack = createStackNavigator();

const headerOptions = (heading, subHeading, lang) => {
  return {
    headerStyle: {elevation: 0, shadowOpacity: 0},
    headerTitle: () => <HeaderTitle heading={language[lang][`${heading}`]} subHeading={language[lang][`${subHeading}`]} />,
    headerLeft: props => <HeaderLeft {...props} />,
    headerRight: props => <View></View>
  }
}

class RegisterStack extends React.Component { 
  state = {lang: null};

  async componentDidMount() {
    let lang = await AsyncStorage.getItem('language');
    this.setState({lang});
  }

  render() { 
    const {route} = this.props;
    const {lang} = this.state;

    if(lang === null)
      return null;

    return (
      <Stack.Navigator initialRouteName={'Register'}>
        <Stack.Screen name='Register' component={Register} options={headerOptions('auth', 'register', lang)} />
        <Stack.Screen name='Parent' component={Parent} options={headerOptions('auth', 'register', lang)} />
        <Stack.Screen name='Physician' component={Physician} options={headerOptions('auth', 'register', lang)} />
        <Stack.Screen name='Waiting' component={Waiting} options={headerOptions('auth', 'register', lang)} />
        <Stack.Screen name='Success' component={Success} options={headerOptions('auth', 'register', lang)} />
        <Stack.Screen name='Failure' component={Failure} options={headerOptions('auth', 'register', lang)} />
      </Stack.Navigator>
    );
  }
}

class AuthStack extends React.Component { 
  state = {lang: null};

  async componentDidMount() {
    let lang = await AsyncStorage.getItem('language');
    this.setState({lang});
  }

  render() { 
    const {route} = this.props;
    const {lang} = this.state;

    if(lang === null)
      return null;

    return (
      <Stack.Navigator initialRouteName={'Auth'}>
        <Stack.Screen name='Auth' component={Auth} initialParams={{rootRoute: route}} options={{headerShown: false}} />
        <Stack.Screen name='Login' component={Login} initialParams={{rootRoute: route}} options={headerOptions('auth', 'login', lang)} />
        <Stack.Screen name='Register' component={RegisterStack} initialParams={{rootRoute: route}} options={{headerShown: false}} />
      </Stack.Navigator>
    );
  }
}

class OnboardingStack extends React.Component { 
  state = {lang: null};

  async componentDidMount() {
    let lang = await AsyncStorage.getItem('language');
    this.setState({lang: lang === null ? 'en' : lang});
  }

  async componentDidUpdate() {
    let lang = await AsyncStorage.getItem('language');
    this.setState({lang: lang === null ? 'en' : lang});
  }

  render() {
    const {route} = this.props;
    const {lang} = this.state;

    if(lang === null)
      return null;

    return (
      <Stack.Navigator initialRouteName={'Lang'}>
        <Stack.Screen name='Lang' component={Lang} initialParams={{rootRoute: route}} options={{headerShown: false}} />
        <Stack.Screen name='Onboarding' component={Onboarding} initialParams={{rootRoute: route}} options={headerOptions('features', 'onboarding', lang)} />
      </Stack.Navigator>
    )
  }
}

class AppStack extends React.Component { 
  state = {lang: null};

  async componentDidMount() {
    let lang = await AsyncStorage.getItem('language');
    this.setState({lang});
  }

  render() { 
    const {route} = this.props;
    const {lang} = this.state;

    if(lang === null)
      return null;

    return (
      <Stack.Navigator initialRouteName={'Questionnaire'}>
        <Stack.Screen name='Questionnaire' component={Questionnaire} initialParams={{rootRoute: route}} options={headerOptions('dashboard', 'questionnaire', lang)} />
      </Stack.Navigator>
    )
  }
}

class Navigation extends React.Component {
  state = {initScreen: 'Onboarding', lang: 'en'};

  setLanguage = lang => {
    this.setState({lang});
  }

  render() {
    const {initScreen, lang} = this.state;

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initScreen}>
          <Stack.Screen name="Onboarding" component={OnboardingStack} initialParams={{lang, setLanguage: this.setLanguage}} options={{headerShown: false}} />
          <Stack.Screen name="Auth" component={AuthStack} initialParams={{lang, setLanguage: this.setLanguage}} options={{headerShown: false}} />
          <Stack.Screen name="App" component={AppStack} initialParams={{lang, setLanguage: this.setLanguage}} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigation;

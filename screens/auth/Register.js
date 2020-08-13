import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, language } from '../../utils/contants';

import Auth3 from '../../assets/images/auth/auth-3.png';

const {width} = Dimensions.get('window');

export default class Register extends React.Component {
  state = {lang: null};

  gotoParent = () => {
    const {navigation} = this.props;
    navigation.navigate('Parent');
  }
  
  gotoPhysician = () => {
    const {navigation} = this.props;
    navigation.navigate('Physician');
  }

  async componentDidMount() {
    let lang = await AsyncStorage.getItem('language');
    this.setState({lang});
  }

  render() {
    const {lang} = this.state;
    if(lang === null)
      return null;
  
    return (
      <View style={[styles.flex, styles.center, styles.container]}>
        <View style={[styles.flex, styles.center]}>
          <Image source={Auth3} />
        </View>
        <View style={{width: width-70}}>
          <View style={[styles.loginText]}>
            <Text style={styles.textStyle}>{language[lang].chooseOne}</Text>
          </View>
          <View style={[styles.center, styles.flexRow, {justifyContent: 'space-between'}]}>
            <TouchableOpacity style={[styles.loginText, styles.loginRight, styles.loginSubmit, styles.flex]} onPress={this.gotoParent}>
              <Text style={[styles.textStyle, styles.loginSubmitText]}>{language[lang].parent}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.loginText, styles.loginLeft, styles.loginSubmit, styles.flex]} onPress={this.gotoPhysician}>
              <Text style={[styles.textStyle, styles.loginSubmitText]}>{language[lang].physician}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 35
  },
  textStyle: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
    fontFamily: 'Poppins_400Regular'
  },
  loginText: {
    marginBottom: 10,
  },
  loginLeft: {
    marginLeft: 5
  },
  loginRight: {
    marginRight: 5
  },
  loginSubmit: {
    backgroundColor: colors.primary,
    padding: 9,
    borderRadius: 5,
  },
  loginSubmitText: {
    fontSize: 18,
    lineHeight: 24,
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold'
  }
});

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Dimensions} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {colors} from '../../utils/contants';
import Auth1 from '../../assets/images/auth/auth-1.png';

const {width} = Dimensions.get('window');

export default class Auth extends React.Component {
  gotoLogin = () => {
    const {navigation} = this.props;
    navigation.navigate('Login');
  }

  gotoRegister = () => {
    const {navigation} = this.props;
    navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={colors.primary} />
        <View style={[styles.authScreen1, styles.centerFlex, styles.justifyBetween]}>
          <View style={[styles.centerFlex, styles.topBar, styles.flex, styles.padding50]}>
            <Image source={Auth1} />
          </View>
          <View style={[styles.centerFlex, styles.justifyBetween, styles.padding50]}>
            <View style={styles.auth}>
              <Text style={styles.authText1}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
            </View>
            <View style={styles.flex}>
              <TouchableOpacity style={[styles.authBtn1, styles.centerFlex]} onPress={this.gotoRegister}>
                <Text style={styles.authText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.authBtn1, styles.centerFlex]} onPress={this.gotoLogin}>
                <Text style={styles.authText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex:{
    flex: 1,
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  topBar: {
    marginTop: 100,
    paddingHorizontal: 20
  },
  justifyBetween: {
    flex: 1,
    justifyContent: 'space-between'
  },
  centerFlex: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row'
  },
  padding50: {
    paddingHorizontal: 50
  },
  authText: {
    color: colors.white,
    fontWeight: "bold",
    letterSpacing: 0.3,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  authText1: {
    fontSize: 24,
    letterSpacing: 0.3,
    lineHeight: 28,
    marginBottom: 25,
    fontFamily: 'Poppins_400Regular',
  },
  authBtn1: {
    width: width - 100,
    marginTop: 5,
    height: 40,
    borderRadius: 5,
    backgroundColor: colors.primary
  },
  auth: {
    marginVertical: 20
  },
  authSkip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: `${colors.primary}70`,
    borderRadius: 5,
  },
  skipX: {
    marginLeft: 4
  },
  skip: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 14,
    fontFamily: 'Poppins_400Regular',
  },
  skipRound: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: `${colors.primary}70`,
    marginRight: 2
  },
  skipRoundActive: {
    backgroundColor: `${colors.primary}`
  }
});
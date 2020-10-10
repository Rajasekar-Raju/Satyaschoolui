import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Dimensions, ScrollView} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {colors, language} from '../../utils/contants';
import Auth1 from '../../assets/images/auth/auth-1.png';
import AsyncStorage from '@react-native-community/async-storage';
import { getUserInfo } from '../../api';

const {width} = Dimensions.get('window');

export default class Auth extends React.Component {
  state = {lang: null};

  gotoLogin = () => {
    const {navigation} = this.props;
    navigation.navigate('Login');
  }

  gotoRegister = () => {
    const {navigation} = this.props;
    navigation.navigate('Register');
  }

  gotoQuestionnaire = () => {
    const {navigation} = this.props;
    navigation.navigate('QuestionnaireVisitor');
  }
  
  async componentDidMount() {
    const {navigation} = this.props;
    let lang = await AsyncStorage.getItem('language');
    let userId = await AsyncStorage.getItem('userId');
    if(userId) {
      let screenToMove = 'Waiting';
      await getUserInfo(userId).then(({userStatusId}) => {
        if(userStatusId === 2) {
          screenToMove = 'Success';
        } else if (userStatusId === 3) {
          screenToMove = 'Failure';
        } else {
          screenToMove = 'Waiting';
        }
        navigation.navigate('Register', {
          screen: screenToMove
        });
      });
    }
    this.setState({lang});
  }

  render() {
    const {lang} = this.state;
    if(!lang)
      return null;

    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        <ScrollView style={styles.flex} contentContainerStyle={[styles.centerFlex, styles.justifyBetween]}>
          <View style={[styles.centerFlex, styles.topBar, styles.padding50, {width: width - 100}]}>
            <Image source={Auth1} resizeMode='contain' />
          </View>
          <View style={[styles.centerFlex, styles.flex, styles.justifyBetween]}>
            <View style={[styles.auth, styles.padding50]}>
              <Text style={styles.authText1}>{language[lang].lorem20}</Text>
            </View>
            <View style={[{flex: 1}, styles.padding50]}>
              <TouchableOpacity style={[styles.authBtn1, styles.centerFlex]} onPress={this.gotoRegister}>
                <Text style={styles.authText}>{language[lang].register}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.authBtn1, styles.centerFlex]} onPress={this.gotoLogin}>
                <Text style={styles.authText}>{language[lang].login}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.authBtn1, styles.centerFlex]} onPress={this.gotoQuestionnaire}>
                <Text style={styles.authText}>{language[lang].visitors}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
    marginBottom: 50
  },
  justifyBetween: {
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
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  authText1: {
    fontSize: 24,
    letterSpacing: 0.3,
    lineHeight: 30,
    marginBottom: 25,
    fontFamily: 'Poppins_400Regular',
  },
  authBtn1: {
    width: width - 100,
    marginTop: 5,
    height: 50,
    borderRadius: 5,
    backgroundColor: colors.primary,
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
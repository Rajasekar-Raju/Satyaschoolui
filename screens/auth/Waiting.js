import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { colors, language } from '../../utils/contants';

import WaitingForConfirmImg from '../../assets/images/auth/auth-4.png';
import { getUserInfo } from '../../api';

const {width} = Dimensions.get('window');

export default class Waiting extends React.Component {
  state = {lang: '', isLoading: false};

  handlePress = async () => {
    const {navigation} = this.props;
    let userId = await AsyncStorage.getItem('userId');
    await getUserInfo(userId).then(({userStatusId}) => {
      if(userStatusId === 2) {
        navigation.navigate('Success');
      } else if (userStatusId === 3) {
        navigation.navigate('Failure');
      } else {
        Alert.alert('Waiting for approval');
      }
    });
  }

  async componentDidMount() {
    const {navigation} = this.props;
    let lang = await AsyncStorage.getItem('language');
    let userId = await AsyncStorage.getItem('userId');
    if(!userId)
      navigation.navigate('Register');
    else {
      await getUserInfo(userId).then(({userStatusId}) => {
        if(userStatusId === 2) {
          navigation.navigate('Success');
        } else if (userStatusId === 3) {
          navigation.navigate('Failure');
        }
      });
    }
    this.setState({lang});
  }

  render() {
    const {lang, isLoading} = this.state;
    
    if(lang === null || language[lang] === undefined)
      return null;
      
    return (
      <View style={styles.container}>
        <View style={styles.flex}>
          <Image style={styles.image} source={WaitingForConfirmImg} />
          <Text style={styles.text}>{language[lang].waitForConfirmation}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.handlePress} disabled={isLoading}>
            <Text style={styles.buttonText}>{language[lang].checkNow}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white},
  text: {fontFamily: 'Poppins_400Regular', fontSize: 18, lineHeight: 24, marginTop: 50, marginBottom: 50},
  flex: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  buttonContainer: {padding: 20},
  button: {backgroundColor: colors.primary, width: width - 40, height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center'},
  buttonText: {color: colors.white, fontSize: 18, fontFamily: 'Poppins_600SemiBold', lineHeight: 24}
});

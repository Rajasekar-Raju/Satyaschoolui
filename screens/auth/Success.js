import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { colors, language } from '../../utils/contants';

import CongratsImg from '../../assets/images/auth/auth-5.png';

const {width} = Dimensions.get('window');

export default class Success extends React.Component {
  state = {lang: '', isLoading: false};

  handlePress = async () => {
    const {navigation} = this.props;
    navigation.navigate('Login');
  }

  async componentDidMount() {
    let lang = await AsyncStorage.getItem('language');
    this.setState({lang});
  }

  render() {
    const {lang, isLoading} = this.state;
    
    if(lang === null || language[lang] === undefined)
      return null;
      
    return (
      <View style={styles.container}>
        <View style={styles.flex}>
          <Image style={styles.image} source={CongratsImg} />
          <Text style={styles.text}>{language[lang].congrats}</Text>
          <Text style={styles.textDesc}>{language[lang].lorem20}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.handlePress} disabled={isLoading}>
            <Text style={styles.buttonText}>{language[lang].goToLogin}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, marginBottom: 50},
  text: {fontFamily: 'Poppins_600SemiBold', color: colors.success, fontSize: 18, lineHeight: 24, marginTop: 50, marginBottom: 20},
  textDesc: {fontFamily: 'Poppins_400Regular', fontSize: 16, lineHeight: 24, textAlign: 'center', paddingHorizontal: 25},
  flex: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  buttonContainer: {padding: 20},
  button: {backgroundColor: colors.primary, width: width - 40, height: 50, borderRadius: 5, justifyContent: 'center', alignItems: 'center'},
  buttonText: {color: colors.white, fontSize: 18, fontFamily: 'Poppins_600SemiBold', lineHeight: 24}
});

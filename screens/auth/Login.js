import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { colors } from '../../utils/contants';

import Auth2 from '../../assets/images/auth/auth-2.png';
import Phone from '../../assets/images/common/phone.png';
import Password from '../../assets/images/common/password.png';
import Input from '../../components/input';

const {width} = Dimensions.get('window');

export default class Login extends React.Component {
  state = {phone: '', password: ''};
  
  handleChange = (name, text) => this.setState({[name]: text});

  render() {
    const {phone, password} = this.state;

    return (
      <View style={[styles.flex, styles.center, styles.container]}>
        <View style={[styles.flex, styles.center]}>
          <Image source={Auth2} />
        </View>
        <View style={{width: width-70}}>
          <View style={[styles.loginText]}>
            <Text style={styles.textStyle}>Login</Text>
          </View>
          <View>
            <View style={styles.loginText}>
              <Input name="phone" placeholder="986543210" type="phone-pad" value={phone} image={Phone} onChange={this.handleChange} editable={true} />
            </View>
            <View style={styles.loginText}>
              <Input name="password" placeholder="◊◊◊◊◊◊◊◊◊" type="default" value={password} image={Password} onChange={this.handleChange} editable={true} />
            </View>
            <TouchableOpacity style={[styles.loginText, styles.loginSubmit]}>
              <Text style={[styles.textStyle, styles.loginSubmitText]}>Login</Text>
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

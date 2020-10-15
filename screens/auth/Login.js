import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { colors, language } from '../../utils/contants';

import Auth2 from '../../assets/images/auth/auth-2.png';
import Email from '../../assets/images/common/mail.png';
import Password from '../../assets/images/common/password.png';
import Input from '../../components/input';
import AsyncStorage from '@react-native-community/async-storage';
import { getUserInfo, loginUser } from '../../api';
import { Formik } from 'formik';
import * as Yup from 'yup';

const {width} = Dimensions.get('window');

export default class Login extends React.Component {
  // state = {email: '', password: '', lang: null, isLoading: false};
  state = {email: 'moaj257@gmail.com', password: '123456', lang: null, isLoading: false};
  
  // handleChange = (name, text) => this.setState({[name]: text});

  async componentDidMount() {
    const {navigation} = this.props;
    let lang = await AsyncStorage.getItem('language');
    let userId = await AsyncStorage.getItem('userId');
    if(userId) {
      navigation.navigate('App');
      // let screenToMove = 'Waiting';
      // await getUserInfo(userId).then(({userStatusId}) => {
      //   if(userStatusId === 2) {
      //     screenToMove = 'Success';
      //   } else if (userStatusId === 3) {
      //     screenToMove = 'Failure';
      //   } else {
      //     screenToMove = 'Waiting';
      //   }
      //   navigation.navigate('Register', {
      //     screen: screenToMove
      //   });
      // });
    }
    this.setState({lang});
  }

  login = async ({email, password}) => {
    const {navigation} = this.props;
    await loginUser({email, password})
            .then(async ({code, data}) => {
              if(parseInt(code) === 200 && data !== null) {
                let dataJson = JSON.parse(data)[0];
                const {UserId, ChildDob, FirstName} = dataJson;
                await AsyncStorage.setItem('userId', UserId.toString());
                await AsyncStorage.setItem('type', 'login');
                await AsyncStorage.setItem('babyDob', ChildDob.toString());
                await AsyncStorage.setItem('userName', FirstName.toString());
                navigation.navigate('App');
                // let screenToMove = 'Waiting';
                // await getUserInfo(UserId).then(({userStatusId}) => {
                //   if(userStatusId === 2) {
                //     screenToMove = 'Success';
                //   } else if (userStatusId === 3) {
                //     screenToMove = 'Failure';
                //   } else {
                //     screenToMove = 'Waiting';
                //   }
                //   navigation.navigate('Register', {
                //     screen: screenToMove
                //   });
                // });
              } else {
                Alert.alert('Error', 'Login failed!');
              }
            });
    // navigation.navigate('App');
  }

  render() {
    const {email, password, lang, isLoading} = this.state;
    
    let loginSchema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    if(lang === null || language[lang] === undefined)
      return null;

    return (
      <View style={[styles.flex, styles.center, styles.container]}>
        <View style={[styles.flex, styles.center]}>
          <Image source={Auth2} />
        </View>
        <View style={{width: width-70}}>
          <View style={[styles.loginText]}>
            <Text style={styles.textStyle}>{language[lang].login}</Text>
          </View>
          <Formik
          initialValues={{...{password, email}}}
          validationSchema={loginSchema}
          onSubmit={values => this.login(values)}
          >
            {({handleBlur, handleChange, handleSubmit, values, errors, touched}) => (
              <View>
                <View style={styles.loginText}>
                  <Input name="email" placeholder="johndoe@gmail.com" type="email" value={values.email} touched={touched.email} error={errors.email} image={Email} onChange={handleChange('email')} onBlur={handleBlur('email')} editable={true} />
                </View>
                <View style={styles.loginText}>
                  <Input name="password" placeholder="◊◊◊◊◊◊◊◊◊" type="default" value={values.password} touched={touched.password} error={errors.password} image={Password} onChange={handleChange('password')} onBlur={handleBlur('password')} editable={true} />
                </View>
                <TouchableOpacity style={[styles.loginText, styles.loginSubmit]} onPress={handleSubmit} disabled={isLoading}>
                  <Text style={[styles.textStyle, styles.loginSubmitText]}>{language[lang].login}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
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

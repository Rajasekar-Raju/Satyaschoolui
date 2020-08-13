import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { language, colors } from '../../utils/contants';
import Input from '../../components/input';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Calendar from '../../assets/images/common/calendar.png';
import MapPin from '../../assets/images/common/map-pin.png';
import Password from '../../assets/images/common/password.png';
import Phone from '../../assets/images/common/phone.png';
import TextImg from '../../assets/images/common/text.png';
import Email from '../../assets/images/common/mail.png';

export default class Physicial extends React.Component {
  state = {lang: null, firstName: null, lastName: null, specializedIn: null, dob: null, phoneNo: null, address: null, password: null, retypePassword: null, email: null};

  handleChange = (name, text) => this.setState({[name]: text});

  async componentDidMount() {
    let lang = await AsyncStorage.getItem('language');
    this.setState({lang});
  }

  render() {
    const {firstName, lastName, specializedIn, phoneNo, address, lang, password, dob, retypePassword, email} = this.state;

    if(lang === null)
      return null;
    
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].firstName}</Text>
            <Input name="firstname" placeholder="" type="default" image={TextImg} value={firstName} onChange={this.handleChange} editable={true} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].lastName}</Text>
            <Input name="lastName" placeholder="" type="default" image={TextImg} value={lastName} onChange={this.handleChange} editable={true} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].specializedIn}</Text>
            <Input name="specializedIn" placeholder="" type="default" image={TextImg} value={specializedIn} onChange={this.handleChange} editable={true} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].dob}</Text>
            <Input name="dob" placeholder="" type="default" image={Calendar} value={dob} onChange={this.handleChange} editable={true} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].email}</Text>
            <Input name="email" placeholder="" type="default" image={Email} value={email} onChange={this.handleChange} editable={true} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].password}</Text>
            <Input name="password" placeholder="◊◊◊◊◊◊◊◊◊" image={Password} type="default" value={password} onChange={this.handleChange} editable={true} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].retypePassword}</Text>
            <Input name="retypePassword" placeholder="◊◊◊◊◊◊◊◊◊" image={Password} type="default" value={retypePassword} onChange={this.handleChange} editable={true} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].phoneNo}</Text>
            <Input name="phoneNo" placeholder="" type="default" image={Phone} value={phoneNo} onChange={this.handleChange} editable={true} />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{language[lang].address}</Text>
            <Input name="address" placeholder="" type="default" image={MapPin} value={address} onChange={this.handleChange} editable={true} />
          </View>
        </ScrollView>
        <TouchableOpacity style={[styles.loginText, styles.loginSubmit]}>
          <Text style={[styles.textStyle, styles.loginSubmitText]}>{language[lang].register}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.white, paddingTop: 10, flex: 1},
  labelText: {fontSize: 14, lineHeight: 19, letterSpacing: -0.3, fontFamily: 'Poppins_400Regular', fontWeight: 'bold', marginBottom: 5},
  itemContainer: {marginBottom: 10, paddingHorizontal: 20,},
  scrollContainer: {flex: 1,},
  loginText: {marginVertical: 10, marginHorizontal: 20,},
  loginSubmit: {backgroundColor: colors.primary, padding: 9, borderRadius: 5,},
  loginSubmitText: {fontSize: 18, lineHeight: 24, color: colors.white, textAlign: 'center', fontFamily: 'Poppins_600SemiBold', fontWeight: 'bold'}
});

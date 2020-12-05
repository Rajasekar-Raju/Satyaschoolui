import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, language } from '../../../utils/contants';
import {name as app_name, version as app_version}  from '../../../package.json';

 const Details = ({heading, value}) => (
  <View style={styles.content}>
    <View >
      <Text style={{fontSize: 18,  color: `${colors.black}`, fontFamily: 'Poppins_400Regular', fontWeight: 'bold'}} numberOfLines={1}>{heading}</Text>
    </View>
    <View >
      <Text style={{fontSize: 18, color: `${colors.black}50`, fontFamily: 'Poppins_400Regular'}} numberOfLines={1}>{value}</Text>
    </View>
  </View>
);

class AboutApp extends React.Component {

  state = {lang: null};

  async componentDidMount() {
    let langID = await AsyncStorage.getItem('language');
    this.setState({lang: langID});
  }
  
  render() {
    const {lang} = this.state;
    if(!lang)
      return null;

    const AppDetail = [{name: language[lang].appVersion, value: `${app_name} ${app_version}`}, 
                       {name: language[lang].os, value: `${Platform.OS} ${Platform.Version}`},
                       {name: language[lang].legal, value: `Copyright 2020 Satya School`},]
    return (
      <View style={styles.container}>        
        {AppDetail.map((item, i) => <Details key={i} heading={item.name} value={item.value}/>)}          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  content: {paddingVertical: 12, paddingHorizontal: 10, borderColor: `${colors.black}10`, borderBottomWidth:1},
});

export default AboutApp;
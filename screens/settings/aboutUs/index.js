import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions,ScrollView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-community/async-storage';
import { colors,language } from '../../../utils/contants';
import AboutPng from '../../../assets/images/settings/about.png';

const {width} = Dimensions.get('window');


class AboutUs extends React.Component {

  state = {lang: null};

  async componentDidMount() {
    let langID = await AsyncStorage.getItem('language');
    this.setState({lang: langID});
  }

  render() {
    const {lang} = this.state;
    if(!lang)
      return null;

    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        <View style={styles.content}>
          {/* <View style={styles.content}> */}
            <Image style={styles.img} source={AboutPng} resizeMode={'contain'} />
          {/* </View> */}
          <ScrollView style={styles.textcontent}>
            <Text style={{fontSize: 18, color: `${colors.black}70`, paddingHorizontal
            :20, fontFamily: 'Poppins_400Regular',textAlign:'justify'}}><Text>             </Text>{language[lang].about}</Text>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  content: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  textcontent: {flex: 1},
  img: {flex: 0, width: width, height:200}
});

export default AboutUs;
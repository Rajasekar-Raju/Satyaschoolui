import React from 'react';
import Swiper from 'react-native-swiper';
// import Swiper from 'react-native-web-swiper';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, language } from '../../utils/contants';
import SlideItem from './SlideItem';
import AsyncStorage from '@react-native-community/async-storage';

export default class Questionnaire extends React.Component{
  state = {lang: null};

  nextSlide = () => {
    this.refs.swiper.scrollBy(1);
  }

  renderSlides() {
    const {lang} = this.state;
    const questions = language[lang].questions;
    return questions.map(({options, question}, i) => (
      <SlideItem key={`slide-${i}`} nextSlide={this.nextSlide} question={question} options={options} count={i + 1} />
    ))
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
      <View style={styles.rootContainer}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        {/* <View style={styles.container}> */}
          {/* <Text style={styles.heading}>Questionnaire</Text> */}
        {/* </View> */}
        <Swiper ref={'swiper'} scrollEnabled={false} showsButtons={false} showsPagination={false} loop={false}>
          {this.renderSlides()}
        </Swiper>
        <View>
          
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rootContainer: {flex: 1, backgroundColor: '#fff', alignItems: 'flex-start', justifyContent: 'center'},
  container: {marginTop: 45, paddingHorizontal: 20},
  heading: {fontSize: 24, fontFamily: 'Poppins_600SemiBold'}
});

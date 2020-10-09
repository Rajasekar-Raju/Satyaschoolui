import React from 'react';
import Swiper from 'react-native-swiper';
// import Swiper from 'react-native-web-swiper';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, language } from '../../utils/contants';
import SlideItem from './SlideItem';
import AsyncStorage from '@react-native-community/async-storage';
import { getAllQuestions } from '../../api';


// const options = [
//   // {name: 'Yes', value: 'yes'},
//   // {name: 'No', value: 'no'},
// ];

export default class Questionnaire extends React.Component{
  state = {lang: null, questions: [], isLoading: true};

  nextSlide = () => {
    this.refs.swiper.scrollBy(1);
  }

  renderSlides() {
    const {questions} = this.state;
    const {route} = this.props;
    const {params} = route;
    const {options} = params;
    // const questions = language[lang].questions;
    return questions.map(({questionDescription}, i) => (
      <SlideItem key={`slide-${i}`} nextSlide={this.nextSlide} question={questionDescription} options={options} count={i + 1} />
    ));
  }

  async componentDidMount() {
    // console.log(this.props);
    let lang = await AsyncStorage.getItem('language');
    await getAllQuestions().then(questions => this.setState({lang, questions, isLoading: false}))
  }

  render() {
    const {lang, questions, isLoading} = this.state;
    const {route} = this.props;
    const {params} = route;
    const {options} = params;

    if(isLoading){
      return (
        <View style={[styles.rootContainer, {alignItems: 'center'}]}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      );
    }

    if(lang === null || language[lang] === undefined || questions.length === 0)
      return null;

    return (
      <View style={styles.rootContainer}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        {/* <View style={styles.container}> */}
          {/* <Text style={styles.heading}>Questionnaire</Text> */}
        {/* </View> */}
        <Swiper ref={'swiper'} scrollEnabled={options.length > 0 ? false : true} showsButtons={false} showsPagination={options.length > 0 ? false : true} loop={false} activeDotColor={colors.primary} dotColor={`${colors.primary}70`}>
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

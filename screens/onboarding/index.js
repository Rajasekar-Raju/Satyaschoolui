import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Swiper from 'react-native-swiper';

import {colors} from '../../utils/contants';
import Slide1 from './Slide1';
import Slide2 from './Slide2';
import Slide3 from './Slide3';

export default class Onboarding extends React.Component {
  nextSlide = () => {
    this.refs.swiper.scrollBy(1);
  }

  gotoAuth = () =>{
    const {navigation} = this.props;
    navigation.navigate('Auth');
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={colors.primary} />
        <Swiper ref={'swiper'} showsButtons={false} showsPagination={false} loop={false}>
          <Slide1 gotoAuth={this.gotoAuth} nextSlide={this.nextSlide} />
          <Slide2 gotoAuth={this.gotoAuth} nextSlide={this.nextSlide} />
          <Slide3 gotoAuth={this.gotoAuth} nextSlide={this.nextSlide} />
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Dimensions, ScrollView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../utils/contants';

import VisitorPng from '../../assets/images/visitor/visitor-1.png';

const {width} = Dimensions.get('window');

const Btn = ({text, handleClick}) => (
  <TouchableOpacity onPress={handleClick} style={styles.btn}>
    <Text style={styles.btnText}>{text}</Text>
  </TouchableOpacity>
)

class Visitor extends React.Component {
  btnClick = mileStonesId => {
    const {navigation} = this.props;
    navigation.navigate('QuestionnaireVsitor', {
      mileStonesId, isMileStone: 1, options: []
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        <View style={styles.content}>
          <View style={styles.content}>
            <Image style={styles.img} source={VisitorPng} resizeMode={'cover'} />
          </View>
          <View style={styles.content}>
            <Btn text={'0 to 2'} handleClick={() => this.btnClick(1)} />
            <Btn text={'2 to 4'} handleClick={() => this.btnClick(2)} />
            <Btn text={'4 & above'} handleClick={() => this.btnClick(3)} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  content: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  img: {flex: 1, width: width},
  btn: {backgroundColor: colors.primary, width: width - 80, paddingVertical: 10, borderRadius: 5, marginVertical: 5, justifyContent: 'center', alignItems: 'center'},
  btnText: {fontSize: 18, lineHeight: 24, color: colors.white, textAlign: 'center', fontFamily: 'Poppins_600SemiBold', fontWeight: 'bold'}
});

export default Visitor;
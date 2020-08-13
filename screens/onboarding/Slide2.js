import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

import {colors, language} from '../../utils/contants';
import Oboarding2 from '../../assets/images/onboarding/oboarding-2.png';
import Right from '../../assets/images/common/right.png';
import SmallX from '../../assets/images/common/x-small.png';

export default class Slide1 extends React.Component {
  render() {
    const {nextSlide, gotoAuth, lang} = this.props;

    return (
      <View style={[styles.onboardingScreen1, styles.centerFlex, styles.justifyBetween]}>
        <View style={[styles.centerFlex, styles.justifyBetween]}>
          <View style={[styles.justifyBetween, styles.flexRow, styles.topBar]}>
            <View style={[styles.flex, styles.flexRow]}>
              <View style={[styles.skipRound]} />
              <View style={[styles.skipRound, styles.skipRoundActive]}/>
              <View style={styles.skipRound}/>
            </View>
            <View>
              <TouchableOpacity style={[styles.onboardingSkip, styles.centerFlex, styles.flexRow, {height: 30}]} onPress={gotoAuth}>
                <View>
                  <Text style={styles.skip}>{language[lang].skip}</Text>
                </View>
                <View style={styles.skipX}>
                  <Image source={SmallX} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.padding50, styles.paddingV40]}>
            <Text style={styles.onboardingText1}>{language[lang].lorem20}</Text>
          </View>
        </View>
        <View style={[styles.justifyBetween, styles.centerFlex, styles.padding50]}>
          <View style={styles.onboarding2}>
            <Image source={Oboarding2} />
          </View>
          <View>
            <TouchableOpacity style={[styles.onboardingBtn1, styles.centerFlex]} onPress={nextSlide}>
              <Image source={Right} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flex:{
    flex: 1,
  },
  topBar: {
    marginTop: 50,
    paddingHorizontal: 20
  },
  justifyBetween: {
    flex: 1,
    justifyContent: 'space-between'
  },
  centerFlex: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row'
  },
  padding50: {
    padding: 50
  },
  paddingV40: {
    paddingVertical: 40
  },
  onboardingText1: {
    letterSpacing: 0.3,
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 25,
    fontFamily: 'Poppins_400Regular',
  },
  onboardingBtn1: {
    borderRadius: 50,
    height: 50,
    width: 50,
    backgroundColor: colors.primary
  },
  onboarding2: {
    marginBottom: 25
  },
  onboardingSkip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: `${colors.primary}70`,
    borderRadius: 5,
  },
  skipX: {
    marginLeft: 4
  },
  skip: {
    color: colors.white,
    letterSpacing: 0.3,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Poppins_400Regular',
  },
  skipRound: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: `${colors.primary}70`,
    marginRight: 2
  },
  skipRoundActive: {
    backgroundColor: `${colors.primary}`
  }
});
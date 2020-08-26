import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { colors } from '../../utils/contants';
import Notifications from '../../components/Notifications';

const answered = 8;
const total = 12;
const average = Math.round((answered/total) * 100);

const notifications = [
  {name: 'Notification 1', desc: 'Notification 1 Description'},
  {name: 'Notification 2', desc: 'Notification 2 Description'},
  {name: 'Notification 3', desc: 'Notification 3 Description'},
];

export default class Home extends React.Component{
  state = {lang: null};

  renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerInnerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.rowFlex}>
            <Text numberOfLines={1} style={styles.headerRowTitle}>Hello, Sathya</Text>
            <Text numberOfLines={2} style={styles.headerRowDesc}>Let's make this simple.</Text>
          </View>
          <Image source={require('../../assets/images/chats/user.png')} style={styles.profileImg} />
        </View>
        <View style={styles.headerCard}>
          <View style={styles.headerCardLeft}>
            <AnimatedCircularProgress size={75} width={15} fill={average} tintColor={colors.white} onAnimationComplete={() => console.log('onAnimationComplete')} backgroundColor={`${colors.white}50`}>
              {fill => <Text style={styles.headerCardLeftText}>{answered}/{total}</Text>}
            </AnimatedCircularProgress>
            {/* <Text style={styles.headerCardLeftText}>{answered}/{total}</Text> */}
          </View>
          <View style={styles.headerCardRight}>
            <Text style={styles.headerCardRightText}>You have answered {answered} out of {total} questions.</Text>
          </View>
        </View>
      </View>
    </View>
  )

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
        {this.renderHeader()}
        <ScrollView style={styles.scrollview}>
          <Notifications {...{notifications, heading: 1, lang}} />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  scrollview: {flex: 1},
  headerContainer: {height: 200 + 80},
  headerInnerContainer: {paddingHorizontal: 20, paddingBottom: 25, paddingTop: 50, backgroundColor: colors.primary, borderBottomLeftRadius: 25, height: 200 + 25},
  profileImg: {backgroundColor: colors.white, borderRadius: 50, height: 50, width: 50},
  headerRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  headerRowTitle: {color: `${colors.black}50`, fontFamily: 'Poppins_600SemiBold', fontSize: 24, lineHeight: 28},
  headerRowDesc: {fontFamily: 'Poppins_800ExtraBold', fontSize: 32, lineHeight: 49},
  rowFlex: {flex: 1},
  headerCard: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: `${colors.black}`, padding: 10, borderRadius: 10},
  headerCardLeft: {position: 'relative'},
  headerCardLeftText: {fontFamily: 'Poppins_600SemiBold', fontSize: 18, lineHeight: 24, color: colors.white, marginTop: 3},
  headerCardRightText: {fontFamily: 'Poppins_600SemiBold', fontSize: 18, lineHeight: 24, color: colors.white},
  headerCardRight: {flex: 1, marginLeft: 10},
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { colors } from '../../utils/contants';
import Notifications from '../../components/Notifications';
import { getUserAnswers } from '../../api';

// const answered = 8;
// const total = 12;
// const average = Math.round((answered/total) * 100);

const notifications = [
  {name: 'Notification 1', desc: 'Notification 1 Description'},
  {name: 'Notification 2', desc: 'Notification 2 Description'},
  {name: 'Notification 3', desc: 'Notification 3 Description'},
];

export default class Home extends React.Component{
  state = {lang: null, userName: null, total: 0, average: 0, answered: 0};

  renderHeader = (userName, average, total, answered) => (
    <View style={styles.headerContainer}>
      <View style={styles.headerInnerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.rowFlex}>
            <Text numberOfLines={1} style={styles.headerRowTitle}>Hello, {userName}</Text>
            <Text numberOfLines={2} style={styles.headerRowDesc}>Let's make this simple.</Text>
          </View>
          <Image source={require('../../assets/images/chats/user.png')} style={styles.profileImg} />
        </View>
        <View style={styles.headerCard}>
          <View style={styles.headerCardLeft}>
            <AnimatedCircularProgress size={75} width={15} fill={average} tintColor={colors.white} onAnimationComplete={() => console.log('onAnimationComplete')} backgroundColor={`${colors.white}50`}>
              {fill => <Text style={styles.headerCardLeftText}>{answered.length}/{total.length}</Text>}
            </AnimatedCircularProgress>
          </View>
          <View style={styles.headerCardRight}>
            <Text style={styles.headerCardRightText}>You have {answered.length} risks out of {total.length} questions.</Text>
          </View>
        </View>
      </View>
    </View>
  );

  updateRiskCircle = async () => {
    let userId = await AsyncStorage.getItem('userId');
    await getUserAnswers(userId)
                .then(({data}) => {
                  let total = JSON.parse(data);
                  let answered = total.filter(data => data.AnsDescription === 'yes');
                  let average = Math.round((answered.length/total.length) * 100);
                  this.setState({total, answered, average});
                });
  }

  async componentDidMount() {
    let langID = await AsyncStorage.getItem('language');
    let userName = await AsyncStorage.getItem('userName');
    await this.updateRiskCircle();
    this.setState({lang: langID, userName});
  }

  async componentDidUpdate() {
    await this.updateRiskCircle();
  }

  render() {
    const {lang, userName, average, total, answered} = this.state;
    if(!lang)
      return null;

    return (
      <View style={styles.container}>
        {this.renderHeader(userName, average, total, answered)}
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

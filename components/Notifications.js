import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, language } from '../utils/contants';
import NotificationItem from './NotificationItem';

const Notifications = ({notifications, heading, lang}) => (
  <View style={styles.segment}>
    {heading === 1 && (
      <Text style={styles.title}>{language[lang].upcomingNotifications}</Text>
    )}
    <View style={styles.segmentContainer}>
    {notifications.length === 0 && (
      <View style={styles.emptyImgContainer}>
        <Image source={require('../assets/images/common/empty.png')} style={styles.emptyImg} />
        <Text style={styles.emptyImgText}>{language[lang].noNotificaionsAvailable}</Text>
    </View>
    )}
    {notifications.map((notification, i) => <NotificationItem key={`notitification-item-${i}`} {...{notification}} /> )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  title: {fontFamily: 'Poppins_800ExtraBold', fontSize: 24, lineHeight: 32},
  segment: {paddingHorizontal: 20, paddingVertical: 15},
  segmentContainer: {marginVertical: 5},
  emptyImg: {height: 220, width: 250, marginBottom: 5},
  emptyImgContainer: {marginVertical: 10, justifyContent: 'center', alignItems: 'center'},
  emptyImgText: {color: `${colors.black}50`, fontFamily: 'Poppins_600SemiBold', fontSize: 16, lineHeight: 28, textAlign: 'center'}
});

export default Notifications;
import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../utils/contants";

const NotificationItem = ({notification}) => (
  <View style={styles.notificationItem}>
    <Feather name="bell" size={48} color={colors.black} />
    <View style={styles.notificationItemRight}>
      <Text style={styles.notificationItemTitle}>{notification.name}</Text>
      <Text style={styles.notificationItemDesc}>{notification.desc}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  notificationItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 5, borderWidth: 1, borderColor: `${colors.black}10`, padding: 10, borderRadius: 10, backgroundColor: `${colors.black}05`},
  notificationItemRight: {flex: 1, marginLeft: 5},
  notificationItemTitle: {fontFamily: 'Poppins_600SemiBold', fontSize: 22, lineHeight: 28},
  notificationItemDesc: {color: `${colors.black}50`, fontFamily: 'Poppins_600SemiBold', fontSize: 14, lineHeight: 16, marginTop: 8},
});

export default NotificationItem;
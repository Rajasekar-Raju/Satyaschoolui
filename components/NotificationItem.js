import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { List } from "react-native-paper";
import Lightbox from "react-native-lightbox";
import { colors } from "../utils/contants";
var moment = require("moment");

const NotificationItem = ({ notification, id, click }) => (
  <TouchableOpacity onPress={() => click(id)}>
    <View style={styles.notification}>
      <View style={styles.notificationItem}>
        <Feather name="bell" size={48} color={colors.black} />
        <View style={styles.notificationItemRight}>
          <Text style={styles.notificationItemTitle}>{notification.Title}</Text>
          <Text style={styles.notificationItemDesc}>
            {moment(
              moment(notification.Date).format("L").toString() +
                " " +
                notification.Time
            ).format("lll")}
          </Text>
        </View>
      </View>
      {notification.show && (
        <View>
          <List.Item
            titleStyle={{
              color: `${colors.black}90`,
              fontWeight: "bold",
            }}
            titleNumberOfLines={7}
            title={notification.EventAddress}
            left={() => (
              <List.Icon
                color={`${colors.black}90`}
                style={{
                  fontWeight: "bold",
                }}
                icon="map-marker"
              />
            )}
          />
          {notification.Image !== null && notification.Image !== "" && (
            <Lightbox>
              <Image
                source={{ uri: notification.Image }}
                style={styles.notificationImg}
              />
            </Lightbox>
          )}
          <Text style={styles.notificationDesc}>
            {notification.Description}
          </Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  notification: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: `${colors.black}10`,
    padding: 10,
    borderRadius: 10,
    backgroundColor: `${colors.black}05`,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginVertical: 5,
  },
  notificationItemRight: { flex: 1, marginLeft: 5 },
  notificationItemTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    lineHeight: 28,
  },
  notificationItemDesc: {
    color: `${colors.black}90`,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    lineHeight: 16,
    marginTop: 8,
  },
  notificationDesc: {
    color: `${colors.black}90`,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    marginTop: 8,
    textAlign: "justify",
  },
  notificationImg: {
    backgroundColor: colors.white,
    height: 200,
  },
});

export default NotificationItem;

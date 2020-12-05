import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { colors, language } from "../utils/contants";
import NotificationItem from "./NotificationItem";
import { getUserPosts } from "../api";
var moment = require("moment");

const Notifications = ({ heading, lang }) => {
  const [notifications, setnotifications] = useState([]);
  const [loading, setloading] = useState(true);

  const getNotifications = async () => {
    let userId = await AsyncStorage.getItem("userId");
    await getUserPosts(userId).then((data) => {
      let filteredData = [];
      if (data.code === "200") {
        if (heading) {
          filteredData = JSON.parse(data.data).filter((item) =>
            moment(moment().startOf("date")).isSameOrBefore(item.Date)
          );
        } else {
          filteredData = JSON.parse(data.data).filter((item) =>
            moment(item.Date).isBefore(moment().startOf("date"))
          );
        }
      }
      // console.log(filteredData);
      setnotifications(
        filteredData.map((item) => {
          return { ...item, show: false };
        })
      );
      setloading(false);
    });
  };

  useEffect(() => {
    getNotifications();
    return () => {};
  }, []);

  const onClick = (id) => {
    const data = notifications;
    setnotifications(
      data.map((item, i) => {
        if (i === id) {
          return { ...item, show: !item.show };
        }
        return item;
      })
    );
  };

  return (
    <View style={styles.segment}>
      {heading && (
        <Text style={styles.title}>{language[lang].upcomingNotifications}</Text>
      )}
      {loading ? (
        <View style={{ alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.segmentContainer}>
          {notifications.length === 0 && (
            <View style={styles.emptyImgContainer}>
              <Image
                source={require("../assets/images/common/empty.png")}
                style={styles.emptyImg}
              />
              <Text style={styles.emptyImgText}>
                {language[lang].noNotificaionsAvailable}
              </Text>
            </View>
          )}
          {notifications.map((notification, i) => (
            <NotificationItem
              key={`notitification-item-${i}`}
              {...{ notification, id: i, click: onClick }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontFamily: "Poppins_800ExtraBold", fontSize: 24, lineHeight: 32 },
  segment: { paddingHorizontal: 20, paddingVertical: 15 },
  segmentContainer: { marginVertical: 5 },
  emptyImg: { height: 220, width: 250, marginBottom: 5 },
  emptyImgContainer: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImgText: {
    color: `${colors.black}50`,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    lineHeight: 28,
    textAlign: "center",
  },
});

export default Notifications;

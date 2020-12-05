import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-community/async-storage";
import { Avatar, Card, Title, Paragraph, Subheading } from "react-native-paper";
import { colors } from "../../../utils/contants";
import CompletedPng from "../../../assets/images/settings/completed.png";
import ScheduledPng from "../../../assets/images/settings/sheduled.png";
import PersonPng from "../../../assets/images/common/person.png";
import AppointmentPng from "../../../assets/images/common/noappointment.png";
import { getSchedules } from "../../../api";
var moment = require("moment");

const { width } = Dimensions.get("window");

const Cards = ({ item }) => (
  <Card elevation={6} style={styles.card}>
    {/* <Card.Title
      title={item.PhysicianName}
      subtitle={
        <Text>
          <Text style={styles.dot}> {"\u2B24"} </Text>
          {item.Specialization}
        </Text>
      }
      left={() => (
        <Avatar.Image
          source={
            item.PhysicianImg
              ? item.PhysicianImg === ""
                ? PersonPng
                : { uri: item.PhysicianImg }
              : PersonPng
          }
          size={50}
        />
      )}
    /> */}
    <Card.Content style={styles.cardContent}>
      <Image
        style={styles.image}
        source={
          item.ScheduleStatus === "Scheduled" ? ScheduledPng : CompletedPng
        }
      />
      <Card.Content>
        <Title>
          {item.ScheduleDatetime
            ? item.ScheduleDatetime.toString() === ""
              ? ""
              : moment(
                  item.ScheduleDatetime.toString(),
                  "MM-DD-YYYY h:mm:ss A"
                ).format("ll")
            : ""}
        </Title>
        <Paragraph>
          {item.ScheduleDatetime
            ? item.ScheduleDatetime.toString() === ""
              ? ""
              : `${moment(
                  item.ScheduleDatetime.toString(),
                  "MM-DD-YYYY h:mm:ss A"
                ).format("LT")} - ${moment(
                  item.ScheduleDatetime.toString(),
                  "MM-DD-YYYY h:mm:ss A"
                )
                  .add(1, "hours")
                  .format("LT")}`
            : ""}
        </Paragraph>
      </Card.Content>
    </Card.Content>
    <View style={styles.content}>
      <Subheading>{item.ScheduleDesc}</Subheading>
    </View>
  </Card>
);

class Appointments extends React.Component {
  state = { lang: null, appointments: [], isLoading: true };

  async componentDidMount() {
    let langID = await AsyncStorage.getItem("language");
    let userId = await AsyncStorage.getItem("userId");
    this.setState({ lang: langID });
    await getSchedules(userId).then((data) => {
      let dateSort = [];
      if (data.code === "200") {
        let adata = JSON.parse(data.data)
          .sort((a, b) => a.ScheduleStatus.localeCompare(b.ScheduleStatus))
          .reverse();
        dateSort = adata.sort((a, b) => {
          if (a.ScheduleStatus !== b.ScheduleStatus) {
            return a.ScheduleStatus;
          } else {
            if (a.ScheduleStatus === "Scheduled") {
              return (
                new Date(
                  moment(a.ScheduleDatetime.toString(), "MM-DD-YYYY h:mm:ss A")
                ) -
                new Date(
                  moment(b.ScheduleDatetime.toString(), "MM-DD-YYYY h:mm:ss A")
                )
              );
            } else {
              return (
                new Date(
                  moment(b.ScheduleDatetime.toString(), "MM-DD-YYYY h:mm:ss A")
                ) -
                new Date(
                  moment(a.ScheduleDatetime.toString(), "MM-DD-YYYY h:mm:ss A")
                )
              );
            }
          }
        });
      }
      this.setState({ lang: langID, appointments: dateSort, isLoading: false });
    });
  }

  render() {
    const { lang, isLoading, appointments } = this.state;

    if (isLoading) {
      return (
        <View style={[styles.rootContainer, { alignItems: "center" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!lang) return null;

    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        <ScrollView style={styles.content}>
          {appointments.length > 0 ? (
            appointments.map((item, i) => <Cards key={i} item={item} />)
          ) : (
            <Image
              style={styles.img}
              source={AppointmentPng}
              resizeMode={"contain"}
            />
          )}
          <View style={styles.bottomContent}></View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  bottomContent: { marginBottom: 20 },
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, padding: 10 },
  card: { margin: 10 },
  image: { width: 70, height: 60 },
  img: { flex: 1, width: width },
  dot: { color: "#00a3da" },
  cardContent: { flex: 1, flexDirection: "row" },
});

export default Appointments;

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { colors } from "../../utils/contants";
import Notifications from "../../components/Notifications";
import AsyncStorage from "@react-native-community/async-storage";

const notifications = [
  { name: "Notification 1", desc: "Notification 1 Description" },
  { name: "Notification 2", desc: "Notification 2 Description" },
  { name: "Notification 3", desc: "Notification 3 Description" },
];

export default class History extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let langID = await AsyncStorage.getItem("language");
    this.setState({ lang: langID });
  }

  render() {
    const { lang } = this.state;
    if (!lang) return null;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollview}>
          <Notifications {...{ heading: false, lang }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollview: { flex: 1 },
});

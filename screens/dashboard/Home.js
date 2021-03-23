import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { colors, language } from "../../utils/contants";
import Notification from "../../components/Notifications";
import PersonPng from "../../assets/images/common/person.png";
import { getUserAnswers, getToken } from "../../api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: null,
      userName: null,
      image: null,
      total: 0,
      average: 0,
      answered: 0,
      notification: false,
    };
    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();
    // This listener is fired whenever a notification is received while the app is foregrounded
    this.notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        this.setState({
          notification,
        });
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    this.responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (
          response.notification.request.content.data &&
          response.notification.request.content.data.page === "appointment"
        ) {
          const { navigation } = this.props;
          navigation.navigate("appointments");
        } else if (
          response.notification.request.content.data &&
          response.notification.request.content.data.page === "chat"
        ) {
          const { navigation } = this.props;
          navigation.navigate("Chat");
        }
      }
    );
  }

  async componentWillUnmount() {
    Notifications.removeNotificationSubscription(this.notificationListener);
    Notifications.removeNotificationSubscription(this.responseListener);
  }

  registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted" || Platform.OS === "android") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  getScore = () => {
    const { lang, total, answered } = this.state;
    if (lang === "ta") {
      return `${total.length} கேள்விகளில் ${answered.length} அபாயங்கள் உள்ளன.`;
    }
    return `You have ${answered.length} risks out of ${total.length} questions.`;
  };

  renderHeader = (userName, average, total, answered) => (
    <View style={styles.headerContainer}>
      <View style={styles.headerInnerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.rowFlex}>
            <Text numberOfLines={1} style={styles.headerRowTitle}>
              {`${language[this.state.lang].hello}, ${userName}`}
            </Text>
            <Text numberOfLines={2} style={styles.headerRowDesc}>
              {language[this.state.lang].lets}
            </Text>
          </View>
          <Image
            source={
              this.state.image !== null
                ? this.state.image !== ""
                  ? { uri: this.state.image }
                  : this.state.image === this.getProfile()
                  ? { uri: this.state.image }
                  : PersonPng
                : PersonPng
            }
            style={styles.profileImg}
          />
        </View>
        <View style={styles.headerCard}>
          <View style={styles.headerCardLeft}>
            <AnimatedCircularProgress
              size={75}
              width={15}
              fill={average}
              tintColor={colors.white}
              onAnimationComplete={() => console.log("onAnimationComplete")}
              backgroundColor={`${colors.white}50`}
            >
              {(fill) => (
                <Text style={styles.headerCardLeftText}>
                  {answered.length}/{total.length}
                </Text>
              )}
            </AnimatedCircularProgress>
          </View>
          <View style={styles.headerCardRight}>
            <Text style={styles.headerCardRightText}>{this.getScore()}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  updateRiskCircle = async () => {
    let userId = await AsyncStorage.getItem("userId");
    await getUserAnswers(userId).then(({ data }) => {
      let total = JSON.parse(data);
      let answered = total.filter((data) => data.AnsDescription !== "yes");
      let average = Math.round((answered.length / total.length) * 100);
      this.setState({ total, answered, average });
    });
  };

  async componentDidMount() {
    let langID = await AsyncStorage.getItem("language");
    let userName = await AsyncStorage.getItem("userName");
    let userId = await AsyncStorage.getItem("userId");
    let pushToken = await AsyncStorage.getItem("pushToken");
    if (pushToken === "" || pushToken === null) {
      this.registerForPushNotificationsAsync().then(async (token) => {
        await AsyncStorage.setItem("pushToken", token);
        let usertoken = { UserId: parseInt(userId), Token: token };
        await getToken(usertoken).then((data) => data);
      });
    }

    await this.updateRiskCircle();
    this.setState({ lang: langID, userName });
  }

  getProfile = async () => {
    let profile = await AsyncStorage.getItem("profile");
    let { image } = this.state;
    if (image !== profile) {
      this.setState({ image: profile });
    }
    if (profile !== null && profile !== "") {
      return profile;
    } else return image;
  };

  async componentDidUpdate() {
    await this.updateRiskCircle();
    await this.getProfile();
  }

  render() {
    const { lang, userName, average, total, answered } = this.state;
    if (!lang) return null;

    return (
      <View style={styles.container}>
        {this.renderHeader(userName, average, total, answered)}
        <ScrollView style={styles.scrollview}>
          <Notification {...{ heading: true, lang }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollview: { flex: 1 },
  headerContainer: { height: 200 + 80 },
  headerInnerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 50,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 25,
    height: 200 + 25,
  },
  profileImg: {
    backgroundColor: colors.white,
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerRowTitle: {
    color: `${colors.black}50`,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    lineHeight: 30,
  },
  headerRowDesc: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 32,
    lineHeight: 49,
  },
  rowFlex: { flex: 1 },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: `${colors.black}`,
    padding: 10,
    borderRadius: 10,
  },
  headerCardLeft: { position: "relative" },
  headerCardLeftText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    lineHeight: 24,
    color: colors.white,
    marginTop: 3,
  },
  headerCardRightText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    lineHeight: 24,
    color: colors.white,
  },
  headerCardRight: { flex: 1, marginLeft: 10 },
});

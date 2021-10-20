import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import { colors, language } from "../../utils/contants";
import { Feather } from "@expo/vector-icons";
import { deleteToken } from "../../api";

const LinkItem = ({ item, isFirst }) => (
  <TouchableOpacity
    style={[styles.itemContainer, isFirst ? styles.itemContainerFirst : {}]}
    onPress={item.click}
  >
    <Feather name={item.icon} color={`${colors.black}50`} size={24} />
    <Text style={styles.itemText}>{item.name}</Text>
  </TouchableOpacity>
);

export default class Settings extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let langID = await AsyncStorage.getItem("language");
    this.setState({ lang: langID });
  }

  navigateTopage = (page) => {
    const { navigation } = this.props;
    navigation.navigate("Onboarding", page);
  };

  logout = async (page) => {
    let token = await AsyncStorage.getItem("pushToken");
    await deleteToken(token);
    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("isAdmin");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("profile");
    await AsyncStorage.removeItem("babyDob");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("isAnswered");
    await AsyncStorage.removeItem("pushToken");
    const { navigation } = this.props;
    navigation.dispatch(StackActions.replace("Auth"));
  };

  navigateToSettingPage = async (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  render() {
    const { lang } = this.state;
    if (!lang) return null;

    const profileItems = [
      {
        name: language[lang].account,
        icon: "user",
        click: () => this.navigateToSettingPage("account"),
      },
      {
        name: language[lang].appointments,
        icon: "smile",
        click: () => this.navigateToSettingPage("appointments"),
      },
      {
        name: language[lang].logout,
        icon: "log-out",
        click: () => this.logout("Auth"),
      },
    ];

    const companyItems = [
      {
        name: language[lang].aboutUs,
        icon: "alert-circle",
        click: () => this.navigateToSettingPage("aboutUs"),
      },
      {
        name: language[lang].termsConditions,
        icon: "book",
        click: () => this.navigateToSettingPage("termsConditions"),
      },
      {
        name: language[lang].privacyPolicies,
        icon: "bookmark",
        click: () => this.navigateToSettingPage("privacyPolicies"),
      },
    ];

    const appItems = [
      {
        name: language[lang].language,
        icon: "star",
        click: () => this.navigateTopage("Lang"),
      },
      {
        name: language[lang].aboutApp,
        icon: "gitlab",
        click: () => this.navigateToSettingPage("AboutApp"),
      },
    ];

    return (
      <ScrollView style={styles.container}>
        <View style={styles.segment}>
          <Text style={styles.segmentTitle}>{language[lang].profile}</Text>
          <View style={styles.segmentContent}>
            {profileItems.map((profileItem, i) => (
              <LinkItem
                key={`profile-item-${i}`}
                {...{ item: profileItem, isFirst: i === 0 }}
              />
            ))}
          </View>
        </View>
        <View style={styles.segment}>
          <Text style={styles.segmentTitle}>{language[lang].company}</Text>
          <View style={styles.segmentContent}>
            {companyItems.map((companyItem, i) => (
              <LinkItem
                key={`company-item-${i}`}
                {...{ item: companyItem, isFirst: i === 0 }}
              />
            ))}
          </View>
        </View>
        <View style={styles.segment}>
          <Text style={styles.segmentTitle}>{language[lang].app}</Text>
          <View style={styles.segmentContent}>
            {appItems.map((appItem, i) => (
              <LinkItem
                key={`app-item-${i}`}
                {...{ item: appItem, isFirst: i === 0 }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 },
  segment: { marginVertical: 15 },
  segmentTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    marginBottom: 2.5,
  },
  segmentContent: {},
  itemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: `${colors.black}25`,
  },
  itemContainerFirst: { borderTopWidth: 1 },
  itemText: {
    color: `${colors.black}50`,
    marginLeft: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
  },
});

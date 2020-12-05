import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { StackActions } from "@react-navigation/native";
import { colors } from "../../utils/contants";
import AsyncStorage from "@react-native-community/async-storage";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default class Lang extends Component {
  handleClick = async (langID, setLanguage) => {
    const { navigation } = this.props;
    let isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    await setLanguage(langID);
    if (isLoggedIn !== "1") {
      navigation.dispatch(StackActions.replace("Onboarding"));
    } else {
      navigation.navigate("App", "Settings");
    }
  };

  render() {
    const { route } = this.props;
    const { rootRoute } = route.params;
    const { params } = rootRoute;
    const { setLanguage } = params;

    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        <Text style={styles.headingText}>Choose a language</Text>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => this.handleClick("ta", setLanguage)}
        >
          <Text style={styles.optionText}>தமிழ்</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => this.handleClick("en", setLanguage)}
        >
          <Text style={styles.optionText}>English</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 40,
    backgroundColor: colors.white,
  },
  headingText: {
    fontSize: 24,
    letterSpacing: 0.3,
    lineHeight: 28,
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },
  optionContainer: {
    width: width - 80,
    backgroundColor: colors.primary,
    marginTop: 5,
    paddingVertical: 10,
    borderRadius: 5,
  },
  optionText: {
    color: colors.white,
    letterSpacing: 0.3,
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontWeight: "bold",
  },
});

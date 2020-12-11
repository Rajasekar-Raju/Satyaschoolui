import React from "react";
import { StyleSheet, View } from "react-native";
import { StackActions } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import Swiper from "react-native-swiper";

import { colors } from "../../utils/contants";
import Slide1 from "./Slide1";
import Slide2 from "./Slide2";
import Slide3 from "./Slide3";
import AsyncStorage from "@react-native-community/async-storage";
import { getUserInfo } from "../../api";

export default class Onboarding extends React.Component {
  state = { lang: null };

  nextSlide = () => {
    this.refs.swiper.scrollBy(1);
  };

  gotoAuth = async () => {
    const { navigation } = this.props;
    let userId = await AsyncStorage.getItem("userId");
    if (!userId) navigation.dispatch(StackActions.replace("Auth"));
    else {
      navigation.dispatch(StackActions.replace("App"));
      // let screenToMove = 'Waiting';
      // await getUserInfo(userId).then(({userStatusId}) => {
      //   if(userStatusId === 2) {
      //     screenToMove = 'Success';
      //   } else if (userStatusId === 3) {
      //     screenToMove = 'Failure';
      //   } else {
      //     screenToMove = 'Waiting';
      //   }
      //   navigation.navigate('Auth', {
      //     screen: 'Register',
      //     params: {
      //       screen: screenToMove
      //     }
      //   });
      // });
    }
  };

  async componentDidMount() {
    let langID = await AsyncStorage.getItem("language");
    this.setState({ lang: langID });
  }

  render() {
    const { lang } = this.state;
    if (!lang) return null;

    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        <Swiper
          ref={"swiper"}
          showsButtons={false}
          showsPagination={false}
          loop={false}
        >
          <Slide1
            gotoAuth={this.gotoAuth}
            lang={lang}
            nextSlide={this.nextSlide}
          />
          <Slide2
            gotoAuth={this.gotoAuth}
            lang={lang}
            nextSlide={this.nextSlide}
          />
          <Slide3
            gotoAuth={this.gotoAuth}
            lang={lang}
            nextSlide={this.nextSlide}
          />
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

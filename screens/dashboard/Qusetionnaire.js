import React from "react";
import Swiper from "react-native-swiper";
// import Swiper from 'react-native-web-swiper';
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, language } from "../../utils/contants";
import SlideItem from "./SlideItem";
import AsyncStorage from "@react-native-community/async-storage";
import { getAllQuestions, getMileStoneQuestions } from "../../api";
import { toDays } from "../../utils/functions";

// const options = [
//   // {name: 'Yes', value: 'yes'},
//   // {name: 'No', value: 'no'},
// ];

export default class Questionnaire extends React.Component {
  state = {
    lang: null,
    questions: [],
    isLoading: true,
    isQuestionsAnwered: false,
  };

  nextSlide = () => {
    this.refs.swiper.scrollBy(1);
  };

  firstSlide = () => {
    this.refs.swiper.scrollTo(0);
  };

  renderSlides() {
    const { questions } = this.state;
    const { route, navigation } = this.props;
    const { params } = route;
    const { options, isMileStone, home = false } = params;
    return questions.map(({ QuestionEn, QuestionTl, QuestionId }, i) => (
      <SlideItem
        key={`slide-${i}`}
        nextSlide={this.nextSlide}
        firstSlide={this.firstSlide}
        question={this.state.lang === "ta" ? QuestionTl : QuestionEn}
        home={home}
        isLast={questions.length - 1 === i && isMileStone}
        questionId={QuestionId}
        options={options}
        count={i + 1}
        navigation={navigation}
      />
    ));
  }

  async componentDidMount() {
    const { route } = this.props;
    const { params } = route;
    const { isMileStone, mileStonesId } = params;
    let lang = await AsyncStorage.getItem("language");
    let babyDob = await AsyncStorage.getItem("babyDob");
    let isQuestionsAnwered = await AsyncStorage.getItem("isAnswered");
    // console.log(!isQuestionsAnwered, !isMileStone, 'testing');
    let daysDiff = toDays(new Date(babyDob), new Date());
    let mileStoneFinder = Math.floor(daysDiff / 365 / 2);
    let mileStoneId =
      mileStoneFinder > 3 ? 3 : mileStoneFinder < 1 ? 1 : mileStoneFinder;
    if (isMileStone && !mileStonesId)
      await getMileStoneQuestions(mileStoneId).then(({ data }) =>
        this.setState({
          lang,
          questions: JSON.parse(data),
          isLoading: false,
          isQuestionsAnwered,
        })
      );
    else if (isMileStone && mileStonesId)
      await getMileStoneQuestions(mileStonesId).then(({ data }) =>
        this.setState({
          lang,
          questions: JSON.parse(data),
          isLoading: false,
          isQuestionsAnwered,
        })
      );
    else
      await getAllQuestions().then((questions) =>
        this.setState({ lang, questions, isLoading: false, isQuestionsAnwered })
      );
  }

  render() {
    const { lang, questions, isLoading, isQuestionsAnwered } = this.state;
    const { route } = this.props;
    const { params } = route;
    const { options, isMileStone } = params;

    if (isLoading) {
      return (
        <View style={[styles.rootContainer, { alignItems: "center" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (lang === null || language[lang] === undefined || questions.length === 0)
      return null;

    return (
      <View style={styles.rootContainer}>
        <StatusBar style="dark" backgroundColor={colors.primary} />
        {/* <View style={styles.container}> */}
        {/* <Text style={styles.heading}>Questionnaire</Text> */}
        {/* </View> */}
        <Swiper
          ref={"swiper"}
          scrollEnabled={options.length === 0 ? true : false}
          showsButtons={false}
          showsPagination={options.length > 0 ? false : true}
          loop={false}
          activeDotColor={colors.primary}
          dotColor={`${colors.primary}70`}
        >
          {this.renderSlides()}
        </Swiper>
        <View></View>
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
  container: { marginTop: 45, paddingHorizontal: 20 },
  heading: { fontSize: 24, fontFamily: "Poppins_600SemiBold" },
});

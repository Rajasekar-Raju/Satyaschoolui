import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import AudioImg from '../../assets/images/questionnaire/audio.png';
import { colors } from '../../utils/contants';
import AsyncStorage from '@react-native-community/async-storage';
import { sendUserAnswers } from '../../api';

const {width, height} = Dimensions.get('window');

export default class SlideItem extends React.Component {
  state = {btnDisabled: false, isLoading: false};

  handleOptionPress = async (questionId, answerVal, nextSlide, isLast) => {
    this.setState({isLoading: true});
    let userId = await AsyncStorage.getItem('userId');
    if(!userId)
      nextSlide();
    else {
      let data = {"UserId": parseInt(userId), "AnsDescription": answerVal, "QuestionId": questionId};
      await sendUserAnswers(data)
                    .then(async () => {
                      this.setState({isLoading: false});
                      if(isLast){
                        await AsyncStorage.setItem('isAnswered', '1');
                      } else {
                        nextSlide();
                      }
                    }).catch(() => {
                      this.setState({isLoading: false});
                      Alert.alert('Error', 'Some error occurred!');
                    });
    }
  }

  renderOptions = (options, nextSlide, questionId, isLoading, isLast) => options.map((option, i) => (
    <TouchableOpacity key={`option-${i}`} style={styles.questionOptContainer} onPress={() => this.handleOptionPress(questionId, option.value, nextSlide, isLast)} disabled={isLoading}>
      <Text style={styles.questionOptText}>{option.name}</Text>
    </TouchableOpacity>
  ));
  
  speak = async txt => {
    let lang = await AsyncStorage.getItem('language');
    this.setState({btnDisabled: true});
    Speech.speak(txt, {
      voice: lang === 'ta' ? 'ta-in-x-taf-network' : 'en-in-x-ahp-network',
      language: lang === 'ta' ? 'ta-IN' : 'en-IN',
      onDone: () => this.setState({btnDisabled: false})
    });
  }

  render() {
    const {count, question, options, nextSlide, questionId, isLast} = this.props;
    const {btnDisabled, isLoading} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.questionText}>
            {question}
          </Text>
          <TouchableOpacity disabled={btnDisabled} onPress={() => this.speak(question)} style={[styles.questionOptContainer, {width: 43, backgroundColor: btnDisabled ? `${colors.primary}50` : colors.primary, marginTop: 10}]}>
            <Image source={AudioImg} style={{height: 24, width: 24}} />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>
          {isLoading ? (<ActivityIndicator size='large' color={colors.primary} />) : this.renderOptions(options, nextSlide, questionId, isLoading, isLast)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 20, marginVertical: 10, justifyContent: 'space-between', alignItems: 'flex-start'},
  questionText: {fontSize: 18, fontFamily: 'Poppins_400Regular'},
  questionContainer: {flex: 1},
  questionOptContainer: {backgroundColor: colors.primary, padding: 9, borderRadius: 5, marginVertical: 2.5},
  questionOptText: {fontSize: 18, lineHeight: 24, color: colors.white, textAlign: 'center', fontFamily: 'Poppins_400Regular'},
  optionsContainer: {width: width-40},
  count: {position: 'absolute', zIndex: 0, color: `${colors.black}20`, fontSize: 72, fontFamily: 'Poppins_900Black', top: -30, left: -15}
});

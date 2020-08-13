import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import * as Speech from 'expo-speech';
import AudioImg from '../../assets/images/questionnaire/audio.png';
import { colors } from '../../utils/contants';

const {width} = Dimensions.get('window');

export default class SlideItem extends React.Component {
  state = {btnDisabled: false};

  renderOptions = (options) => options.map((option, i) => (
    <TouchableOpacity key={`option-${i}`} style={styles.questionOptContainer}>
      <Text style={styles.questionOptText}>{option.name}</Text>
    </TouchableOpacity>
  ));
  
  speak = txt => Speech.speak(txt, {
    onStart: () => this.setState({btnDisabled: true}),
    onDone: () => this.setState({btnDisabled: false})
  })

  render() {
    const {count, question, options} = this.props;
    const {btnDisabled} = this.state;

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
          {this.renderOptions(options)}
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

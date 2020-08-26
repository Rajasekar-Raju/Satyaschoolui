import React from 'react';
import {View, TextInput, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {colors} from '../utils/contants';
import EyeSrike from '../assets/images/common/eye-strike.png';
import Eye from '../assets/images/common/eye.png';

export default class Input extends React.Component {
  state = {isVisible: false};

  toggleVisible = () => this.setState({isVisible: !this.state.isVisible});

  render() {
    const {type, name, value, placeholder, onChange, image, editable, style} = this.props;
    const {isVisible} = this.state;

    return (
      <View style={[styles.flexRow, styles.center, styles.input, style]}>
        {image && (<View>
          <Image source={image} />
        </View>)}
        <View style={[styles.flex]}>
          <TextInput keyboardType={type} value={value} onChangeText={txt => onChange(name, txt)} placeholder={placeholder} style={[styles.textStyle, styles.inputText, styles.textMargin, {alignItems: 'center'}]} secureTextEntry={name === 'password' && !isVisible} editable={editable} />
        </View>
        {name.toLowerCase().indexOf('password') !== -1 && (
          <TouchableOpacity onPress={this.toggleVisible} style={styles.textMargin}>
            <Image source={isVisible ? EyeSrike : Eye} />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
    fontFamily: 'Poppins_400Regular'
  },
  input: {
    padding: 7,
    borderRadius: 5,
    backgroundColor: `${colors.black}10`,
  },
  inputText: {
    fontSize: 18,
    marginTop: 5,
    lineHeight: 24
  },
  textMargin: {
    marginLeft: 10,
  }
});
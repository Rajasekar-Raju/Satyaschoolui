import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';
import Lightbox from 'react-native-lightbox';
import { Audio, Video } from 'expo-av';
// import TrackPlayer from 'react-native-track-player';
import { colors } from '../../utils/contants';
import Input from '../../components/input';

const {width} = Dimensions.get('window');

const userId = 1;
const user = require('../../assets/images/chats/user.png');
// const physician = require('../../assets/images/chats/physician.png');
const trust = require('../../assets/images/chats/trust.png');

const chats = [
  {icon: trust, id: 2, message: 'Hi there', type: 'text'},
  {icon: user, id: 1, message: 'Hey there', type: 'text'},
  {icon: trust, id: 2, message: require('../../assets/images/chats/photo.png'), type: 'photo'},
  {icon: user, id: 1, message: require('../../assets/images/chats/audio.mp3'), type: 'audio'},
  {icon: trust, id: 2, message: require('../../assets/images/chats/video.mp4'), type: 'video'},
];

const ChatItem = ({chat, isPlaying, playbackInstance, setStater}) => {
  const renderContent = chat => {
    let reData = null;
    switch(chat.type) {
      case 'photo':
        reData = (
          <Image source={chat.message} style={[styles.modalView]} />
        );
        break;
      case 'audio':
        reData = (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Feather name='headphones' size={150} color={colors.primary} />
          </View>
        );
        break;
      default:
        reData = (
          <Video isLooping={true} shouldPlay={true} resizeMode='cover' source={chat.message} style={styles.modalView} />
        );
    }
    return reData;
  }

  const onOpen = async (chat, playbackInstance, setStater) => {
    setStater('isPlaying', true);
    const source = chat.message;
    const status = {
      shouldPlay: true,
      volume: 1
    };
    await playbackInstance.loadAsync(source, status, false);
    setStater('playbackInstance', playbackInstance);
    await playbackInstance.playAsync();
  }

  const onClose = async (playbackInstance, setStater) => {
    await playbackInstance.pauseAsync();
    setStater('isPlaying', false);
    setStater('playbackInstance', new Audio.Sound());
  }

  return (
    <View style={[styles.chatItem, userId === chat.id ? styles.chatItemRight : styles.chatItemLeft]}>
      <Image source={chat.icon} style={styles.chatProfile} />
      {chat.type === 'text' && (<Text style={[styles.chatText, userId === chat.id ? styles.chatRight : styles.chatLeft]}>{chat.message}</Text>)}
      {chat.type === 'photo' && (
        <Lightbox style={[styles.chatImgContainer, userId === chat.id ? styles.chatRight : styles.chatLeft]} renderContent={() => renderContent(chat)}>
          <Image source={chat.message} style={[styles.chatImg]} />
        </Lightbox>
      )}
      {chat.type === 'audio' && (
        <Lightbox renderContent={() => renderContent(chat)} onOpen={() => onOpen(chat, playbackInstance, setStater)} onClose={() => onClose(playbackInstance, setStater)}>
          <View style={[styles.chatAudioContainer, userId === chat.id ? styles.chatRight : styles.chatLeft]}>
            <Feather name={isPlaying ? 'pause' : 'play'} size={24} color={colors.primary} />
            <View style={styles.seekBar} />
            <Feather name='headphones' size={24} color={colors.primary} />
          </View>
        </Lightbox>
      )}
      {chat.type === 'video' && (
        <Lightbox renderContent={() => renderContent(chat)}>
          <View style={[styles.chatVideoContainer, userId === chat.id ? styles.chatRight : styles.chatLeft]}>
            <Feather name='play' size={24} style={styles.playIcon} color={colors.primary} />
            <View style={[styles.playOverlay, userId === chat.id ? styles.chatRight : styles.chatLeft]} />
            <Video isLooping={true} shouldPlay={true} isMuted={true} resizeMode='cover' source={chat.message} style={styles.video} rate={1.0} volume={1.0} />
          </View>
        </Lightbox>
      )}
    </View>
  );
}

export default class Chat extends React.Component{
  state = {lang: null, message: '', isPlaying: false, playbackInstance: new Audio.Sound()};

  setStater = (name, value) => this.setState({[name]: value});

  async componentDidMount() {
    let langID = await AsyncStorage.getItem('language');
    this.setState({lang: langID});
  }

  render() {
    const {lang, message, isPlaying, playbackInstance} = this.state;
    if(!lang)
      return null;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollview}>
          {chats.map((chat, i) => (
            <ChatItem key={`chat-item-${i}`} {...{chat, isPlaying, playbackInstance, setStater: this.setStater}} />
          ))}
        </ScrollView>
        <View style={styles.footerContainer}>
          <Input style={styles.inputFlex} name="message" placeholder="Type something..." value={message} onChange={this.handleChange} editable={true} />
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendTxt}>Send</Text>
            <Feather name='send' size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  scrollview: {flex: 1},
  sendBtn: {backgroundColor: colors.black, paddingVertical: 8, paddingHorizontal: 15, flexDirection: 'row'},
  sendTxt: {marginRight: 5, fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: colors.primary},
  footerContainer: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  inputFlex: {flex: 1},
  chatProfile: {height: 50, width: 50},
  chatText: {fontFamily: 'Poppins_400Regular', fontSize: 18, lineHeight: 24, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 50},
  chatLeft: {backgroundColor: `${colors.primary}30`},
  chatRight: {backgroundColor: `${colors.primary}60`},
  chatItem: {flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginVertical: 10},
  chatItemLeft: {justifyContent: 'flex-start'},
  chatItemRight: {justifyContent: 'flex-start', flexDirection: 'row-reverse'},
  chatImgContainer: {marginLeft: 10, borderRadius: 10, height: 170, width: 170, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10},
  chatImg: {height: 150, width: 150},
  seekBar: {height: 5, width: 120, marginHorizontal: 10, backgroundColor: colors.primary},
  chatAudioContainer: {height: 50, width: 210, padding: 10, borderRadius: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: 10},
  chatVideoContainer: {marginLeft: 10, borderRadius: 10, height: 170, width: 170, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10},
  video: {height: 150, width: 150, zIndex: 3, position: 'relative', borderRadius: 10},
  playOverlay: {height: 150, width: 150, position: 'absolute', top: 10, left: 10, zIndex: 4, borderRadius: 10},
  playIcon: {position: 'absolute', top: 170 / 2 - 24 /2, left: 170 / 2 - 24 /2, zIndex: 5},
  modalView: {height: 300, width}
})

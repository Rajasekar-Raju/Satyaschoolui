import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as mime from "react-native-mime-types";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import {
  TextInput,
  Modal,
  Button,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Lightbox from "react-native-lightbox";
import { Audio, Video } from "expo-av";
import { colors, baseURL } from "../../utils/contants";
import * as signalR from "@microsoft/signalr";
import { getUserInfo, uploadFile } from "../../api";
var moment = require("moment");

const { width, height } = Dimensions.get("window");

export const ChatItem = ({
  chat,
  isPlaying,
  playbackInstance,
  setStater,
  userId,
  openModal,
}) => {
  const renderContent = (chat) => {
    let reData = null;
    switch (chat.docType) {
      case "image":
        reData = (
          <Image source={{ uri: chat.msg }} style={[styles.modalView]} />
        );
        break;
      case "audio":
        reData = (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Feather name="headphones" size={150} color={colors.primary} />
          </View>
        );
        break;
      default:
        reData = (
          <Video
            isLooping={true}
            shouldPlay={true}
            resizeMode="contain"
            source={{ uri: chat.msg }}
            style={styles.modalView}
          />
        );
    }
    return reData;
  };

  const onOpen = async (chat, playbackInstance, setStater) => {
    setStater("isPlaying", true);
    const source = { uri: chat.msg };
    const status = {
      shouldPlay: true,
      volume: 1,
    };
    await playbackInstance.loadAsync(source, status, false);
    setStater("playbackInstance", playbackInstance);
    await playbackInstance.playAsync();
  };

  const onClose = async (playbackInstance, setStater) => {
    await playbackInstance.pauseAsync();
    setStater("isPlaying", false);
    setStater("playbackInstance", new Audio.Sound());
  };

  return (
    <View
      style={[
        styles.chatItem,
        userId === chat.sender ? styles.chatItemRight : styles.chatItemLeft,
      ]}
    >
      <TouchableOpacity
        disabled={userId === chat.sender ? false : true}
        onLongPress={() => openModal(true, chat.msgId)}
        style={{
          display: "flex",
          flexDirection: userId === chat.sender ? "row-reverse" : "row",
        }}
      >
        {/* <Image source={chat.icon} style={styles.chatProfile} /> */}
        {chat.docType === "message" && (
          <Text
            style={[
              styles.chatText,
              userId === chat.sender ? styles.chatRight : styles.chatLeft,
            ]}
          >
            {chat.msg}
          </Text>
        )}
        {chat.docType === "image" && (
          <Lightbox
            style={[
              styles.chatImgContainer,
              userId === chat.sender ? styles.chatRight : styles.chatLeft,
            ]}
            renderContent={() => renderContent(chat)}
          >
            <Image source={{ uri: chat.msg }} style={[styles.chatImg]} />
          </Lightbox>
        )}
        {chat.docType === "audio" && (
          <Lightbox
            renderContent={() => renderContent(chat)}
            onOpen={() => onOpen(chat, playbackInstance, setStater)}
            onClose={() => onClose(playbackInstance, setStater)}
          >
            <View
              style={[
                styles.chatAudioContainer,
                userId === chat.sender ? styles.chatRight : styles.chatLeft,
              ]}
            >
              <Feather
                name={isPlaying ? "pause" : "play"}
                size={24}
                color={colors.primary}
              />
              <View style={styles.seekBar} />
              <Feather name="headphones" size={24} color={colors.primary} />
            </View>
          </Lightbox>
        )}
        {chat.docType === "video" && (
          <Lightbox renderContent={() => renderContent(chat)}>
            <View
              style={[
                styles.chatVideoContainer,
                userId === chat.sender ? styles.chatRight : styles.chatLeft,
              ]}
            >
              <Feather
                name="play"
                size={24}
                style={styles.playIcon}
                color={colors.primary}
              />
              <View
                style={[
                  styles.playOverlay,
                  userId === chat.sender ? styles.chatRight : styles.chatLeft,
                ]}
              />
              <Video
                isLooping={true}
                shouldPlay={true}
                isMuted={true}
                resizeMode="cover"
                source={{ uri: chat.msg }}
                style={styles.video}
                rate={1.0}
                volume={1.0}
              />
            </View>
          </Lightbox>
        )}
        <Text style={styles.date}>
          {moment(chat.msgDatetime.toString()).format("lll")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: null,
      message: "",
      isPlaying: false,
      playbackInstance: new Audio.Sound(),
      message: "",
      messages: [],
      adminId: 0,
      visible: false,
      attachment: false,
      msgId: 0,
      loader: false,
    };
  }

  setStater = (name, value) => this.setState({ [name]: value });

  async componentDidMount() {
    let langID = await AsyncStorage.getItem("language");
    let user = await AsyncStorage.getItem("userId");
    await getUserInfo(user).then(async (data) => {
      if (data.code === "200") {
        let user = JSON.parse(data.data)[0];
        this.setState({ adminId: user.Adminid });
      }
    });

    this.setState({ lang: langID, userId: user });
    const hubUrl = `${baseURL}chatHub`;

    const connectionHub = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connectionHub.on("onDelete", (msgId) => {
      let messages = this.state.messages.map((item) =>
        item.msgId !== msgId ? item : { ...item, isActive: false }
      );
      this.setState({ messages });
    });

    connectionHub.on("AddToGroup", (receivedMessage) => {
      // console.log(receivedMessage);
    });

    connectionHub.on("RemoveFromGroup", (receivedMessage) => {
      // console.log(receivedMessage);
    });

    connectionHub.on("sendMessage", (receivedMessage) => {
      let messages = this.state.messages;
      messages.push(receivedMessage);
      this.setState({ messages });
    });

    connectionHub.on("GetMessage", (receivedMessage) => {
      let messages = receivedMessage;
      this.setState({ messages });
    });

    await connectionHub.start().catch((err) => this.logError(err));
    this.setState({ connection: connectionHub, userId: user });
    await connectionHub.invoke("AddToGroup", user);
    await connectionHub.invoke("GetMessage", parseInt(user));
  }

  send = async (e) => {
    e.preventDefault();
    const { userId, message, connection, adminId } = this.state;
    const sendMessage = {
      receiver: adminId,
      sender: parseInt(userId),
      docType: "message",
      msg: message,
      msgDatetime: moment().toLocaleString(),
      isActive: true,
      files: "",
    };
    connection.invoke("sendMessage", sendMessage, false);
    this.setState({ message: "" });
  };

  delete = async () => {
    const { msgId, connection } = this.state;
    connection.invoke("onDelete", msgId);
    this.openModal(false);
  };

  async componentWillUnmount() {
    await this.state.connection.invoke("RemoveFromGroup", this.state.userId);
    await this.state.connection.stop();
  }

  openModal = (visible, msgId = 0) => this.setState({ visible, msgId });

  openAttachment = (attachment) => this.setState({ attachment });

  getCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  };

  getGalleryPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  };

  pickImage = async () => {
    const upload = await this.getCameraPermission();
    if (upload) {
      this.setState({ loader: true });
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        videoMaxDuration: 300,
      });
      if (!result.cancelled) {
        let filesize = await FileSystem.getInfoAsync(result.uri, {
          size: true,
        });
        if (filesize.size / (1024 * 1024) < 10) {
          let localUri = result.uri;
          let filename = localUri.split("/").pop();
          let formData = new FormData();
          formData.append("file", {
            uri: localUri,
            name: filename,
            type: mime.lookup(filename),
          });
          const config = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          };
          await uploadFile(config).then(async (data) => {
            if (data.code === "200") {
              const { userId, connection, adminId } = this.state;
              const sendMessage = {
                receiver: adminId,
                sender: parseInt(userId),
                docType: result.type,
                msg: data.data,
                msgDatetime: moment().toLocaleString(),
                isActive: true,
                files: "",
              };
              connection.invoke("sendMessage", sendMessage, false);
            }
          });
        } else {
          alert("File size exceeds 10MB");
        }
      }
    } else {
      alert("Sorry, we need camera permissions to make this work!");
    }
    this.setState({ attachment: false, loader: false });
  };

  galleryImage = async () => {
    const upload = await this.getGalleryPermission();
    if (upload) {
      this.setState({ loader: true });
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        videoMaxDuration: 300,
      });
      if (!result.cancelled) {
        let filesize = await FileSystem.getInfoAsync(result.uri, {
          size: true,
        });
        if (filesize.size / (1024 * 1024) < 10) {
          let localUri = result.uri;
          let filename = localUri.split("/").pop();
          let formData = new FormData();
          formData.append("file", {
            uri: localUri,
            name: filename,
            type: mime.lookup(filename),
          });
          const config = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          };
          await uploadFile(config).then(async (data) => {
            if (data.code === "200") {
              const { userId, connection, adminId } = this.state;
              const sendMessage = {
                receiver: adminId,
                sender: parseInt(userId),
                docType: result.type,
                msg: data.data,
                msgDatetime: moment().toLocaleString(),
                isActive: true,
                files: "",
              };
              connection.invoke("sendMessage", sendMessage, false);
            }
          });
        } else {
          alert("File size exceeds 10MB");
        }
      }
    } else {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    await this.setState({ attachment: false, loader: false });
  };

  audioPicker = async () => {
    // const upload = await this.getCameraPermission();
    // if (upload) {
    this.setState({ loader: true });
    let result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
    });
    if (!result.cancelled) {
      let filesize = await FileSystem.getInfoAsync(result.uri, {
        size: true,
      });
      if (filesize.size / (1024 * 1024) < 10) {
        let localUri = result.uri;
        let filename = localUri.split("/").pop();
        let formData = new FormData();
        formData.append("file", {
          uri: localUri,
          name: filename,
          type: mime.lookup(filename),
        });
        const config = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
        await uploadFile(config).then(async (data) => {
          if (data.code === "200") {
            const { userId, connection, adminId } = this.state;
            const sendMessage = {
              receiver: adminId,
              sender: parseInt(userId),
              docType: "audio",
              msg: data.data,
              msgDatetime: moment().toLocaleString(),
              isActive: true,
              files: "",
            };
            connection.invoke("sendMessage", sendMessage, false);
          }
        });
      } else {
        alert("File size exceeds 10MB");
      }
    }
    // } else {
    //   alert("Sorry, we need camera permissions to make this work!");
    // }
    this.setState({ attachment: false, loader: false });
  };

  render() {
    const {
      lang,
      message,
      isPlaying,
      playbackInstance,
      messages,
      userId,
      connection,
      visible,
      attachment,
      loader,
    } = this.state;
    if (!lang) return null;
    console.log(messages);
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollview}
          ref={(ref) => {
            this.scrollView = ref;
          }}
          onContentSizeChange={() =>
            this.scrollView.scrollToEnd({ animated: true })
          }
        >
          {messages
            .filter((t) => t.isActive)
            .map((chat, i) => (
              <ChatItem
                key={`chat-item-${i}`}
                {...{
                  chat,
                  isPlaying,
                  playbackInstance,
                  setStater: this.setStater,
                  userId: parseInt(userId),
                  connection,
                  openModal: this.openModal,
                }}
              />
            ))}
        </ScrollView>
        <View style={styles.footerContainer}>
          <IconButton
            icon="paperclip"
            style={{
              backgroundColor: `#e7e7e7`,
              width: 60,
              borderRadius: 0,
              margin: 0,
            }}
            size={32}
            onPress={() => this.openAttachment(true)}
            color={colors.black}
          />
          <TextInput
            style={styles.inputFlex}
            underlineColor={"transparent"}
            mode={"flat"}
            placeholder="Type something..."
            value={message}
            onChangeText={(text) => this.setStater("message", text)}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={this.send}>
            {/* <Text style={styles.sendTxt}>Send</Text> */}
            <MaterialCommunityIcons
              name="send"
              size={24}
              color={colors.primary}
            />

            {/* <Feather name="send" size={24} color={colors.primary} /> */}
          </TouchableOpacity>
        </View>
        <Modal
          visible={visible}
          onDismiss={() => this.openModal(false)}
          contentContainerStyle={styles.containerStyle}
        >
          <Text style={styles.modalText}>Do you want to Delete?</Text>
          <View style={styles.modalButtons}>
            <Button
              icon="delete"
              mode="contained"
              color={colors.primary}
              style={styles.modalButton}
              onPress={this.delete}
            >
              Delete
            </Button>
            <Button
              icon="cancel"
              mode="contained"
              color={colors.primary}
              style={styles.modalButton}
              onPress={() => this.openModal(false)}
            >
              Cancel
            </Button>
          </View>
        </Modal>
        <Modal
          visible={attachment}
          onDismiss={loader ? () => {} : () => this.openAttachment(false)}
          contentContainerStyle={loader ? {} : styles.attachmentModal}
        >
          {loader ? (
            <ActivityIndicator
              animating={loader}
              size="large"
              color={colors.primary}
            />
          ) : (
            <View style={styles.attachments}>
              <IconButton
                icon="camera"
                style={styles.attachmentButton}
                size={40}
                onPress={() => this.pickImage()}
                color={colors.black}
              />
              <IconButton
                icon="image"
                style={styles.attachmentButton}
                size={40}
                onPress={() => this.galleryImage()}
                color={colors.black}
              />
              <IconButton
                icon="headphones"
                style={styles.attachmentButton}
                size={40}
                onPress={() => this.audioPicker()}
                color={colors.black}
              />
            </View>
          )}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollview: { flex: 1 },
  date: {
    width: 60,
    color: `${colors.black}30`,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
  },
  sendBtn: {
    backgroundColor: colors.black,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    height: 48,
  },
  sendTxt: {
    marginRight: 5,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: colors.primary,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputFlex: { flex: 1, height: 48, borderRadius: 0 },
  chatProfile: { height: 50, width: 50 },
  chatText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    lineHeight: 24,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: width - 100,
  },
  chatLeft: {
    backgroundColor: `${colors.black}20`,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  chatRight: {
    backgroundColor: `${colors.primary}60`,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  chatItemLeft: { justifyContent: "flex-start" },
  chatItemRight: { justifyContent: "flex-start", flexDirection: "row-reverse" },
  chatImgContainer: {
    marginLeft: 10,
    borderRadius: 10,
    height: 170,
    width: 170,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  chatImg: { height: 150, width: 150 },
  seekBar: {
    height: 5,
    width: 120,
    marginHorizontal: 10,
    backgroundColor: colors.primary,
  },
  chatAudioContainer: {
    height: 50,
    width: 210,
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
  },
  chatVideoContainer: {
    marginLeft: 10,
    borderRadius: 10,
    height: 170,
    width: 170,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  video: {
    height: 150,
    width: 150,
    zIndex: 3,
    position: "relative",
    // borderRadius: 10,
  },
  playOverlay: {
    height: 150,
    width: 150,
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 4,
    borderRadius: 10,
  },
  playIcon: {
    position: "absolute",
    top: 170 / 2 - 24 / 2,
    left: 170 / 2 - 24 / 2,
    zIndex: 5,
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    margin: 30,
    borderRadius: 10,
  },
  modalText: {
    display: "flex",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
  },
  modalView: {
    height: height,
    width: width,
    display: "flex",
    resizeMode: "contain",
  },
  modalButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    margin: 5,
  },
  attachmentModal: {
    height: 100,
    width: width,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  attachments: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  attachmentButton: {
    backgroundColor: colors.primary,
  },
});

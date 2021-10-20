import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as mime from "react-native-mime-types";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-community/async-storage";
import * as DocumentPicker from "expo-document-picker";
import {
  Appbar,
  TextInput,
  Modal,
  Button,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { colors } from "../../utils/contants";
import { ChatItem } from "../dashboard/Chat";
import { Audio, Video } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import PersonPng from "../../assets/images/common/person.png";
import { uploadFile } from "../../api";

var moment = require("moment");

const { width, height } = Dimensions.get("window");
// const chats = [
//   {
//     createdOn: "2020-12-04T21:36:57.89",
//     docType: "message",
//     docUrl: null,
//     isActive: false,
//     msg: "How are you",
//     msgDatetime: "Sat Dec 05 2020 10:06:57 GMT+0530",
//     msgId: 2,
//     receiver: 27,
//     sender: 3,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-04T21:37:17.25",
//     docType: "image",
//     docUrl: null,
//     isActive: true,
//     msg:
//       "http://51.210.150.124/Tempupload/77c9f386-888c-4acf-8a22-edd09f4a49fe.jpg",
//     msgDatetime: "Sat Dec 05 2020 10:07:16 GMT+0530",
//     msgId: 3,
//     receiver: 27,
//     sender: 3,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-04T21:42:35.17",
//     docType: "message",
//     docUrl: null,
//     isActive: true,
//     msg: "Hi ji",
//     msgDatetime: "Sat Dec 05 2020 10:12:33 GMT+0530",
//     msgId: 4,
//     receiver: 3,
//     sender: 27,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-04T21:43:30.147",
//     docType: "message",
//     docUrl: null,
//     isActive: true,
//     msg: "How r u",
//     msgDatetime: "Sat Dec 05 2020 10:13:28 GMT+0530",
//     msgId: 5,
//     receiver: 3,
//     sender: 27,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-04T21:45:09.843",
//     docType: "message",
//     docUrl: null,
//     isActive: true,
//     msg: "Hello",
//     msgDatetime: "Sat Dec 05 2020 10:15:09 GMT+0530",
//     msgId: 6,
//     receiver: 27,
//     sender: 3,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-04T23:14:02.997",
//     docType: "message",
//     docUrl: null,
//     isActive: true,
//     msg: "Hi",
//     msgDatetime: "Sat Dec 05 2020 11:44:01 GMT+0530",
//     msgId: 7,
//     receiver: 3,
//     sender: 27,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-05T05:19:25.99",
//     docType: "message",
//     docUrl: null,
//     isActive: true,
//     msg: "Good evening",
//     msgDatetime: "Sat Dec 05 2020 17:49:25 GMT+0530",
//     msgId: 8,
//     receiver: 27,
//     sender: 3,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-05T05:19:37.023",
//     docType: "image",
//     docUrl: null,
//     isActive: true,
//     msg:
//       "http://51.210.150.124/Tempupload/acf327ee-1903-419f-924c-1ed82e4a002f.jpg",
//     msgDatetime: "Sat Dec 05 2020 17:49:36 GMT+0530",
//     msgId: 9,
//     receiver: 27,
//     sender: 3,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-13T22:17:40.193",
//     docType: "image",
//     docUrl: null,
//     isActive: true,
//     msg:
//       "http://51.210.150.124/Tempupload/57bfb2ed-4e29-4832-8db3-e47420ea7f93.jpg",
//     msgDatetime: "Mon Dec 14 2020 10:47:38 GMT+0530",
//     msgId: 10,
//     receiver: 27,
//     sender: 3,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2020-12-13T22:31:32.593",
//     docType: "message",
//     docUrl: null,
//     isActive: true,
//     msg: "Hello",
//     msgDatetime: "Mon Dec 14 2020 11:01:31 GMT+0530",
//     msgId: 11,
//     receiver: 27,
//     sender: 3,
//     updatedOn: null,
//   },
//   {
//     createdOn: "2021-01-18T00:35:03.603",
//     docType: "message",
//     docUrl: null,
//     isActive: true,
//     msg: "Hello",
//     msgDatetime: "Mon Jan 18 2021 13:05:02 GMT+0530",
//     msgId: 12,
//     receiver: 27,
//     sender: 3,
//     updatedOn: null,
//   },
// ];

const Chat = (props) => {
  const { route, navigation } = props;
  const { item } = route.params;

  const [message, setMessage] = React.useState("");

  const [isPlaying, setisPlaying] = useState(false);

  const [playbackInstance, setplaybackInstance] = useState(new Audio.Sound());

  const [attachment, setattachment] = useState(false);

  const [loader, setloader] = useState(false);

  const [msgId, setmsgId] = useState(0);

  const [visible, setvisible] = useState(false);

  const [userId, setuserId] = useState("");

  const scrollView = useRef();

  const setUserData = async () => {
    let user = await AsyncStorage.getItem("userId");
    await setuserId(user);
  };

  const connection = useSelector((state) => state.chat.connectionHub);

  const chats = useSelector((state) =>
    state.chat.messages.filter(
      (x) =>
        (x.receiver === parseInt(userId) && x.sender === item.userid) ||
        (x.sender === parseInt(userId) && x.receiver === item.userid)
    )
  );

  const deleteMsg = async () => {
    if (connection.state === "Disconnected") {
      await connection.start();
      connection.invoke("onDelete", msgId);
    } else {
      connection.invoke("onDelete", msgId);
    }
    setvisible(false);
  };

  const send = async (e) => {
    e.preventDefault();
    let msg = message;
    setMessage("");
    const sendMessage = {
      receiver: item.userid,
      sender: parseInt(userId),
      docType: "message",
      msg: msg,
      msgDatetime: moment().toLocaleString(),
      isActive: true,
      files: "",
    };
    if (connection.state === "Disconnected") {
      await connection.start();
      await connection.invoke("sendMessage", sendMessage, true);
    } else {
      await connection.invoke("sendMessage", sendMessage, true);
    }
  };

  useEffect(() => {
    setUserData();
  }, []);

  const onChangeMessage = (query) => setMessage(query);

  const setStater = (name, value) => {
    if (name === "isPlaying") {
      setisPlaying(value);
    } else if (name === "playbackInstance") {
      setplaybackInstance(value);
    }
  };

  const getCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  };

  const getGalleryPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  };

  const openModal = (visible, msgId = 0) => {
    setvisible(visible);
    setmsgId(msgId);
  };

  const pickImage = async () => {
    const upload = await getCameraPermission();
    if (upload) {
      setloader(true);
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
              const sendMessage = {
                receiver: item.userid,
                sender: parseInt(userId),
                docType: result.type,
                msg: data.data,
                msgDatetime: moment().toLocaleString(),
                isActive: true,
                files: "",
              };
              if (connection.state === "Disconnected") {
                await connection.start();
                await connection.invoke("sendMessage", sendMessage, true);
              } else {
                await connection.invoke("sendMessage", sendMessage, true);
              }
            }
          });
        } else {
          alert("File size exceeds 10MB");
        }
      }
    } else {
      alert("Sorry, we need camera permissions to make this work!");
    }
    setattachment(false);
    setloader(false);
  };

  const galleryImage = async () => {
    const upload = await getGalleryPermission();
    if (upload) {
      setloader(true);
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
              const sendMessage = {
                receiver: item.userid,
                sender: parseInt(userId),
                docType: result.type,
                msg: data.data,
                msgDatetime: moment().toLocaleString(),
                isActive: true,
                files: "",
              };
              if (connection.state === "Disconnected") {
                await connection.start();
                await connection.invoke("sendMessage", sendMessage, true);
              } else {
                await connection.invoke("sendMessage", sendMessage, true);
              }
            }
          });
        } else {
          alert("File size exceeds 10MB");
        }
      }
    } else {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    await setattachment(false);
    await setloader(false);
  };

  const audioPicker = async () => {
    // const upload = await this.getCameraPermission();
    // if (upload) {
    setloader(true);
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
            const sendMessage = {
              receiver: item.userid,
              sender: parseInt(userId),
              docType: "audio",
              msg: data.data,
              msgDatetime: moment().toLocaleString(),
              isActive: true,
              files: "",
            };
            if (connection.state === "Disconnected") {
              await connection.start();
              await connection.invoke("sendMessage", sendMessage, true);
            } else {
              await connection.invoke("sendMessage", sendMessage, true);
            }
          }
        });
      } else {
        alert("File size exceeds 10MB");
      }
    }
    // } else {
    //   alert("Sorry, we need camera permissions to make this work!");
    // }
    setloader(false);
    setattachment(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={0}
        style={{ backgroundColor: colors.primary }}
      >
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Image
          style={{ width: 50, height: 50, borderRadius: 50 }}
          source={item.image !== null ? { uri: item.image } : PersonPng}
        />
        <Appbar.Content
          title={item.name}
          onPress={() => navigation.navigate("Profile", { item })}
        />
      </Appbar.Header>
      <ScrollView
        style={{ flex: 1 }}
        ref={(ref) => {
          scrollView.current = ref;
        }}
        onContentSizeChange={() =>
          scrollView.current.scrollToEnd({ animated: true })
        }
      >
        {chats
          .filter((t) => t.isActive)
          .map((chat, i) => (
            <ChatItem
              key={`chat-item-${i}`}
              {...{
                chat,
                isPlaying,
                playbackInstance,
                setStater: setStater,
                userId: parseInt(userId),
                // connection,
                openModal: openModal,
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
          onPress={() => setattachment(true)}
          color={colors.black}
        />
        <TextInput
          style={styles.inputFlex}
          underlineColor={"transparent"}
          mode={"flat"}
          placeholder="Type something..."
          value={message}
          onChangeText={onChangeMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
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
        onDismiss={() => setvisible(false)}
        contentContainerStyle={styles.containerStyle}
      >
        <Text style={styles.modalText}>Do you want to Delete?</Text>
        <View style={styles.modalButtons}>
          <Button
            icon="delete"
            mode="contained"
            color={colors.primary}
            style={styles.modalButton}
            onPress={deleteMsg}
          >
            Delete
          </Button>
          <Button
            icon="cancel"
            mode="contained"
            color={colors.primary}
            style={styles.modalButton}
            onPress={() => setvisible(false)}
          >
            Cancel
          </Button>
        </View>
      </Modal>
      <Modal
        visible={attachment}
        onDismiss={loader ? () => {} : () => setattachment(false)}
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
              onPress={pickImage}
              color={colors.black}
            />
            <IconButton
              icon="image"
              style={styles.attachmentButton}
              size={40}
              onPress={galleryImage}
              color={colors.black}
            />
            <IconButton
              icon="headphones"
              style={styles.attachmentButton}
              size={40}
              onPress={audioPicker}
              color={colors.black}
            />
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  attachments: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  attachmentModal: {
    height: 100,
    width: width,
    zIndex: 1,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  attachmentButton: {
    backgroundColor: colors.primary,
  },
  inputFlex: { flex: 1, height: 48, borderRadius: 0 },
  sendBtn: {
    backgroundColor: colors.black,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    height: 48,
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
  modalButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    margin: 5,
  },
});

export default Chat;

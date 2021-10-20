import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import {
  Appbar,
  List,
  Divider,
  FAB,
  Searchbar,
  Modal,
} from "react-native-paper";
import { baseURL, CHAT, colors } from "../../utils/contants";
import { StackActions } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as signalR from "@microsoft/signalr";
import PersonPng from "../../assets/images/common/person.png";
import Notification from "../../components/Notifications";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { getToken } from "../../api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

var moment = require("moment");

const Home = (props) => {
  const [name, setname] = useState("");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.chat.chatList);
  const [notification, setnotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      setnotification(notification);
    }
  );

  responseListener.current = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      // if (
      //   response.notification.request.content.data &&
      //   response.notification.request.content.data.page === "appointment"
      // ) {
      //   const { navigation } = this.props;
      //   navigation.navigate("appointments");
      // } else if (
      //   response.notification.request.content.data &&
      //   response.notification.request.content.data.page === "chat"
      // ) {
      //   const { navigation } = this.props;
      //   navigation.navigate("Chat");
      // }
    }
  );

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted" || Platform.OS === "android") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  };

  const setmessages = (data) => dispatch({ type: CHAT.SET_MESSAGES, data });
  const setusers = (data) => dispatch({ type: CHAT.SET_CHATS, data });
  const setconnection = (data) => dispatch({ type: CHAT.SET_CONNECTION, data });
  const setinitmessages = (data) =>
    dispatch({ type: CHAT.SET_INIT_MESSAGES, data });
  const setdeletemessages = (data) =>
    dispatch({ type: CHAT.SET_DEL_MESSAGES, data });
  const updateUsers = (data) => dispatch({ type: CHAT.UPDATE_USERS, data });

  const { navigation } = props;
  const setUserName = async () => {
    let userName = await AsyncStorage.getItem("userName");
    await setname(userName);
  };

  const getPushToken = async () => {
    let pushToken = await AsyncStorage.getItem("pushToken");
    let userId = await AsyncStorage.getItem("userId");
    console.log(pushToken);
    if (pushToken === "" || pushToken === null) {
      registerForPushNotificationsAsync().then(async (token) => {
        await AsyncStorage.setItem("pushToken", token);
        let usertoken = { UserId: parseInt(userId), Token: token };
        await getToken(usertoken).then((data) => data);
        console.log(token);
      });
    }
  };

  useEffect(() => {
    setUserName();
    setConnection();
    getPushToken();
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const setConnection = async () => {
    const hubUrl = `${baseURL}chatHub`;
    let user = await AsyncStorage.getItem("userId");
    const connectionHub = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();
    // connectionHub.serverTimeoutInMilliseconds = 100000;

    connectionHub.on("onDelete", (msgId) => {
      setdeletemessages(msgId);
    });

    connectionHub.on("AddToGroup", (receivedMessage) => {
      // console.log(receivedMessage);
    });

    connectionHub.on("RemoveFromGroup", (receivedMessage) => {
      // console.log(receivedMessage);
    });

    connectionHub.on("sendMessage", (receivedMessage) => {
      setmessages(receivedMessage);
    });

    connectionHub.on("GetMessage", (receivedMessage) => {
      setinitmessages(receivedMessage);
    });

    connectionHub.on("GetLastMessage", (receivedMessage) => {
      updateUsers(receivedMessage);
    });

    connectionHub.on("GetChatList", (receivedMessage) => {
      setusers(receivedMessage);
    });

    await connectionHub.start().catch((err) => {});
    // this.setState({ connection: connectionHub, userId: user });
    await connectionHub.invoke("AddToGroup", user);
    await connectionHub.invoke("GetChatList", parseInt(user));
    await connectionHub.invoke("GetMessage", parseInt(user));
    await dispatch({ type: CHAT.SET_LOADING, data: false });
    setconnection(connectionHub);
  };

  const logout = async (page) => {
    // let token = await AsyncStorage.getItem("pushToken");
    // await deleteToken(token);
    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("isAdmin");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("profile");
    await AsyncStorage.removeItem("babyDob");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("isAnswered");
    await AsyncStorage.removeItem("pushToken");

    navigation.dispatch(StackActions.replace("Auth"));
  };

  const [searchQuery, setSearchQuery] = React.useState("");

  const [isSearch, setIsSearch] = React.useState(false);

  const loading = useSelector((state) => state.chat.loading);

  const onChangeSearch = (query) => setSearchQuery(query);

  const goToChat = (item) => {
    navigation.navigate("Chat", { item });
  };

  const setSearch = () => {
    setIsSearch(!isSearch);
    setSearchQuery("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" backgroundColor={colors.primary} />
      <Modal visible={loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Modal>
      {!isSearch ? (
        <Appbar.Header
          statusBarHeight={0}
          style={{ backgroundColor: colors.primary }}
        >
          <Appbar.Content
            title="Chat"
            subtitle={name}
            subtitleStyle={{
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: 16,
            }}
          />
          <Appbar.Action icon="magnify" onPress={setSearch} />
          <Appbar.Action icon="logout" onPress={logout} />
        </Appbar.Header>
      ) : (
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          onIconPress={setSearch}
          clearIcon={"close"}
          icon={"arrow-left"}
          value={searchQuery}
        />
      )}
      <ScrollView>
        {users.length > 0 &&
          users
            .filter((x) => x.name.includes(searchQuery) && x.message !== null)
            .sort((a, b) => b.message.msgId - a.message.msgId)
            .map((item, i) => (
              <>
                <TouchableOpacity onPress={() => goToChat(item)}>
                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                      source={
                        item.image !== null ? { uri: item.image } : PersonPng
                      }
                    />
                    <View style={{ padding: 5, width: "88%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          // width: "100%",
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        <Text
                          style={{
                            fontSize: 14,
                            // textAlign: "right",
                            color: "#00000070",
                          }}
                        >
                          {moment().isSame(item.message.msgDatetime, "day")
                            ? moment(item.message.msgDatetime).format("LT")
                            : moment(item.message.msgDatetime).format(
                                "DD/MMM/YY"
                              )}
                        </Text>
                      </View>
                      <Text style={{ color: "#00000070" }}>
                        {item.message.docType === "message"
                          ? item.message.msg
                          : item.message.docType}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {users.length - 1 !== i && <Divider />}
              </>
            ))}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="chat"
        onPress={() => navigation.navigate("Contact")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 20,
    right: 10,
    bottom: 20,
    backgroundColor: colors.primary,
  },
});

export default Home;

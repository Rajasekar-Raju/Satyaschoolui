import React from "react";
import { View, Text, StatusBar, Image, ScrollView } from "react-native";
import { colors } from "../../utils/contants";
import PersonPng from "../../assets/images/common/person.png";
import {} from "react-native-gesture-handler";
import { IconButton, List } from "react-native-paper";
import { Linking } from "react-native";
var moment = require("moment");

const Profile = (props) => {
  const { route, navigation } = props;
  const { item } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor={colors.primary} />
      <IconButton
        style={{ position: "absolute", top: 10, left: 5, zIndex: 10 }}
        icon="arrow-left"
        size={25}
        onPress={() => navigation.goBack()}
      />
      <Image
        resizeMode={"stretch"}
        style={{ height: 250, width: 400 }}
        source={item.image !== null ? { uri: item.image } : PersonPng}
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
        <List.Item
          style={{ paddingVertical: 0, marginVertical: 0 }}
          title={`${item.name} ${item.lastname}`}
          left={(props) => (
            <List.Icon
              {...props}
              style={{ marginHorizontal: 0 }}
              icon="account"
            />
          )}
        />
        <List.Item
          style={{ paddingVertical: 0, marginVertical: 0 }}
          title={`${item.childname}`}
          left={(props) => (
            <List.Icon {...props} style={{ marginHorizontal: 0 }} icon="face" />
          )}
        />
        <List.Item
          style={{ paddingVertical: 0, marginVertical: 0 }}
          title={
            item.childdob
              ? item.childdob === ""
                ? ""
                : moment(item.childdob).format("ll")
              : ""
          }
          left={(props) => (
            <List.Icon
              {...props}
              style={{ marginHorizontal: 0 }}
              icon="cake-variant"
            />
          )}
        />
        <List.Item
          style={{ paddingVertical: 0, marginVertical: 0 }}
          title={
            <Text
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
            >{`${item.phone}`}</Text>
          }
          left={(props) => (
            <List.Icon
              {...props}
              style={{ marginHorizontal: 0 }}
              icon="phone"
            />
          )}
        />
        <List.Item
          style={{ paddingVertical: 0, marginVertical: 0 }}
          title={
            <Text
              onPress={() => Linking.openURL(`mailto:${item.email}`)}
            >{`${item.email}`}</Text>
          }
          left={(props) => (
            <List.Icon
              {...props}
              style={{ marginHorizontal: 0 }}
              icon="gmail"
            />
          )}
        />
        <List.Item
          style={{ paddingVertical: 0, marginVertical: 0 }}
          titleNumberOfLines={7}
          title={`${item.address}, ${item.city}, ${item.district}, ${item.state}, ${item.country} - ${item.pincode}`}
          left={(props) => (
            <List.Icon
              {...props}
              style={{ marginHorizontal: 0 }}
              icon="map-marker"
            />
          )}
        />
      </ScrollView>
    </View>
  );
};

export default Profile;

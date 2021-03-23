import React from "react";
import { View, StyleSheet, Image, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { Appbar, List, Divider, Searchbar } from "react-native-paper";
import { colors } from "../../utils/contants";
import { StackActions } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import PersonPng from "../../assets/images/common/person.png";

const Home = (props) => {
  const { navigation } = props;

  const names = useSelector((state) => state.chat.chatList);

  const [searchQuery, setSearchQuery] = React.useState("");

  const [isSearch, setIsSearch] = React.useState(false);

  const onChangeSearch = (query) => setSearchQuery(query);

  const setSearch = () => {
    setIsSearch(!isSearch);
    setSearchQuery("");
  };

  const goToChat = (item) => {
    // navigation.navigate("Chat", { item });
    navigation.dispatch(StackActions.replace("Chat", { item }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" backgroundColor={colors.primary} />
      {!isSearch ? (
        <Appbar.Header
          statusBarHeight={0}
          style={{ backgroundColor: colors.primary }}
        >
          <Appbar.BackAction onPress={() => props.navigation.goBack()} />
          <Appbar.Content
            title="Select Contact"
            subtitle={`${names.length} contacts`}
          />
          <Appbar.Action icon="magnify" onPress={setSearch} />
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
        {names
          .filter((x) => x.name.includes(searchQuery))
          .map((item, i) => (
            <>
              <List.Item
                // key={item.id}
                title={item.name}
                onPress={() => goToChat(item)}
                left={(props) => (
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                    source={
                      item.image !== null ? { uri: item.image } : PersonPng
                    }
                  />
                )}
              />
              {names.length - 1 !== i && <Divider />}
            </>
          ))}
      </ScrollView>
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

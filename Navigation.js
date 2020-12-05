import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { colors, language, options, taOptions } from "./utils/contants";
import AsyncStorage from "@react-native-community/async-storage";
import { Ionicons, Feather } from "@expo/vector-icons";

import AnimatedTabBar from "@gorhom/animated-tabbar";

import Onboarding from "./screens/onboarding";
import Auth from "./screens/auth";
import Login from "./screens/auth/Login";
// import Register from './screens/auth/Register';
import Parent from "./screens/auth/Parent";
// import Physician from './screens/auth/Physician';
import Waiting from "./screens/auth/Waiting";
import Success from "./screens/auth/Success";
import Failure from "./screens/auth/Failure";
import Lang from "./screens/auth/Lang";
import Home from "./screens/dashboard/Home";
import Settings from "./screens/dashboard/Settings";
import Chat from "./screens/dashboard/Chat";
import History from "./screens/dashboard/History";
import Questionnaire from "./screens/dashboard/Qusetionnaire";
import AboutApp from "./screens/settings/aboutApp";
import AboutUs from "./screens/settings/aboutUs";
import Terms from "./screens/settings/terms";
import Policy from "./screens/settings/policy";
import Appointments from "./screens/settings/appointments";
import Account from "./screens/settings/account";

import Left from "./assets/images/common/left.png";
import { getUserInfo } from "./api";
import Visitor from "./screens/visitors";

const tabProps = {
  labelStyle: {
    color: "#5B37B7",
  },
  icon: {
    component: () => (
      <Ionicons name="md-checkmark-circle" size={32} color="green" />
    ),
    color: "#000",
  },
  ripple: {
    color: "#FFC300",
  },
};

const tabs = {
  Home: {
    ...tabProps,
    icon: {
      ...tabProps.icon,
      component: ({ animatedFocus, color, size }) => (
        <Feather name="home" {...{ size: 32, color }} />
      ),
    },
  },
  History: {
    ...tabProps,
    icon: {
      ...tabProps.icon,
      component: ({ animatedFocus, color, size }) => (
        <Feather name="bell" {...{ size: 32, color }} />
      ),
    },
  },
  Questionnaire: {
    ...tabProps,
    icon: {
      ...tabProps.icon,
      component: ({ animatedFocus, color, size }) => (
        <Feather name="help-circle" {...{ size: 32, color }} />
      ),
    },
  },
  Chat: {
    ...tabProps,
    icon: {
      ...tabProps.icon,
      component: ({ animatedFocus, color, size }) => (
        <Feather name="message-square" {...{ size: 32, color }} />
      ),
    },
  },
  Settings: {
    ...tabProps,
    icon: {
      ...tabProps.icon,
      component: ({ animatedFocus, color, size }) => (
        <Feather name="settings" {...{ size: 32, color }} />
      ),
    },
  },
};

const HeaderTitle = ({ heading, subHeading }) => (
  <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
    <View style={{ position: "absolute", zIndex: 5 }}>
      <Text
        style={{
          fontSize: 36,
          lineHeight: 49,
          color: `${colors.black}10`,
          fontFamily: "Poppins_900Black",
        }}
        numberOfLines={1}
      >
        {heading}
      </Text>
    </View>
    <View style={{ position: "relative", zIndex: 10 }}>
      <Text
        style={{
          fontSize: 18,
          lineHeight: 24,
          color: colors.primary,
          fontFamily: "Poppins_600SemiBold",
          fontWeight: "bold",
        }}
        numberOfLines={1}
      >
        {subHeading}
      </Text>
    </View>
  </View>
);

const HeaderLeft = ({ onPress }) =>
  onPress ? (
    <TouchableOpacity
      onPress={() => onPress()}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Image source={Left} />
    </TouchableOpacity>
  ) : (
    <View />
  );

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = (heading, subHeading, lang, isLeft, isRight) => {
  return {
    headerStyle: { elevation: 0, shadowOpacity: 0 },
    headerTitle: () => (
      <HeaderTitle
        heading={language[lang][`${heading}`]}
        subHeading={language[lang][`${subHeading}`]}
      />
    ),
    headerLeft: (props) => (isLeft ? <HeaderLeft {...props} /> : <View />),
    headerRight: (props) => <View />,
  };
};

class RegisterStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang });
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"Register"} lazy={false}>
        {/* <Stack.Screen name='Register' component={Register} options={headerOptions('auth', 'register', lang, 1, 0)} /> */}
        <Stack.Screen
          name="Register"
          component={Parent}
          options={headerOptions("auth", "register", lang, 1, 0)}
        />
        {/* <Stack.Screen name='Physician' component={Physician} options={headerOptions('auth', 'register', lang, 1, 0)} /> */}
        {/* <Stack.Screen name='Waiting' component={Waiting} options={headerOptions('auth', 'register', lang, 1, 0)} /> */}
        {/* <Stack.Screen name='Success' component={Success} options={headerOptions('auth', 'register', lang, 1, 0)} /> */}
        {/* <Stack.Screen name='Failure' component={Failure} options={headerOptions('auth', 'register', lang, 1, 0)} /> */}
      </Stack.Navigator>
    );
  }
}

class QuestionnaireVisitorStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang });
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"Vsitor"} lazy={false}>
        <Stack.Screen
          name="Vsitor"
          component={Visitor}
          options={headerOptions("auth", "visitor", lang, 1, 0)}
        />
        <Stack.Screen
          name="QuestionnaireVsitor"
          component={Questionnaire}
          options={headerOptions("auth", "visitor", lang, 1, 0)}
        />
      </Stack.Navigator>
    );
  }
}

class AuthStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang });
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"Auth"} lazy={false}>
        <Stack.Screen
          name="Auth"
          component={Auth}
          initialParams={{ rootRoute: route }}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          initialParams={{ rootRoute: route }}
          options={headerOptions("auth", "login", lang, 1, 0)}
        />
        <Stack.Screen
          name="Register"
          component={RegisterStack}
          initialParams={{ rootRoute: route }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuestionnaireVisitor"
          component={QuestionnaireVisitorStack}
          initialParams={{ options: [] }}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
}

class OnboardingStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang: lang === null ? "en" : lang });
  }

  async componentDidUpdate() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang: lang === null ? "en" : lang });
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"Lang"} lazy={false}>
        <Stack.Screen
          name="Lang"
          component={Lang}
          initialParams={{ rootRoute: route }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          initialParams={{ rootRoute: route }}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
}

class QuestionnaireStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang });
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"Questionnaire"} lazy={false}>
        <Stack.Screen
          name="Questionnaire"
          component={Questionnaire}
          initialParams={{
            options: lang === "ta" ? taOptions : options,
            isMileStone: true,
            home: true,
          }}
          options={headerOptions("dashboard", "questionnaire", lang, 0, 0)}
        />
      </Stack.Navigator>
    );
  }
}

class HomeStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang });
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"Home"} lazy={false}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
}

class HistoryStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang });
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"History"} lazy={false}>
        <Stack.Screen
          name="History"
          component={History}
          options={headerOptions("dashboard", "history", lang, 0, 0)}
        />
      </Stack.Navigator>
    );
  }
}

class ChatStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang });
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"Chat"} lazy={false}>
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={headerOptions("trust", "chat", lang, 0, 0)}
        />
        <Stack.Screen
          name="ChatPhysician"
          component={Chat}
          options={headerOptions("physician", "chat", lang, 0, 1)}
        />
      </Stack.Navigator>
    );
  }
}

class SettingsStack extends React.Component {
  state = { lang: null };

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    this.setState({ lang });
  }

  async componentDidUpdate() {
    const { route } = this.props;
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : "";
    if (routeName === "Settings") {
      this.props.navigation.setOptions({ tabBarVisible: true });
    } else {
      this.props.navigation.setOptions({ tabBarVisible: false });
    }
  }

  render() {
    const { route } = this.props;
    const { lang } = this.state;

    if (lang === null) return null;

    return (
      <Stack.Navigator initialRouteName={"Settings"} lazy={false}>
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={headerOptions("dashboard", "settings", lang, 0, 0)}
        />
        <Stack.Screen
          name="AboutApp"
          component={AboutApp}
          options={headerOptions("settings", "aboutApp", lang, 0, 0)}
        />
        <Stack.Screen
          name="aboutUs"
          component={AboutUs}
          options={headerOptions("settings", "aboutUs", lang, 0, 0)}
        />
        <Stack.Screen
          name="termsConditions"
          component={Terms}
          options={headerOptions("settings", "termsConditions", lang, 0, 0)}
        />
        <Stack.Screen
          name="privacyPolicies"
          component={Policy}
          options={headerOptions("settings", "privacyPolicies", lang, 0, 0)}
        />
        <Stack.Screen
          name="appointments"
          component={Appointments}
          options={headerOptions("settings", "appointments", lang, 0, 0)}
        />
        <Stack.Screen
          name="account"
          component={Account}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
}

class AppStack extends React.Component {
  state = { lang: null, isQuestionsAnwered: false }; //null};

  async componentDidMount() {
    let lang = await AsyncStorage.getItem("language");
    let isQuestionsAnwered = (await AsyncStorage.getItem("isAnswered")) === "1";
    this.setState({ lang, isQuestionsAnwered });
  }

  async componentDidUpdate() {
    let isQuestionsAnwered = (await AsyncStorage.getItem("isAnswered")) === "1";
    this.setState({ isQuestionsAnwered });
    let lang = await AsyncStorage.getItem("language");
    if (lang !== this.state.lang) {
      this.setState({ lang: null });
      this.setState({ lang });
    }
  }

  render() {
    const { route } = this.props;
    const { lang, isQuestionsAnwered } = this.state;

    if (lang === null) return null;

    if (!isQuestionsAnwered)
      return (
        <Stack.Navigator initialRouteName={"QuestionnaireInit"}>
          <Stack.Screen
            name="QuestionnaireInit"
            component={Questionnaire}
            initialParams={{
              options: lang === "ta" ? taOptions : options,
              isMileStone: true,
            }}
            options={headerOptions("dashboard", "questionnaire", lang, 0, 0)}
          />
        </Stack.Navigator>
      );

    return (
      <Tab.Navigator
        initialRouteName={"Home"}
        tabBar={(props) => (
          <AnimatedTabBar
            animation={"iconOnly"}
            inactiveOpacity={0.25}
            inactiveScale={0.85}
            preset={"material"}
            tabs={tabs}
            {...props}
          />
        )}
        lazy={false}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          initialParams={{ rootRoute: route }}
          options={headerOptions("dashboard", "questionnaire", lang, 1, 0)}
        />
        <Tab.Screen
          name="History"
          component={HistoryStack}
          initialParams={{ rootRoute: route }}
          options={headerOptions("dashboard", "questionnaire", lang, 1, 0)}
        />
        <Tab.Screen
          name="Questionnaire"
          component={QuestionnaireStack}
          initialParams={{ rootRoute: route }}
          options={headerOptions("dashboard", "questionnaire", lang, 1, 0)}
        />
        <Tab.Screen
          name="Chat"
          component={ChatStack}
          initialParams={{ rootRoute: route }}
          options={headerOptions("dashboard", "questionnaire", lang, 1, 0)}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          initialParams={{ rootRoute: route }}
          options={headerOptions("dashboard", "questionnaire", lang, 1, 0)}
        />
      </Tab.Navigator>
    );
  }
}

class Navigation extends React.Component {
  state = { initScreen: null, lang: null };

  setLanguage = async (lang) => {
    await AsyncStorage.setItem("language", lang);
    this.setState({ lang });
  };

  async componentDidMount() {
    // await AsyncStorage.clear();
    let langID = await AsyncStorage.getItem("language");
    let isFirst = await AsyncStorage.getItem("isFirst");
    let isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    let initScreen =
      isFirst !== "1" ? "Onboarding" : isLoggedIn !== "1" ? "Auth" : "App";
    if (!langID) this.setLanguage("en");
    this.setState({ lang: langID !== null ? langID : "en", initScreen });
    if (isFirst !== false) await AsyncStorage.setItem("isFirst", "1");
  }

  render() {
    const { initScreen, lang } = this.state;
    if (!lang || !initScreen) return null;

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initScreen} lazy={false}>
          <Stack.Screen
            name="Onboarding"
            component={OnboardingStack}
            initialParams={{ lang, setLanguage: this.setLanguage }}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            initialParams={{ lang, setLanguage: this.setLanguage }}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="App"
            component={AppStack}
            initialParams={{ lang, setLanguage: this.setLanguage }}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigation;

import React from "react";
import { AppLoading } from "expo";
import store from "./Redux/Store";
import { Provider } from "react-redux";
import Navigation from "./Navigation";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

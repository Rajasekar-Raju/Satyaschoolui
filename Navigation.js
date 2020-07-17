import Onboarding from './screens/onboarding';
import Auth from './screens/auth';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';

const isFirst = false;

const OnBoardStack = createSwitchNavigator({
  Onboarding: Onboarding,
  Auth: Auth,
});

const AuthStack = createSwitchNavigator({
  Auth: Auth
});

const RootNavigator = createSwitchNavigator(!isFirst ? {OnBoardStack} : {AuthStack});

export default createAppContainer(RootNavigator);

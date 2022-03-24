/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              Feed: 'feed',
              Profiles: 'profiles',
              AddTweet: 'add-tweet'
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
          TabThree: {
            screens: {
              TabTwoScreen: 'three',
            },
          },
          TabFour: {
            screens: {
              TabTwoScreen: 'four',
            },
          },
          TabFive: {
            screens: {
              TabTwoScreen: 'five',
            },
          },
        },
      },
      Modal: 'modal',
      Login: 'login',
      NotFound: '*',
    },
  },
};

export default linking;

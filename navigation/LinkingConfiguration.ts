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
              Hashtag: 'hashtag',
              AddTweet: 'add-tweet',
              Followers: 'followers',
              Followees: 'followees'
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
      Registration: 'registration',
      NotFound: '*',
    },
  },
};

export default linking;

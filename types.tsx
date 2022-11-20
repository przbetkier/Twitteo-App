import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Login: undefined;
  Registration: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeParamList> | undefined;
  TabTwo: undefined;
  TabThree: undefined;
  Explore: NavigatorScreenParams<ExploreParamList> | undefined;
  TabFive: undefined;
};

export type HomeParamList = {
  Feed: undefined;
  Profiles: { displayName: string };
  Hashtag: { name: string };
  AddTweet: { replyTo: string | null };
  Tweet: { tweetId: string };
  Followers: { userId: string }
  Followees: { userId: string }
}

export type ExploreParamList = {
  ExploreMainScreen: undefined;
  MostLikedTweetsScreen: undefined;
  MostDiscussedTweetsScreen: undefined;
  MostFollowedUsersScreen: undefined;
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type HomeStackScreenProps<Screen extends keyof HomeParamList> = NativeStackScreenProps<
    HomeParamList,
    Screen
    >;

export type ExploreStackScreenProps<Screen extends keyof ExploreParamList> = NativeStackScreenProps<
    ExploreParamList,
    Screen
    >;

import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ExploreMainScreen} from "../components/explore/ExploreMainScreen";
import {MostLikedTweetsScreen} from "../components/explore/MostLikedTweetsScreen";
import {MostFollowedUsersScreen} from "../components/explore/MostFollowedUsersScreen";
import {MostDiscussedTweetsScreen} from "../components/explore/MostDiscussedTweetsScreen";
import {LikedByPeopleYouFollowScreen} from "../components/explore/LikedByPeopleYouFollowScreen";
import {PeopleYouMayKnowScreen} from "../components/explore/PeopleYouMayKnowScreen";

export const ExploreScreen: React.FC = ({}) => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="explore"
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name="explore"
                    component={ExploreMainScreen}
                    options={{
                        title: 'Explore'
                    }}
                />
                <Stack.Screen
                    name="MostLikedTweetsScreen"
                    component={MostLikedTweetsScreen}
                    options={{
                        title: 'Most liked tweets'
                    }}
                />
                <Stack.Screen
                    name="MostDiscussedTweetsScreen"
                    component={MostDiscussedTweetsScreen}
                    options={{
                        title: 'Most discussed tweets'
                    }}
                />
                <Stack.Screen
                    name="MostFollowedUsersScreen"
                    component={MostFollowedUsersScreen}
                    options={{
                        title: 'Most followed users'
                    }}
                />

                {/*Recommendations*/}

                <Stack.Screen
                    name="PeopleYouMayKnowScreen"
                    component={PeopleYouMayKnowScreen}
                    options={{
                        title: 'People you may know'
                    }}
                />

                <Stack.Screen
                    name="LikedByPeopleYouFollowScreen"
                    component={LikedByPeopleYouFollowScreen}
                    options={{
                        title: 'Liked by people you follow'
                    }}
                />

            </Stack.Group>

        </Stack.Navigator>
    )
}

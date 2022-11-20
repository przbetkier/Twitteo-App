import {HomeStackScreenProps} from "../../types";
import React, {useEffect, useState} from "react";
import {gerUserProfileByDisplayName} from "../../networking/api";
import {View, Text} from "../Themed";
import {ActivityIndicator, Flex} from "@ant-design/react-native";
import ProfileTweets from "./ProfileTweets";
import {getPageSidePadding, getWidth} from "../../utils/screen";
import {Ionicons} from '@expo/vector-icons';

export interface UserResponse {
    userId: string,
    displayName: string,
    followers: number,
    follows: number,
    bio: string,
    avatarUrl: string | null
}

export default function Profile({navigation, route}: HomeStackScreenProps<'Profiles'>) {

    const {displayName} = route.params;
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserResponse | null>(null)
    const [error, setError] = useState<Error | null>(null)

    const loadProfile = React.useCallback(() => {
        setLoading(true);
        gerUserProfileByDisplayName(displayName)
            .then(data => {
                const response = data as UserResponse;
                setUser(response)
            })
            .catch((e) => {
                setError(e)
            })
            .finally(() => setLoading(false));
    }, [displayName]);

    useEffect(() => {
        loadProfile()
    }, [displayName])

    return (
        <>
            {loading ? (<ActivityIndicator/>) : (
                <View style={{flex: 1, alignItems: "center"}}>
                    <View style={
                        {
                            flex: 1,
                            alignItems: "stretch",
                            justifyContent: "center",
                            paddingTop: 12,
                            paddingBottom: 12,
                            paddingLeft: getPageSidePadding(),
                            paddingRight: getPageSidePadding(),
                            maxWidth: 1200,
                            width: getWidth()
                        }
                    }>
                        {user && (
                            <ProfileTweets
                                navigation={navigation} user={user}
                            />
                        )}


                        {error && (
                            <Flex justify={"center"}>
                                <Flex direction={"column"} justify={"around"} style={{height: 200}}>
                                    <Ionicons name="ios-skull-outline" size={100} color="darkgray"/>
                                    <Text>User not found!</Text>
                                </Flex>
                            </Flex>
                        )}

                    </View>
                </View>
            )}
        </>
    );
}

import {HomeStackScreenProps} from "../../types";
import React, {useEffect, useState} from "react";
import {gerUserProfileByDisplayName} from "../../networking/api";
import {View} from "../Themed";
import {ActivityIndicator} from "@ant-design/react-native";
import ProfileTweets from "./ProfileTweets";

export interface UserResponse {
    userId: string,
    displayName: string,
    followers: number,
    follows: number,
    bio: string
}

export default function Profile({navigation, route}: HomeStackScreenProps<'Profiles'>) {

    const {displayName} = route.params;
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserResponse | null>(null)


    const loadProfile = React.useCallback(() => {
        setLoading(true);
        gerUserProfileByDisplayName(displayName)
            .then(data => {
                const response = data as UserResponse;
                setUser(response)
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
                            maxWidth: 1200,
                        }
                    }>
                        {user && (
                            <ProfileTweets navigation={navigation} user={user}></ProfileTweets>
                        )}

                    </View>
                </View>
            )}
        </>
    );
}

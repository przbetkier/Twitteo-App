import {HomeStackScreenProps} from "../../types";
import React, {useEffect, useState} from "react";
import {gerUserProfile} from "../../networking/api";
import {Text, useThemeColor, View} from "../Themed";
import {ActivityIndicator, Card, Flex, WhiteSpace} from "@ant-design/react-native";
import {BoldText, ItalicText} from "../StyledText";
import ProfileTweets from "./ProfileTweets";
import {Dimensions} from "react-native";

export interface UserResponse {
    userId: string,
    displayName: string,
    followers: number,
    follows: number,
    bio: string
}

export default function Profile({navigation, route}: HomeStackScreenProps<'Profiles'>) {

    const {userId} = route.params;
    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background")
    const borderColor = useThemeColor({light: 'black', dark: ''}, "background")
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserResponse | null>(null)


    const loadProfile = React.useCallback(() => {
        setLoading(true);
        gerUserProfile(userId)
            .then(data => {
                const response = data as UserResponse;
                setUser(response)
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadProfile()
    }, [userId])

    return (
        <>
            {loading ? (<ActivityIndicator/>) : (
                <View style={{flex: 1, justifyContent: "center"}}>
                    <View style={
                        {
                            flex: 1,
                            alignItems: "stretch",
                            justifyContent: "center",
                            paddingTop: 12,
                            paddingBottom: 12,
                            paddingLeft: Dimensions.get('window').width > 800 ? "25%" : 8,
                            paddingRight: Dimensions.get('window').width > 800 ? "25%" : 8
                        }
                    }>
                        <Card
                            style={
                                {
                                    padding: 8,
                                    marginBottom: 8,
                                    backgroundColor: bgColor,
                                    borderColor: borderColor
                                }
                            }
                        >
                            <Card.Header
                                title={<Text style={{fontSize: 20, marginLeft: 18}}>{user?.displayName}</Text>}
                                thumbStyle={{width: 60, height: 60, borderRadius: 50}}
                                thumb={`https://i.pravatar.cc/150?u=${userId}`}>

                            </Card.Header>
                            <Card.Body style={{padding: 10}}>
                                <Text>Bio:</Text>
                                <ItalicText>{user?.bio}</ItalicText>

                                <WhiteSpace/>

                                <Flex justify={"around"}>
                                    <Flex>
                                        <BoldText style={{paddingRight: 8}}>{user?.follows}</BoldText>
                                        <Text>following</Text>
                                    </Flex>
                                    <Flex>
                                        <BoldText style={{paddingRight: 8}}>{user?.followers}</BoldText>
                                        <Text>followers</Text>
                                    </Flex>
                                </Flex>
                            </Card.Body>
                        </Card>

                        <ProfileTweets userId={user?.userId ?? ""} navigation={navigation}></ProfileTweets>
                    </View>
                </View>
            )}
        </>
    );
}

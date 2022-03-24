import {HomeStackScreenProps} from "../types";
import React, {useEffect, useState} from "react";
import {gerUserProfile} from "../networking/api";
import {Text, View} from "./Themed";
import {ActivityIndicator, Card, Flex, WhiteSpace} from "@ant-design/react-native";
import {BoldText, ItalicText} from "./StyledText";

export interface UserResponse {
    userId: string,
    displayName: string,
    followers: number,
    follows: number,
    bio: string
}

export default function Profile({navigation, route}: HomeStackScreenProps<'Profiles'>) {

    const {userId} = route.params;
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
                <View>
                    <Card>
                        <Card.Header
                            title={user?.displayName}
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
                </View>)}
        </>
    );
}

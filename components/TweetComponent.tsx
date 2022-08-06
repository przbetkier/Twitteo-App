import {Tweet} from "./Feed";
import {Text, useThemeColor} from "./Themed"
import {Card, Flex, WhiteSpace} from "@ant-design/react-native";
import {formatDate} from "../utils/date-util";
import {tintColorLight} from "../constants/Colors";
import {Linking, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import ParsedText from "react-native-parsed-text";
import {useNavigation} from '@react-navigation/native';

export interface TweetProps {
    tweet: Tweet;
}

export const TweetComponent: React.FC<TweetProps> = ({tweet}) => {
    const navigation = useNavigation();

    const handleOriginalPosterClicked = (userName: string) => {
        navigation.navigate('Root', {
            screen: "Home",
            params: {
                screen: "Profiles",
                params: {
                    displayName: userName
                }
            }
        });
    }

    const handleLinkClicked = (link: string) => {
        Linking
            .openURL(link)
            .catch(err => console.error('Error', err));
    }

    return (
        <>
            <Card
                style={
                    {
                        padding: 8,
                        backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
                        borderColor: useThemeColor({light: 'gray', dark: ''}, "background"),
                    }
                }
            >
                <Card.Header
                    title={
                        <Flex justify={"between"}>
                            <TouchableOpacity onPress={() => handleOriginalPosterClicked(tweet.userName)}>
                                <Text style={{color: `${tintColorLight}`}}>{'@' + tweet.userName}</Text>
                            </TouchableOpacity>
                            <Text>{formatDate(tweet.createdAt)}</Text>
                        </Flex>
                    }
                    thumbStyle={{width: 35, height: 35, borderRadius: 35}}
                    thumb={`https://i.pravatar.cc/150?u=${tweet.userId}`}
                />
                <Card.Body>
                    <ParsedText
                        style={{marginLeft: 16, color: useThemeColor({light: 'black', dark: 'white'}, "text")}}
                        parse={
                            [
                                {
                                    type: 'url', style: styles.url, onPress: (url) => {
                                        handleLinkClicked(url)
                                    }
                                },
                                {
                                    pattern: /\B@\S+\b/, style: styles.username, onPress: (username) => {
                                        navigation.navigate('Root', {
                                            screen: "Home",
                                            params: {
                                                screen: "Profiles",
                                                params: {
                                                    displayName: username.substring(1) // FIXME handle screens by displayname!
                                                }
                                            }
                                        });
                                    }
                                },
                                {
                                    pattern: /#(\w+)/, style: styles.hashTag, onPress: (hashtag) => {
                                        navigation.navigate('Root', {
                                            screen: "Home",
                                            params: {
                                                screen: "Hashtag",
                                                params: {
                                                    name: hashtag.substring(1)
                                                }
                                            }
                                        });
                                    }
                                },
                            ]
                        }
                        childrenProps={{allowFontScaling: false}}
                    >
                        {tweet.content}
                    </ParsedText>
                </Card.Body>
            </Card>
            <WhiteSpace/>
        </>
    )
}

const styles = StyleSheet.create({
    url: {
        color: tintColorLight,
        textDecorationLine: 'underline',
    },
    username: {
        color: tintColorLight,
    },

    hashTag: {
        color: tintColorLight,
    }
});

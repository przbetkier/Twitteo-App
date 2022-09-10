import {Tweet} from "./Feed";
import {Text, useThemeColor} from "./Themed"
import {Card, Flex, SwipeAction, Toast, WhiteSpace} from "@ant-design/react-native";
import {formatDate} from "../utils/date-util";
import {tintColorLight} from "../constants/Colors";
import {Animated, Linking, StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import ParsedText from "react-native-parsed-text";
import {useNavigation} from '@react-navigation/native';
import {FontAwesome} from "@expo/vector-icons";
import {deleteTweet, getUser} from "../networking/api";

export interface TweetProps {
    tweet: Tweet;
    deletionDisabled?: boolean,
    onTweetDeleted: (tweet: Tweet) => void;
}

export const TweetComponent: React.FC<TweetProps> = ({tweet, deletionDisabled, onTweetDeleted}) => {

    const [currentUserId, setCurrentUserId] = useState();

    useEffect(() => {
        getUser().then((user) => {
           setCurrentUserId(user.uid);
        });
    }, []);

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

    const handleDelete = (progressAnimatedValue: Animated.AnimatedInterpolation, dragAnimatedValue: Animated.AnimatedInterpolation) => {

        if (tweet.userId === currentUserId && !deletionDisabled) {
            return (
                <View
                    style={{
                        margin: 0,
                        alignContent: 'center',
                        backgroundColor: 'red',
                        justifyContent: 'center',
                        width: '25%',
                        maxWidth: 300,
                    }}
                >
                    <FontAwesome name={"trash"} color={"white"} size={36} style={{textAlign: "center"}}
                                 onPress={handleTweetDeleted}></FontAwesome>
                </View>
            );
        } else return (<View></View>)
    };

    const handleTweetDeleted = () => {
        deleteTweet(tweet.id)
            .then(() => {
                onTweetDeleted(tweet);

                Toast.success({
                    duration: 2,
                    content: "Tweet successfully deleted!",
                });
            }
        )
            .catch((e) => {
                console.log(`Error occurred: ${e}`)
            })
    }

    return (
        <>
            <SwipeAction renderRightActions={handleDelete}>
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
                            style={{marginLeft: 2, color: useThemeColor({light: 'black', dark: 'white'}, "text")}}
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
                            childrenProps={{allowFontScaling: true}}
                        >
                            {tweet.content}
                        </ParsedText>
                    </Card.Body>
                </Card>
            </SwipeAction>
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

import {Tweet} from "./Feed";
import {Text, useThemeColor} from "./Themed"
import {Card, Flex, SwipeAction, Toast, WhiteSpace} from "@ant-design/react-native";
import {formatDate} from "../utils/date-util";
import moment from "moment";
import {tintColorLight} from "../constants/Colors";
import {
    ActivityIndicator,
    Animated,
    Image,
    Linking,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import React, {useEffect, useState} from "react";
import ParsedText from "react-native-parsed-text";
import {useNavigation} from '@react-navigation/native';
import {FontAwesome} from "@expo/vector-icons";
import {API_URL, deleteTweet, getUser, updateTweet} from "../networking/api";
import {TweetFooter} from "./TweetFooter";
import {TweetEditForm} from "./TweetEdit";

type TweetMode = "READ" | "EDIT"

export interface TweetProps {
    tweet: Tweet;
    deletionDisabled?: boolean,
    onTweetDeleted: (tweet: Tweet) => void;
}

export const TweetComponent: React.FC<TweetProps> = ({tweet, deletionDisabled, onTweetDeleted}) => {

    const [currentUserId, setCurrentUserId] = useState();
    const [mode, setMode] = useState<TweetMode>('READ')

    const swipeActionRef = React.createRef<SwipeAction>();
    const [post, setPost] = useState(tweet)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getUser().then((user) => {
            setCurrentUserId(user.uid);
        });
    }, []);

    const navigation = useNavigation();

    const isEditPossible = () => {
        const minutesSincePosted = moment.duration(moment(new Date()).diff(post.createdAt)).asMinutes()
        return minutesSincePosted < 5
    }

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

        if (post.userId === currentUserId && !deletionDisabled) {
            return (
                <View
                    style={{
                        margin: 0,
                        justifyContent: 'center',
                        backgroundColor: 'red',
                        alignItems: 'center',
                        width: '25%',
                        maxWidth: 300,
                    }}
                >
                    <FontAwesome name={"trash"}
                                 color={"white"}
                                 size={36}
                                 onPress={handleTweetDeleted}
                    />
                    <Text style={{color: "white"}}>Delete</Text>
                </View>
            );
        } else return (<View></View>)
    };

    const handleEdit = (progressAnimatedValue: Animated.AnimatedInterpolation, dragAnimatedValue: Animated.AnimatedInterpolation) => {

        if (post.userId === currentUserId && !deletionDisabled && isEditPossible()) {
            return (
                <View
                    style={{
                        margin: 0,
                        justifyContent: 'center',
                        backgroundColor: tintColorLight,
                        alignItems: 'center',
                        width: '25%',
                        maxWidth: 300,
                    }}
                >
                    <FontAwesome name={"edit"}
                                 color={"white"}
                                 size={36}
                                 onPress={() => {
                                     swipeActionRef?.current?.close();
                                     setMode("EDIT");
                                 }}
                    />
                    <Text style={{color: "white"}}>Edit</Text>
                </View>
            );
        } else return (<View></View>)
    };

    const handleEditionSubmitted = (txt: string) => {
        setMode('READ');
        setLoading(true)
        updateTweet({tweetId: post.id, content: txt})
            .then(resp => {
                setPost(resp)
            })
            .catch(e => {
                console.log(e)
            })
            .finally(() => setLoading(false))
    }

    const handleEditionCancelled = () => {
        setMode('READ');
    }

    const handleTweetDeleted = () => {
        swipeActionRef?.current?.close();
        setLoading(true)
        deleteTweet(post.id)
            .then(() => {
                    onTweetDeleted(post);

                    Toast.success({
                        duration: 0.5,
                        content: "Tweet successfully deleted!",
                        mask: false
                    });
                }
            )
            .catch((e) => {
                console.log(`Error occurred: ${e}`)
            })
            .finally(() => setLoading(false))
    }

    return (
        <View>
            <SwipeAction
                key={`${post.id}-swipe`}
                ref={swipeActionRef} renderRightActions={handleDelete} renderLeftActions={handleEdit}
                containerStyle={{padding: 0}}
            >
                <Card
                    style={
                        {
                            padding: 8,
                            backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
                            borderColor: useThemeColor({light: 'lightgray', dark: ''}, "background"),
                            borderWidth: 0.5
                        }
                    }
                >
                    <Card.Header
                        style={{marginLeft: 0}}
                        title={
                            <Flex justify={"between"}>
                                <TouchableOpacity onPress={() => handleOriginalPosterClicked(post.userName)}>
                                    <Text style={{color: `${tintColorLight}`}}>{'@' + post.userName}</Text>
                                </TouchableOpacity>
                                <Text>{formatDate(post.createdAt)}</Text>
                            </Flex>
                        }
                        thumbStyle={{width: 35, height: 35, borderRadius: 35}}
                        thumb={(post.avatarUrl !== "") ? post.avatarUrl : `https://i.pravatar.cc/150?u=${post.userId}`}
                    />
                    <Card.Body>
                        {loading && (<ActivityIndicator size="small"/>)}
                        <View>
                            <ParsedText
                                style={{
                                    marginLeft: 2,
                                    display: mode === "READ" ? "flex" : "none",
                                    color: useThemeColor({light: 'black', dark: 'white'}, "text")
                                }}
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
                                {post.content}

                            </ParsedText>

                            {mode === 'EDIT' && (
                                <TweetEditForm tweet={post}
                                               onEditionSubmitted={(txt: string) => {
                                                   handleEditionSubmitted(txt)
                                               }}
                                               onEditionCancelled={handleEditionCancelled}
                                />
                            )}
                        </View>

                        <View style={{marginTop: 8}}>
                            {post.attachments.map(image => (

                                <Image
                                    key={`image-${image}`}
                                    style={{
                                        alignSelf: 'center',
                                        height: 200,
                                        width: '100%'
                                    }}
                                    source={{uri: `${API_URL}/attachments/${image}`}}

                                    resizeMode={"contain"}
                                >
                                </Image>
                            ))}
                        </View>
                        <TweetFooter tweetId={post.id} edited={post.edited}/>
                    </Card.Body>
                </Card>
            </SwipeAction>
            <WhiteSpace/>
        </View>
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
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        position: "absolute",
        right: 10,
        top: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "red"
    }
});

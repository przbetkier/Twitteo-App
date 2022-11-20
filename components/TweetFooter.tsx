import React, {useState} from "react";
import {Text} from "./Themed";
import {FontAwesome, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {tintColorLight} from "../constants/Colors";
import {getTweetLikeState, likeTweet, TweetLikeState, TweetLikeStateResponse} from "../networking/api";
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {Flex} from "@ant-design/react-native";
import {TweetReplies} from "./TweetReplies";

export interface TweetFooterProps {
    tweetId: string;
    edited: boolean;
}

export const TweetFooter: React.FC<TweetFooterProps> = ({tweetId, edited}) => {

    const [likes, setLikes] = useState(0)
    const [replies, setReplies] = useState(0)
    const [loading, setLoading] = useState(true)
    const [likeState, setLikeState] = useState<TweetLikeState>(TweetLikeState.CAN_LIKE)

    const [isRepliesSectionVisible, setIsRepliesSectionVisible] = useState(false);

    const loadStats = async () => {
        await getTweetLikeState(tweetId)
            .then(res => handleLikeStateResponse(res))
            .finally(() => setLoading(false))
    }

    useState(() => {
        loadStats().then()
    })

    const refreshStats = async () => {
        await loadStats()
    }

    const iconName = () => {
        return likeState === TweetLikeState.CAN_LIKE ? "heart-o" : "heart";
    }

    const handleLikeStateResponse = (response: TweetLikeStateResponse) => {
        setLikes(response.likes)
        setLikeState(response.state)
        setReplies(response.replies)
    }

    const handleLikeResponse = (response: TweetLikeStateResponse, liked: boolean) => {
        setLikes(response.likes)
        liked ? setLikeState(TweetLikeState.CAN_UNLIKE) : setLikeState(TweetLikeState.CAN_LIKE)
    }

    const handleLikeIconClicked = () => {
        let canLike = (likeState === TweetLikeState.CAN_LIKE)
        setLoading(true)
        likeTweet(tweetId, canLike)
            .then(res => {
                handleLikeResponse(res, canLike)
                setLoading(false)
            })
    }

    const toggleReplies = () => {
        setIsRepliesSectionVisible(!isRepliesSectionVisible);
    }

    return (
        <View style={{borderTopWidth: 0.5, borderColor: "darkgray"}}>
            <View style={{marginTop: 8, paddingLeft: 8, justifyContent: "space-between", flexDirection: "row"}}>
                {loading && (<ActivityIndicator/>)}
                {!loading && (
                    <Flex justify={"start"} style={{minWidth: "50%"}}>
                        <TouchableOpacity onPress={handleLikeIconClicked}>
                            <Flex direction={"row"} style={{paddingRight: 16}}>
                                <FontAwesome name={iconName()}
                                             size={24}
                                             color={"#B01E28"}
                                />
                                <Text style={{paddingLeft: 8}}>{likes}</Text>
                            </Flex>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleReplies}>
                            <Flex direction={"row"}>
                                <MaterialCommunityIcons
                                    name="message-text-outline"
                                    size={24} color={tintColorLight}
                                />
                                <Text style={{paddingLeft: 8}}>{replies}</Text>
                            </Flex>
                        </TouchableOpacity>
                    </Flex>
                )
                }
                <Text>
                    {edited && (
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                            <Text style={{fontStyle: "italic", color: "gray"}}>
                                Edited
                            </Text>
                            <MaterialIcons
                                name="published-with-changes" size={20}
                                color="orange"
                                style={{paddingLeft: 8}}
                            />
                        </View>
                    )}
                </Text>
            </View>

            {isRepliesSectionVisible &&
                (
                    <Flex style={{marginTop: 8}}>
                        <TweetReplies tweetId={tweetId} onRepliesChanged={refreshStats}/>
                    </Flex>
                )
            }

        </View>
    )
}

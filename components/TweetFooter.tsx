import React, {useState} from "react";
import {Text} from "./Themed";
import {FontAwesome} from "@expo/vector-icons";
import {tintColorLight} from "../constants/Colors";
import {getTweetLikeState, likeTweet, TweetLikeState, TweetLikeStateResponse} from "../networking/api";
import {ActivityIndicator, View} from "react-native";
import {MaterialIcons} from '@expo/vector-icons';


export interface TweetFooterProps {
    tweetId: string;
    edited: boolean;
}

export const TweetFooter: React.FC<TweetFooterProps> = ({tweetId, edited}) => {

    const [likes, setLikes] = useState(0)
    const [loading, setLoading] = useState(true)
    const [likeState, setLikeState] = useState<TweetLikeState>(TweetLikeState.CAN_LIKE)

    useState(() => {
        getTweetLikeState(tweetId)
            .then(res => handleLikeStateResponse(res))
            .finally(() => setLoading(false))
    })

    const iconName = () => {
        return likeState === TweetLikeState.CAN_LIKE ? "heart-o" : "heart";
    }

    const handleLikeStateResponse = (response: TweetLikeStateResponse) => {
        setLikes(response.likes)
        setLikeState(response.state)
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

    return (
        <View style={{borderTopWidth: 0.5, borderColor: "lightgray"}}>
            <View style={{marginTop: 8, justifyContent: "space-between", flexDirection: "row"}}>
                {loading && (<ActivityIndicator/>)}
                {!loading && (<View style={{display: "flex", flexDirection: "row"}}>
                    <FontAwesome name={iconName()}
                                 size={16}
                                 color={tintColorLight}
                                 onPress={handleLikeIconClicked}
                    />
                    <Text style={{paddingLeft: 8}}>{likes}</Text>
                </View>)
                }
                <Text>
                    {edited && (
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                            <Text style={{fontStyle: "italic", color: "gray"}}>
                                Edited
                            </Text>
                            <MaterialIcons name="published-with-changes" size={20} color="orange"
                                           style={{paddingLeft: 8}}/>
                        </View>
                    )}
                </Text>
            </View>

        </View>
    )
}

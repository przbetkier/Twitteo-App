import React, {useState} from "react";
import {Text} from "./Themed";
import {FontAwesome} from "@expo/vector-icons";
import {tintColorLight} from "../constants/Colors";
import {getTweetLikeState, likeTweet, TweetLikeState, TweetLikeStateResponse} from "../networking/api";
import {ActivityIndicator, View} from "react-native";

export interface TweetFooterProps {
    tweetId: string;
}

export const TweetFooter: React.FC<TweetFooterProps> = ({tweetId}) => {

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
        if (likeState === TweetLikeState.CAN_LIKE) {
            likeTweet(tweetId, true).then(res => handleLikeResponse(res, true))
        } else {
            likeTweet(tweetId, false).then(res => handleLikeResponse(res, false))
        }
    }

    return (
        <View style={{marginTop: 12, borderTopWidth: 0.5, borderColor: "lightgray", padding: 8}}>
            {loading ? <ActivityIndicator/> : (
                <>
                    <Text><FontAwesome name={iconName()} size={16} color={tintColorLight}
                                       onPress={handleLikeIconClicked}/> {likes} </Text>
                </>
            )}

        </View>
    )
}

import React, {useEffect, useState} from "react";
import {View} from "../Themed";
import {Tweet} from "../Feed";
import {getLikedByPeopleYouFollow, getRecommendedUsers} from "../../networking/recommendations-api";
import {TweetComponent} from "../TweetComponent";
import {Flex, WhiteSpace} from "@ant-design/react-native";
import {ActivityIndicator, FlatList, RefreshControl} from "react-native";
import {getPageSidePadding, getWidth} from "../../utils/screen";

export const LikedByPeopleYouFollowScreen: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [tweets, setTweets] = useState<Tweet[]>([])

    const loadTweets = () => {
        setLoading(true)
        getLikedByPeopleYouFollow()
            .then(response => {
                setTweets(response)
            })
            .finally(() => setLoading(false))

        getRecommendedUsers()
            .then(res => console.log(res))
    }


    useEffect(() => {
        loadTweets()
    }, [])

    const renderTweet = (tweet: Tweet) =>
        (<TweetComponent
                key={`tweet-${tweet.id}`}
                tweet={tweet}
                onTweetDeleted={() => {
                }}
                deletionDisabled={true}/>
        )

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <Flex justify={"center"} direction={"row"} style={{marginBottom: 8, marginTop: 8}}>

            </Flex>

            {loading ? (
                <ActivityIndicator/>
            ) : (
                <View style={
                    {
                        flex: 1,
                        alignItems: "stretch",
                        justifyContent: "center",
                        paddingBottom: 12,
                        paddingLeft: getPageSidePadding(),
                        paddingRight: getPageSidePadding(),
                        maxWidth: 1200,
                        width: getWidth()
                    }
                }>
                    <FlatList
                        data={tweets}
                        renderItem={({item}) => renderTweet(item)}
                        ItemSeparatorComponent={() =>
                            <WhiteSpace size={"lg"}/>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={loadTweets}
                            />
                        }
                    />
                </View>
            )}
        </View>
    )
}

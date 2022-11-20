import React, {useEffect, useState} from "react";
import {Text, View} from "../Themed";
import {ActivityIndicator, FlatList, RefreshControl} from "react-native";
import {getMostLikedTweets} from "../../networking/trending-api";
import {Tweet} from "../Feed";
import {TweetComponent} from "../TweetComponent";
import {getPageSidePadding, getWidth} from "../../utils/screen";
import {Flex, WhiteSpace} from "@ant-design/react-native";

export const MostLikedTweetsScreen: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [tweets, setTweets] = useState<Tweet[]>([])

    const loadMostLikedTweets = () => {
        setLoading(true)
        getMostLikedTweets().then(response => setTweets(response))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadMostLikedTweets()
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
                <Text>Most liked tweets in last 7 days</Text>
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
                                onRefresh={loadMostLikedTweets}
                            />
                        }
                    />
                </View>
            )}
        </View>
    )
}

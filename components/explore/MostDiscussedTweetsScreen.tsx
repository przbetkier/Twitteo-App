import React, {useEffect, useState} from "react";
import {Tweet} from "../Feed";
import {getMostDiscussedTweets} from "../../networking/trending-api";
import {TweetComponent} from "../TweetComponent";
import {Text, View} from "../Themed";
import {Flex, WhiteSpace} from "@ant-design/react-native";
import {ActivityIndicator, FlatList, RefreshControl} from "react-native";
import {getPageSidePadding, getWidth} from "../../utils/screen";

export const MostDiscussedTweetsScreen: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [tweets, setTweets] = useState<Tweet[]>([])

    const loadMostDiscussedTweets = () => {
        setLoading(true)
        getMostDiscussedTweets().then(response => setTweets(response))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadMostDiscussedTweets()
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
                <Text>Most discussed tweets in last 7 days</Text>
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
                                onRefresh={loadMostDiscussedTweets}
                            />
                        }
                    />
                </View>
            )}
        </View>
    )
}

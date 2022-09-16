import React, {useEffect, useState} from "react";
import {FlatList} from "react-native";
import {Button} from "@ant-design/react-native";
import {getFeed} from "../networking/api";
import {HomeStackScreenProps} from "../types";
import {View} from "./Themed";
import {FontAwesome} from "@expo/vector-icons";
import {TweetComponent} from "./TweetComponent";
import {getWidth} from "../utils/screen";

export interface Tweet {
    id: string;
    content: string;
    createdAt: Date;
    hashtags: string[];
    userId: string;
    userName: string;
    replies: number;
    attachments: number[];
}

export interface TweetPageResponse {
    tweets: Tweet[],
    total: number
}

export default function Feed({navigation}: HomeStackScreenProps<'Feed'>) {

    const [tweets, setTweets] = useState<Tweet[]>([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)

    const getTweets = async (page: number, refresh: boolean = false) => {
        const feed = await getFeed(page);
        const response = feed as TweetPageResponse;
        const responseTweets = response.tweets;
        refresh ? setTweets(responseTweets) : setTweets([...tweets, ...responseTweets])
        setLoading(false)
        setPage(page + 1);
    }

    useEffect(() => {
        getTweets(page).then();
        navigation.addListener('focus', () => refresh())
        return () => {
            // Remove on destroy
            navigation.removeListener('focus', () => {
            })
        }
    }, [])

    useEffect(() => {
    }, [tweets])

    const handleLoadMore = () => {
        getTweets(page).then()
    }

    const handleTweetDeleted = (tweet: Tweet) => {
        const tweetsFiltered = tweets.filter(t => t.id !== tweet.id)
        setTweets(tweetsFiltered)
    }

    const renderTweet = (tweet: Tweet) => (
        <TweetComponent key={`tweet-${tweet.id}`} tweet={tweet} onTweetDeleted={handleTweetDeleted}/>
    );

    function refresh() {
        getTweets(0, true).then();
    }

    return (
        <>
            <View style={{flex: 1, alignItems: "center"}}>
                <View style={
                    {
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 12,
                        paddingBottom: 12,
                        maxWidth: 1200,
                    }
                }>
                    <Button
                        type={"primary"} style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        zIndex: 12000,
                        height: 50,
                        borderRadius: 100
                    }}
                        onPress={() => navigation.navigate('AddTweet')}>
                        <FontAwesome size={24} name={"plus"}/>
                    </Button>
                    <FlatList
                        style={{minWidth: getWidth()}}
                        data={tweets}
                        refreshing={loading}
                        onRefresh={refresh}
                        renderItem={({item}) => renderTweet(item)}
                        keyExtractor={(item) => item.id}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0}
                    >
                    </FlatList>
                </View>
            </View>
        </>
    );
}


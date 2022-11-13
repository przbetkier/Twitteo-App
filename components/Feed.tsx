import React, {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, RefreshControl} from "react-native";
import {Button, WhiteSpace} from "@ant-design/react-native";
import {getFeed} from "../networking/api";
import {HomeStackScreenProps} from "../types";
import {Text, View} from "./Themed";
import {FontAwesome} from "@expo/vector-icons";
import {TweetComponent} from "./TweetComponent";
import {getPageSidePadding, getWidth} from "../utils/screen";

export interface Tweet {
    id: string;
    content: string;
    createdAt: Date;
    hashtags: string[];
    userId: string;
    userName: string;
    avatarUrl: string | null;
    replies: number;
    attachments: number[];
    edited: boolean;
}

export interface TweetPageResponse {
    tweets: Tweet[],
    total: number
}

export default function Feed({navigation}: HomeStackScreenProps<'Feed'>) {

    const [tweets, setTweets] = useState<Tweet[]>([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)
    const [total, setTotal] = useState(0)

    const getTweets = async (page: number, refresh: boolean = false) => {
        setLoading(true)
        const feed = await getFeed(page);
        const responseTweets = feed.tweets;
        refresh ? setTweets(responseTweets) : setTweets([...tweets, ...responseTweets])
        setTotal(feed.total)
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

    const handleLoadMore = () => {
        if (tweets.length < total) {
            getTweets(page).then()
        }
    }

    const handleTweetDeleted = (tweet: Tweet) => {
        const tweetsFiltered = tweets.filter(t => t.id !== tweet.id)
        setTweets(tweetsFiltered)
    }

    const renderTweet = (tweet: Tweet) => (
        <TweetComponent key={`tweet-${tweet.id}`} tweet={tweet} onTweetDeleted={handleTweetDeleted}/>
    );

    const refresh = () => {
        getTweets(0, true).then();
    }

    const clearRefresh = () => {
        setTweets([])
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
                        paddingLeft: getPageSidePadding(),
                        paddingRight: getPageSidePadding(),
                        maxWidth: 1200,
                        width: getWidth()
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
                        onPress={() => navigation.navigate('AddTweet', {replyTo: null})}>
                        <FontAwesome size={24} name={"plus"}/>
                    </Button>
                    <FlatList
                        ItemSeparatorComponent={() =>
                            <WhiteSpace size={"xl"}/>
                        }
                        ListEmptyComponent={
                            <>
                                {!loading && (
                                    <>
                                        <Text style={{textAlign: "center", fontSize: 20}}>
                                            Your feed is empty
                                        </Text>
                                        <Text style={{textAlign: "center", marginTop: 20}}>
                                            Add your first tweet or consider following your friends or hashtags that
                                            might
                                            be interesting for you.
                                        </Text>
                                    </>
                                )}
                                {loading && (
                                    <ActivityIndicator size={"small"}/>
                                )}
                            </>
                        }
                        style={{minWidth: getWidth()}}
                        data={tweets}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={clearRefresh}
                            />
                        }
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


import React, {useEffect, useState} from "react";
import {TweetComponent} from "./TweetComponent";
import {Dimensions, FlatList, RefreshControl} from "react-native";
import {Button} from "@ant-design/react-native";
import {getFeed} from "../networking/api";
import {HomeStackScreenProps} from "../types";
import {View} from "./Themed";
import TabBarIcon from "@react-navigation/bottom-tabs/lib/typescript/src/views/TabBarIcon";
import {FontAwesome} from "@expo/vector-icons";

export interface Tweet {
    id: string;
    content: string;
    createdAt: Date;
    hashtags: string[];
    userId: string;
    userName: string;
    replies: number;
}

export interface TweetPageResponse {
    tweets: Tweet[],
    total: number
}

export default function Feed({navigation, route}: HomeStackScreenProps<'Feed'>) {

    const [tweets, setTweets] = useState<Tweet[]>([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)

    const loadTweets = React.useCallback(() => {
        setLoading(true);
        getTweets(page)
    }, []);

    const getTweets = (page: number) => {
        getFeed(page)
            .then(data => {
                const response = data as TweetPageResponse;
                const responseTweets = response.tweets;
                setTweets([...tweets, ...responseTweets])
                setPage(page + 1)
            })
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        loadTweets()
        navigation.addListener('focus', () => refresh())

        return () => {
            // Remove on destroy
            navigation.removeListener('focus', () => {
            })
        }
    }, [])

    const handleLoadMore = () => {
        getTweets(page)
    }

    const renderTweet = (tweet: Tweet) => (
        <TweetComponent key={`${tweet.id}`} tweet={tweet}
                        onProfileClicked={
                            (userId => {
                                navigation.navigate('Profiles', {
                                    userId: userId
                                });
                            })
                        }
                        onHashtagClicked={
                            (hashtag => {
                                navigation.navigate('Hashtag', {
                                    name: hashtag
                                });
                            })
                        }
        />
    );

    const refresh = () => {
        setTweets([]);
        setPage(0);
        getTweets(0);
    }

    return (
        <>
            <View style={{flex: 1, justifyContent: "center"}}>
                <View style={
                    {
                        flex: 1,
                        alignItems: "stretch",
                        justifyContent: "center",
                        paddingTop: 12,
                        paddingBottom: 12,
                        paddingLeft: Dimensions.get('window').width > 800 ? "25%" : 8,
                        paddingRight: Dimensions.get('window').width > 800 ? "25%" : 8
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
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTweets}/>}
                        data={tweets}
                        refreshing={loading}
                        onRefresh={refresh}
                        renderItem={({item}) => renderTweet(item)}
                        keyExtractor={item => item.id}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0}
                    >
                    </FlatList>
                </View>
            </View>
        </>
    );
}


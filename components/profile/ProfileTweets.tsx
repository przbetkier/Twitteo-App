import React, {useEffect, useState} from "react";
import {Tweet} from "../Feed";
import {getUserPosts} from "../../networking/api";
import {FlatList, RefreshControl} from "react-native";
import {TweetComponent} from "../TweetComponent";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export interface ProfileTweetsProps {
    userId: string;
    navigation: NativeStackNavigationProp<any, any>
}

export default function ProfileTweets({userId, navigation}: ProfileTweetsProps) {

    const [tweets, setTweets] = useState<Tweet[]>([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)

    const refresh = () => {
        setTweets([]);
        setPage(0);
        getTweets(0);
    }

    useEffect(() => {
        loadTweets()
    }, [userId])

    const loadTweets = React.useCallback(() => {
        setLoading(true);
        getTweets(page)
    }, []);

    const getTweets = (page: number) => {
        getUserPosts(userId, page)
            .then(data => {
                const responseTweets = data as Tweet[];
                setTweets([...tweets, ...responseTweets])
                setPage(page + 1)
            })
            .catch((e) => {
                console.log(`Error occurred: ${e}`)
            })
            .finally(() => setLoading(false));
    }

    const renderTweet = (tweet: Tweet) => (
        <TweetComponent key={tweet.id} tweet={tweet}
                        onProfileClicked={
                            (() => {
                                // noop
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

    const handleLoadMore = () => {
        getTweets(page)
    }

    return (
        <>
            {!loading && (
                <FlatList
                    nestedScrollEnabled={false}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTweets}/>}
                    data={tweets}
                    refreshing={loading}
                    onRefresh={refresh}
                    renderItem={({item}) => renderTweet(item)}
                    keyExtractor={item => item.id}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.8}
                >
                </FlatList>
            )}
        </>
    )
}

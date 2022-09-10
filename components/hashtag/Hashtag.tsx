import {HomeStackScreenProps} from "../../types";
import {View} from "../Themed";
import React, {useEffect, useState} from "react";
import {Tweet} from "../Feed";
import {getHashtagPosts} from "../../networking/api";
import {TweetComponent} from "../TweetComponent";
import {FlatList, RefreshControl} from "react-native";

export default function Hashtag({navigation, route}: HomeStackScreenProps<'Hashtag'>) {

    const {name} = route.params;

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
    }, [name])

    const loadTweets = React.useCallback(() => {
        setLoading(true);
        getTweets(page)
    }, []);

    const getTweets = (page: number) => {
        getHashtagPosts(name, page)
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

    const handleTweetDeleted = (tweet: Tweet) => {
        const tweetsFiltered = tweets.filter(t => t.id !== tweet.id)
        setTweets(tweetsFiltered)
    }

    const renderTweet = (tweet: Tweet) => (
        <TweetComponent key={`${tweet.id + Date.now()}`} tweet={tweet} onTweetDeleted={handleTweetDeleted}/>
    );

    const handleLoadMore = () => {
        getTweets(page)
    }

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <View style={
                {
                    width: '100%',
                    maxWidth: 1200,
                    justifyContent: "center",
                    paddingTop: 12,
                    paddingBottom: 12,
                }
            }>


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
            </View>
        </View>
    )
}

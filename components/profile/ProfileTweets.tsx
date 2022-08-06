import React, {useEffect, useState} from "react";
import {Tweet} from "../Feed";
import {getUserPosts} from "../../networking/api";
import {FlatList, RefreshControl} from "react-native";
import {TweetComponent} from "../TweetComponent";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Text} from "../Themed";
import {ActivityIndicator} from "@ant-design/react-native";

export interface ProfileTweetsProps {
    userId: string;
    navigation: NativeStackNavigationProp<any, any>
}

export default function ProfileTweets({userId, navigation}: ProfileTweetsProps) {

    const [tweets, setTweets] = useState<Tweet[]>([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)

    const refresh = () => {
        setPage(0);
        getTweets(0, true).then();
    }

    useEffect(() => {
        getTweets(page, true).then();
    }, [userId])

    useEffect(() => {
    }, [tweets]);

    const loadTweets = React.useCallback(() => {
        setLoading(true);
        getTweets(page).then()
    }, []);

    const getTweets = async (page: number, refresh: boolean = false) => {
        const posts = await getUserPosts(userId, page)
        const responseTweets = posts as Tweet[];
        refresh ? setTweets(responseTweets) : setTweets([...tweets, ...responseTweets])
        setPage(page + 1)
        setLoading(false)
    }

    const renderTweet = (tweet: Tweet) => (
        <TweetComponent key={tweet.id} tweet={tweet}/>
    );

    const handleLoadMore = () => {
        getTweets(page).then();
    }

    const hasTweets = (): boolean => {
        return tweets.length > 0;
    }

    return (
        <>
            {loading && (<ActivityIndicator color={"gray"} size={"large"} /> )}
            {!loading && (
                <>
                {hasTweets() ? (
                    <FlatList
                        nestedScrollEnabled={false}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTweets}/>}
                        data={tweets}
                        refreshing={loading}
                        onRefresh={refresh}
                        renderItem={({item}) => renderTweet(item)}
                        keyExtractor={(item, index) => item.id+'key'+index}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.8}
                    >
                    </FlatList>
                ) : (
                    <>
                        <Text style={{textAlign: "center"}}>User has no tweets yet.</Text>
                    </>
                )}

                </>
            )}
        </>
    )
}

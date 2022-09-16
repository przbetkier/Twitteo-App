import React, {useEffect, useState} from "react";
import {Tweet} from "../Feed";
import {getUserPosts} from "../../networking/api";
import {FlatList, RefreshControl} from "react-native";
import {TweetComponent} from "../TweetComponent";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Text, View} from "../Themed";
import {ActivityIndicator} from "@ant-design/react-native";
import {UserResponse} from "./Profile";
import {Bio} from "./Bio";
import {getWidth} from "../../utils/screen";

export interface ProfileTweetsProps {
    user: UserResponse,
    navigation: NativeStackNavigationProp<any, any>
}

export default function ProfileTweets({user, navigation}: ProfileTweetsProps) {

    const [tweets, setTweets] = useState<Tweet[]>([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)

    const refresh = () => {
        setPage(0);
        getTweets(0, true).then();
    }

    useEffect(() => {
        getTweets(page, true).then();
    }, [user])

    useEffect(() => {
    }, [tweets]);

    const loadTweets = React.useCallback(() => {
        setLoading(true);
        getTweets(page).then()
    }, []);

    const getTweets = async (page: number, refresh: boolean = false) => {
        const posts = await getUserPosts(user.userId, page)
        const responseTweets = posts as Tweet[];
        refresh ? setTweets(responseTweets) : setTweets([...tweets, ...responseTweets])
        setPage(page + 1)
        setLoading(false)
    }

    const handleTweetDeleted = (tweet: Tweet) => {
        const tweetsFiltered = tweets.filter(t => t.id !== tweet.id)
        setTweets(tweetsFiltered)
    }

    const renderTweet = (tweet: Tweet) => (
        <TweetComponent key={tweet.id} tweet={tweet} onTweetDeleted={handleTweetDeleted}/>
    );

    const handleLoadMore = () => {
        getTweets(page).then();
    }


    return (
        <>
            {loading && (<ActivityIndicator color={"gray"} size={"large"}/>)}
            {!loading && (
                <FlatList
                    style={{minWidth: getWidth()}}
                    ListHeaderComponent={
                        <Bio user={user}/>
                    }
                    ListEmptyComponent={
                        <Text style={{textAlign: "center"}}>This user has no tweets right now.</Text>
                    }
                    stickyHeaderIndices={[0]}
                    nestedScrollEnabled={false}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTweets}/>}
                    data={tweets}
                    refreshing={loading}
                    onRefresh={refresh}
                    renderItem={({item}) => renderTweet(item)}
                    keyExtractor={(item, index) => item.id + 'key' + index}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.8}
                >
                </FlatList>
            )}
        </>
    )
}

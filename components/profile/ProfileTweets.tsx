import React, {useEffect, useState} from "react";
import {Tweet} from "../Feed";
import {getUserPosts} from "../../networking/api";
import {FlatList, RefreshControl, View} from "react-native";
import {TweetComponent} from "../TweetComponent";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Text} from "../Themed";
import {ActivityIndicator, Flex, WhiteSpace} from "@ant-design/react-native";
import {UserResponse} from "./Profile";
import {Bio} from "./Bio";
import {getWidth} from "../../utils/screen";
import {SimpleLineIcons} from '@expo/vector-icons';
import {tintColorLight} from "../../constants/Colors";

export interface ProfileTweetsProps {
    user: UserResponse,
    navigation: NativeStackNavigationProp<any, any>,
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
        <View style={{height: "100%"}}>
            {loading && (<ActivityIndicator color={"gray"} size={"large"}/>)}
            {!loading && (
                <FlatList
                    style={{minWidth: getWidth()}}
                    ListHeaderComponent={
                        <>
                            <Bio user={user}/>
                            <WhiteSpace size={"lg"}/>
                        </>
                    }
                    ItemSeparatorComponent={() =>
                        <WhiteSpace size={"xl"}/>
                    }
                    ListEmptyComponent={
                        <View style={{height: "100%"}}>
                            <Flex direction={"column"} justify={"center"} align={"center"}
                                  style={{height: "100%", maxHeight: "100%"}}>
                                <SimpleLineIcons name="ghost" size={100} color={tintColorLight}/>
                                <Flex direction={"column"} style={{maxWidth: 300}}>
                                    <Text style={{marginTop: 16, textAlign: "center"}}>Oooops! It looks like this
                                        user hasn't added any posts
                                        yet.</Text>
                                    <Text style={{marginTop: 16, textAlign: "center"}}>Nothing is lost! Follow him to
                                        see new posts as quickly as possible!</Text>
                                </Flex>

                            </Flex>
                        </View>
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
        </View>
    )
}

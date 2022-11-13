import React, {useEffect, useState} from "react";
import {Tweet} from "./Feed";
import {getReplies} from "../networking/api";
import {ActivityIndicator, FlatList} from "react-native";
import {TweetComponent} from "./TweetComponent";
import {useNavigation} from "@react-navigation/native";
import {Button} from "@ant-design/react-native";
import {Text, useThemeColor, View} from "./Themed";
import {tintColorLight} from "../constants/Colors";

export interface TweetRepliesProps {
    tweetId: string;
    onRepliesChanged: () => void;
}

export const TweetReplies: React.FC<TweetRepliesProps> = ({tweetId, onRepliesChanged}) => {

    const [replies, setReplies] = useState<Tweet[]>([])
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.addListener('focus', () => refresh())

        getReplies(tweetId).then(repliesPageResponse => setReplies(repliesPageResponse.tweets))
            .finally(() => setLoading(false))
        // FIXME: Page and increment

        return () => {
            // Remove listener on destroy
            navigation.removeListener('focus', () => {
            })
        }
    }, [])

    const refresh = () => {
        setLoading(true)
        getReplies(tweetId).then(repliesPageResponse => setReplies(repliesPageResponse.tweets))
            .then(() => onRepliesChanged())
            .finally(() => setLoading(false))
    }

    const handleTweetDeleted = (tweet: Tweet) => {
        const tweetsFiltered = replies.filter(t => t.id !== tweet.id)
        setReplies(tweetsFiltered)
        onRepliesChanged();
    }

    const renderTweet = (tweet: Tweet) => (
        <TweetComponent key={`tweet-${tweet.id}`} tweet={tweet} onTweetDeleted={handleTweetDeleted}/>
    );

    const navigateToReplyModal = () => {
        navigation.navigate('Root', {
            screen: "Home",
            params: {
                screen: "AddTweet",
                params: {
                    replyTo: tweetId
                }
            }
        });
    }

    return (
        <View style={{
            borderLeftWidth: 1,
            borderColor: "lightgray",
            width: "100%",
            paddingLeft: 12,
            backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background")
        }}>
            <Button
                size={"small"}
                style={{backgroundColor: tintColorLight, width: 60, alignItems: "center", borderWidth: 0}}
                onPress={navigateToReplyModal}>
                <Text style={{color: "white"}}>Reply</Text>
            </Button>
            <FlatList data={replies}
                      style={{marginTop: 16}}
                      ItemSeparatorComponent={() =>
                          <View style={{
                              marginLeft: 20,
                              height: 16,
                              borderLeftWidth: 1,
                              borderColor: "lightgray",
                              backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background")
                          }}>
                          </View>
                      }
                      ListEmptyComponent={
                          <>
                              {loading && (
                                  <ActivityIndicator size={"small"} style={{marginTop: 8}}/>
                              )}

                              {!loading && (
                                  <Text style={{marginTop: 8}}>There are no replies for this tweet.</Text>
                              )}
                          </>
                      }
                      renderItem={({item}) => renderTweet(item)}
            />
        </View>
    )
}

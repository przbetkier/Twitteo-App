import {HomeStackScreenProps} from "../types";
import {View} from "./Themed";
import {TweetComponent} from "./TweetComponent";
import {useEffect, useState} from "react";
import {getTweetById} from "../networking/api";
import {Tweet} from "./Feed";
import {getWidth} from "../utils/screen";
import {ScrollView} from "react-native";

export default function TweetScreen({navigation, route}: HomeStackScreenProps<'Tweet'>) {

    const tweetId = route.params?.tweetId;

    const [tweet, setTweet] = useState<Tweet>();

    useEffect(() => {
        getTweetById(tweetId).then((response) => setTweet(response))

    }, [tweetId]);

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <View style={
                {
                    flex: 1,
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                    paddingTop: 12,
                    paddingBottom: 12,
                    width: getWidth()
                }
            }>
                <ScrollView>
                    {tweet && (
                        <TweetComponent
                            tweet={tweet}
                            onTweetDeleted={
                                () => {
                                }
                            }
                        />
                    )}
                </ScrollView>
            </View>
        </View>
    )
}

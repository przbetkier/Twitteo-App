import {TextInput, View} from "react-native";
import {Button, Flex} from "@ant-design/react-native";
import React, {useState} from "react";
import {Tweet} from "./Feed";
import {useThemeColor} from "./Themed";

export interface TweetEditFormProps {
    tweet: Tweet;
    onEditionSubmitted: (tweetFormContent: string) => void;
    onEditionCancelled: () => void;
}

export const TweetEditForm: React.FC<TweetEditFormProps> = ({tweet, onEditionSubmitted, onEditionCancelled}) => {
    const [tweetFormText, setTweetFormText] = useState(tweet.content)
    const inputBgColor = useThemeColor({light: 'white', dark: '#181818'}, "background");
    const inputTextColor = useThemeColor({light: 'black', dark: 'white'}, "text");

    return (
        <View>
            <TextInput
                style={{color: inputTextColor, backgroundColor: inputBgColor, width: '100%', height: 60}}
                value={tweetFormText}
                onChangeText={(text) => setTweetFormText(text)}
                autoFocus
                multiline={true}
                autoCorrect={false}
            />
            <Flex direction={"row"} justify={"around"} style={{marginTop: 8}}>
                <Button
                    style={{width: '45%'}}
                    type={"primary"}
                    onPress={() => onEditionSubmitted(tweetFormText)}
                >
                    Update
                </Button>
                <Button
                    style={{width: '45%'}}
                    type={"warning"}
                    onPress={onEditionCancelled}
                >
                    Cancel
                </Button>
            </Flex>
        </View>
    )
}

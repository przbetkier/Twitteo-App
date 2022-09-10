import {HomeStackScreenProps} from "../types";
import {Text, useThemeColor, View} from "./Themed";
import {Button, Card, List} from "@ant-design/react-native";
import {useState} from "react";
import {Dimensions, Pressable, StyleSheet, TextInput} from "react-native";
import {postTweet} from "../networking/api";

export default function AddTweet({navigation, route}: HomeStackScreenProps<'AddTweet'>) {

    const [tweetContent, setTweetContent] = useState('');

    const [isPosting, setIsPosting] = useState(false);

    const handleTweetSubmitted = () => {
        setIsPosting(true);
        postTweet(tweetContent)
            .then(() => navigation.navigate('Feed'))
            .then(() => setIsPosting(false))
    }

    const styles = StyleSheet.create({
        input: {
            height: Dimensions.get('window').height / 4,
            backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
            padding: 10,
            color: useThemeColor({light: 'black', dark: 'white'}, "text")
        },
    });

    return (
        <View
            style={{
                backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
            }}
        >
            <Pressable style={{display: 'flex', flexDirection: 'row-reverse', padding: 10}}
                       onPress={() => navigation.goBack()}>
                <Text style={{color: 'red', padding: 8}}>Cancel</Text>
            </Pressable>
            <Card
                style={
                    {

                        padding: 8,
                        backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
                        borderColor: useThemeColor({light: 'gray', dark: ''}, "background"),
                    }
                }
            >
                <Card.Header title={<Text>Tweet anything you like</Text>}/>
                <Card.Body style={{padding: 10, backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background")}}>

                    <List>
                        <TextInput
                            style={styles.input}
                            value={tweetContent}
                            onChangeText={(text) => {
                                setTweetContent(text)
                            }}
                            multiline={true}
                            placeholder="What's on your mind?"
                            keyboardType="twitter"
                        />
                        <Button loading={isPosting} onPress={() => handleTweetSubmitted()}>Post</Button>
                    </List>
                </Card.Body>
            </Card>
        </View>
    )
}

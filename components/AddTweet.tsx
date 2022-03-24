import {HomeStackScreenProps} from "../types";
import {Text, View} from "./Themed";
import {Button, Card, List} from "@ant-design/react-native";
import {useState} from "react";
import {Dimensions, Pressable, StyleSheet, TextInput} from "react-native";
import {postTweet} from "../networking/api";

export default function AddTweet({navigation, route}: HomeStackScreenProps<'AddTweet'>) {

    const [tweetContent, setTweetContent] = useState('');
    const styles = StyleSheet.create({
        input: {
            height: Dimensions.get('window').height / 4,
            marginTop: 12,
            marginBottom: 12,
            padding: 10
        },
    });

    return (
        <View>
            <Pressable style={{display: 'flex', flexDirection: 'row-reverse', padding: 10}}
                       onPress={() => navigation.goBack()}>
                <Text style={{color: 'red', padding: 8}}>Cancel</Text>
            </Pressable>
            <Card>
                <Card.Header title={"Tweet anything you like"}/>
                <Card.Body style={{padding: 10}}>

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
                        <Button type={"primary"} style={{marginTop: 10}} onPress={() => postTweet(tweetContent).then(
                            () => {
                                navigation.navigate('Feed')
                            }
                        )}>Add</Button>
                    </List>
                </Card.Body>
            </Card>
        </View>
    )
}

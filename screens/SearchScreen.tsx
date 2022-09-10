import {Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import {Text, View} from '../components/Themed';
import React, {useState} from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {ActivityIndicator, Card, Flex} from "@ant-design/react-native";
import {search} from "../networking/api";
import {TweetComponent} from "../components/TweetComponent";
import {BoldText} from "../components/StyledText";
import {UserResponse} from "../components/profile/Profile";
import {Tweet} from "../components/Feed";
import {useNavigation} from "@react-navigation/native";

export interface SearchResult {
    users: UserResponse[],
    tweets: Tweet[]
}

export default function SearchScreen() {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false)
    const [searchResult, setSearchResult] = useState<SearchResult>()

    const colorScheme = useColorScheme();
    const searchBarTextColor = Colors[colorScheme].text;

    // TODO: Add debounce
    const handleInputChanged = (text: string) => {
        if (text.length >= 3) {
            refreshResults(text)
        }
    }

    const refreshResults = (query: string) => {
        setLoading(true)
        search(query).then((data) => {
                setSearchResult(data);
                setLoading(false)
            }
        )
    }

    const handleProfileClicked = (displayName: string) => {
        navigation.navigate('Root', {
            screen: "Home",
            params: {
                screen: "Profiles",
                params: {
                    displayName: displayName
                }
            }
        });
    }

    return (
        <View style={styles.container}>
            <View style={
                {
                    flex: 1,
                    alignItems: "stretch",
                    justifyContent: "center",
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: Dimensions.get('window').width > 800 ? "25%" : 8,
                    paddingRight: Dimensions.get('window').width > 800 ? "25%" : 8
                }
            }>

                <Text style={styles.title}>Search anything</Text>

                <TextInput
                    style={[{color: searchBarTextColor}, styles.searchbar]}

                    onChangeText={(text) => handleInputChanged(text)}
                    placeholder={"What are you looking for?"}
                >
                </TextInput>


                <ScrollView style={{marginTop: 8}}>
                    {loading ? (
                        <View>
                            <ActivityIndicator/>
                        </View>
                    ) : (
                        <View>
                            {searchResult && searchResult.users.length > 0 && (
                                <View>
                                    <Text style={styles.title}>Users</Text>
                                    {
                                        searchResult.users.map(user =>
                                            <TouchableOpacity
                                                onPress={() => handleProfileClicked(user?.displayName ?? "")}
                                                key={`${user.userId}`}
                                            >
                                                <Card
                                                    style={
                                                        {
                                                            padding: 8,
                                                            marginBottom: 8,
                                                            backgroundColor: Colors[colorScheme].background,
                                                            borderColor: Colors[colorScheme].text
                                                        }
                                                    }
                                                >
                                                    <Card.Header
                                                        title={
                                                            <>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        marginLeft: 18
                                                                    }}>{user?.displayName}
                                                                </Text>
                                                                <Flex style={{marginLeft: 18}}>
                                                                    <BoldText
                                                                        style={{paddingRight: 4}}>{user?.followers}</BoldText>
                                                                    <Text>followers</Text>
                                                                </Flex>
                                                            </>

                                                        }
                                                        thumbStyle={{width: 40, height: 40, borderRadius: 50}}
                                                        thumb={`https://i.pravatar.cc/150?u=${user.userId}`}>
                                                    </Card.Header>

                                                </Card>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            )}
                        </View>
                    )}
                    <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>

                    {searchResult && searchResult.tweets.length > 0 && (
                        <View>
                            <Text style={styles.title}>Tweets</Text>
                            {
                                searchResult.tweets.map(tweet =>
                                    <TweetComponent key={`${tweet.id}`} tweet={tweet} deletionDisabled={true} onTweetDeleted={()=>{}}/>
                                )
                            }
                        </View>
                    )}
                </ScrollView>

            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    searchbar: {
        marginRight: 5,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        width: '100%',
    }
});

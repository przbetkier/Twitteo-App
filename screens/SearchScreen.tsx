import {ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import {Text, useThemeColor, View} from '../components/Themed';
import React, {useState} from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {ActivityIndicator, Card, Flex, WhiteSpace} from "@ant-design/react-native";
import {search} from "../networking/api";
import {TweetComponent} from "../components/TweetComponent";
import {BoldText} from "../components/StyledText";
import {UserResponse} from "../components/profile/Profile";
import {Tweet} from "../components/Feed";
import {useNavigation} from "@react-navigation/native";
import {getWidth} from "../utils/screen";
import {getAvatarUrl} from "../utils/avatar";

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

    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background")
    const borderColor = useThemeColor({light: 'lightgray', dark: 'black'}, "background")

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

    const foundUserCard = (user: UserResponse): JSX.Element => {
        return (
            <TouchableOpacity
                onPress={() => handleProfileClicked(user?.displayName ?? "")}
                key={`${user.userId}`}
            >
                <Card
                    style={
                        {
                            padding: 8,
                            marginBottom: 8,
                            backgroundColor: bgColor,
                            borderColor: borderColor
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
                        thumb={getAvatarUrl(user)}>
                    </Card.Header>

                </Card>
            </TouchableOpacity>
        )
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
                    paddingLeft: 8,
                    paddingRight: 8,
                    maxWidth: 1200,
                    width: getWidth()
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
                                            foundUserCard(user)
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
                                    (
                                        <>
                                            <TweetComponent key={`${tweet.id}`} tweet={tweet}
                                                            deletionDisabled={true}
                                                            onTweetDeleted={() => {
                                                            }}/>
                                            <WhiteSpace size={"md"} key={`${tweet.id}-whitespace`}/>
                                        </>

                                    )
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
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '100%',
    },
    searchbar: {
        marginRight: 5,
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 10,
        width: '100%',
    }
});

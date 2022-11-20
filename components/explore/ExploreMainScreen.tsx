import React from "react";
import {Text, useThemeColor, View} from "../Themed";
import {FontAwesome, Ionicons, Octicons, MaterialIcons} from '@expo/vector-icons';
import {Card, Flex} from "@ant-design/react-native";
import {tintColorLight} from "../../constants/Colors";
import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {getPageSidePadding, getWidth} from "../../utils/screen";
import {useNavigation} from "@react-navigation/native";
import {ExploreParamList} from "../../types";


export const ExploreMainScreen: React.FC = ({}) => {

    const styles = StyleSheet.create({
        recommendationCard: {
            padding: 8,
            backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
            borderColor: '#2c2b2b',
            borderWidth: 0.22,
            marginBottom: 12
        }
    });

    const navigation = useNavigation();

    const navigateToScreen = (screen: keyof ExploreParamList) => {
        navigation.navigate('Root', {
            screen: "Explore",
            params: {
                screen: screen
            }
        });
    }

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
        }}>
            <View style={{
                flex: 1,
                alignItems: "stretch",
                alignContent: "center",
                justifyContent: "center",
                paddingTop: 8,
                paddingLeft: getPageSidePadding(),
                paddingRight: getPageSidePadding(),
                maxWidth: 1200,
                width: getWidth()
            }}>
                <ScrollView style={{width: "100%"}}>
                    <Flex justify={"center"} direction={"row"} style={{marginBottom: 8}}>
                        <Ionicons name="trending-up" size={32} color={tintColorLight}/>
                        <Text style={{marginLeft: 8, fontWeight: "bold", fontSize: 18}}>Trending this week</Text>
                    </Flex>
                    <TouchableOpacity
                        onPress={() => {
                            navigateToScreen("MostLikedTweetsScreen")
                        }}>
                        <Card style={styles.recommendationCard}>
                            <Card.Header
                                style={{marginLeft: 8}}
                                title={
                                    <Text style={{paddingLeft: 8}}>Most liked tweets</Text>
                                }
                                thumb={
                                    <FontAwesome name={"heart-o"} size={24} color={tintColorLight}/>
                                }
                            >

                            </Card.Header>
                            <Card.Body>
                                <Text style={{fontStyle: "italic"}}>
                                    Last week you may missed some tweets that received a lot of likes from other
                                    users. Do you want to make up for it?
                                </Text>
                            </Card.Body>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigateToScreen("MostFollowedUsersScreen")
                        }}>
                        <Card style={styles.recommendationCard}>
                            <Card.Header
                                style={{marginLeft: 8}}
                                title={
                                    <Text style={{paddingLeft: 8}}>Most followed users</Text>
                                }
                                thumb={
                                    <FontAwesome name="eye" size={24} color={tintColorLight}/>
                                }
                            >
                            </Card.Header>
                            <Card.Body>
                                <Text style={{fontStyle: "italic"}}>
                                    Oh my, some users have grown in popularity lately! Let's see who they are!
                                </Text>
                            </Card.Body>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigateToScreen("MostDiscussedTweetsScreen")
                        }}>
                        <Card style={styles.recommendationCard}>
                            <Card.Header
                                style={{marginLeft: 8}}
                                title={
                                    <Text style={{paddingLeft: 8}}>Most discussed</Text>
                                }
                                thumb={
                                    <Octicons name="comment-discussion" size={24} color={tintColorLight}/>
                                }
                            >

                            </Card.Header>
                            <Card.Body>
                                <Text style={{fontStyle: "italic"}}>
                                    Some tweets can cause more noise than others. Don't stay behind and check them to
                                    stay
                                    up to date!
                                </Text>
                            </Card.Body>
                        </Card>
                    </TouchableOpacity>

                    <Flex justify={"center"} direction={"row"} style={{marginBottom: 8}}>
                        <MaterialIcons name="local-fire-department" size={24} color="#e25822"/>
                        <Text style={{marginLeft: 8, fontWeight: "bold", fontSize: 18}}>Recommendations for you</Text>
                    </Flex>
                    <Card style={styles.recommendationCard}>
                        <Card.Header
                            style={{marginLeft: 8}}
                            title={
                                <Text style={{paddingLeft: 8}}>People you may know</Text>
                            }
                            thumb={
                                <MaterialIcons name="emoji-people" size={24} color={tintColorLight}/>
                            }
                        >

                        </Card.Header>
                        <Card.Body>
                            <Text style={{fontStyle: "italic"}}>Explore users followed by your friends - who knows,
                                maybe you will find someone
                                interesting to follow? </Text>
                        </Card.Body>
                    </Card>
                    <Card style={styles.recommendationCard}>
                        <Card.Header
                            style={{marginLeft: 8}}
                            title={
                                <Text style={{paddingLeft: 8}}>Liked by people you follow</Text>
                            }
                            thumb={
                                <FontAwesome name={"heart-o"} size={24} color={tintColorLight}/>
                            }
                        >

                        </Card.Header>
                        <Card.Body>
                            <Text style={{fontStyle: "italic"}}>Explore tweets that received the most love from your
                                friends - probably there was a
                                reason
                                for it!</Text>
                        </Card.Body>
                    </Card>
                    <Card style={styles.recommendationCard}>
                        <Card.Header
                            style={{marginLeft: 8}}
                            title={
                                <Text style={{paddingLeft: 8}}>Similar content</Text>
                            }
                            thumb={
                                <FontAwesome name={"hashtag"} size={24} color={tintColorLight}/>
                            }
                        >

                        </Card.Header>
                        <Card.Body>
                            <Text style={{fontStyle: "italic"}}>Explore tweets tagged with hashtags used in your
                                posts</Text>
                        </Card.Body>
                    </Card>
                </ScrollView>
            </View>
        </View>
    )
}

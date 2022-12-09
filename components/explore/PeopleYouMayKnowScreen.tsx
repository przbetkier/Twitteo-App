import React, {useEffect, useState} from "react";
import {Text, useThemeColor, View} from "../Themed";
import {Card, Flex, WhiteSpace} from "@ant-design/react-native";
import {ActivityIndicator, FlatList, RefreshControl, TouchableOpacity} from "react-native";
import {getPageSidePadding, getWidth} from "../../utils/screen";
import {getRecommendedUsers, RecommendedUserResponse} from "../../networking/recommendations-api";
import {tintColorLight} from "../../constants/Colors";
import {BoldText, ItalicText} from "../StyledText";
import {getAvatarUrl} from "../../utils/avatar";
import {UserResponse} from "../profile/Profile";
import {useNavigation} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";

export const PeopleYouMayKnowScreen: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<RecommendedUserResponse[]>([])


    const navigation = useNavigation();

    const loadRecommendations = () => {
        setLoading(true)
        getRecommendedUsers()
            .then(response => {
                console.log(response)
                setRecommendations(response)
            })
            .finally(() => setLoading(false))

    }

    useEffect(() => {
        loadRecommendations()
    }, [])

    const renderRecommendedUser = (recommendation: RecommendedUserResponse) => {
        return (<RecommendedUserCard recommendation={recommendation} onUserClicked={handleUserClicked}/>)

    }

    const handleUserClicked = (user: UserResponse) => {
        navigation.navigate('Root', {
            screen: "Home",
            params: {
                screen: "Profiles",
                params: {
                    displayName: user.displayName
                }
            }
        });
    }

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <Flex justify={"center"} direction={"row"} style={{marginBottom: 8, marginTop: 8}}>

            </Flex>

            {loading ? (
                <ActivityIndicator/>
            ) : (
                <View style={
                    {
                        flex: 1,
                        alignItems: "stretch",
                        justifyContent: "center",
                        paddingBottom: 12,
                        paddingLeft: getPageSidePadding(),
                        paddingRight: getPageSidePadding(),
                        maxWidth: 1200,
                        width: getWidth()
                    }
                }>
                    {recommendations.length > 0 ? (
                        <FlatList
                            data={recommendations}
                            renderItem={({item}) => renderRecommendedUser(item)}
                            ItemSeparatorComponent={() =>
                                <WhiteSpace size={"lg"}/>
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={loadRecommendations}
                                />
                            }
                        />
                    ) : (
                        <>
                            <Flex align={"center"} direction={"column"}>
                                <Ionicons name="moon-outline" size={68} color="#e5e5e5" />

                            <Text>You are not following anyone yet!</Text>
                            <Text>Use Most Followed Users tab for recommendations.</Text>
                            </Flex>
                        </>)
                    }

                </View>
            )}
        </View>
    )
}

export interface RecommendedUserCardProperties {
    recommendation: RecommendedUserResponse;

    onUserClicked(user: UserResponse): void;
}

export const RecommendedUserCard: React.FC<RecommendedUserCardProperties> = ({recommendation, onUserClicked}) => {
    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background")
    const borderColor = useThemeColor({light: 'lightgray', dark: 'black'}, "background")
    useThemeColor({light: 'green', dark: 'lightgreen'}, "background");

    const commonFollowersCount = (): number => {
        return recommendation.metadata.followedBy.length
    }

    return (
        <TouchableOpacity onPress={() => onUserClicked(recommendation.user)}>
            <Card style={
                {
                    marginLeft: 8,
                    marginRight: 8,
                    paddingLeft: 8,
                    paddingRight: 8,
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                }
            }>
                <Card.Header
                    title={
                        <>
                            <Flex direction={"row"} justify={"between"}>
                                <Flex direction={"column"} align={"start"}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            marginLeft: 18,
                                            color: tintColorLight
                                        }}>{recommendation.user.displayName}
                                    </Text>
                                    <Flex style={{marginLeft: 18}}>
                                        <BoldText
                                            style={{paddingRight: 4}}>{recommendation.user.followers}</BoldText>
                                        <Text>followers</Text>
                                    </Flex>

                                </Flex>
                            </Flex>
                        </>

                    }
                    thumbStyle={{width: 40, height: 40, borderRadius: 50}}
                    thumb={getAvatarUrl(recommendation.user)}>
                </Card.Header>
                <Flex style={{marginLeft: 18, marginTop: 9}}>
                    <ItalicText>Followed by
                        @{recommendation.metadata.followedBy[0]} {commonFollowersCount() > 1 ? `and ${commonFollowersCount() - 1} more` : ``}</ItalicText>
                </Flex>
            </Card>
        </TouchableOpacity>
    )
}

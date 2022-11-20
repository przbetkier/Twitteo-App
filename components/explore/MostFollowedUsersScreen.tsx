import React, {useEffect, useState} from "react";
import {Text, useThemeColor, View} from "../Themed";
import {getMostFollowedUsers, TrendingUserResponse} from "../../networking/trending-api";
import {Card, Flex, WhiteSpace} from "@ant-design/react-native";
import {ActivityIndicator, FlatList, RefreshControl, TouchableOpacity} from "react-native";
import {getPageSidePadding, getWidth} from "../../utils/screen";
import {UserResponse} from "../profile/Profile";
import {tintColorLight} from "../../constants/Colors";
import {BoldText} from "../StyledText";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {getAvatarUrl} from "../../utils/avatar";

export const MostFollowedUsersScreen: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<TrendingUserResponse[]>([])

    const navigation = useNavigation();

    const loadMostFollowedUsers = () => {
        setLoading(true)
        getMostFollowedUsers().then(response => setUsers(response))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadMostFollowedUsers()
    }, [])

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

    const renderUser = (trendingUser: TrendingUserResponse) => {
        return (<TrendingUserCard trendingUser={trendingUser} onUserClicked={handleUserClicked}/>)
    }

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <Flex justify={"center"} direction={"row"} style={{marginBottom: 8, marginTop: 8}}>
                <Text>Most followed users in last 7 days</Text>
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
                    <FlatList
                        data={users}
                        renderItem={({item}) => renderUser(item)}
                        ItemSeparatorComponent={() =>
                            <WhiteSpace size={"lg"}/>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={loadMostFollowedUsers}
                            />
                        }
                        keyExtractor={item => item.user.userId}
                    />
                </View>
            )}
        </View>
    )
}

interface TrendingUserCardProperties {
    trendingUser: TrendingUserResponse;

    onUserClicked(user: UserResponse): void;
}

export const TrendingUserCard: React.FC<TrendingUserCardProperties> = ({trendingUser, onUserClicked}) => {
    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background")
    const borderColor = useThemeColor({light: 'lightgray', dark: 'black'}, "background")
    const trendingIconColor = useThemeColor({light: 'green', dark: 'lightgreen'}, "background")

    return (
        <TouchableOpacity onPress={() => onUserClicked(trendingUser.user)}>
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
                                        }}>{trendingUser.user.displayName}
                                    </Text>
                                    <Flex style={{marginLeft: 18}}>
                                        <BoldText
                                            style={{paddingRight: 4}}>{trendingUser.user.followers}</BoldText>
                                        <Text>followers</Text>
                                    </Flex>
                                </Flex>
                                <Flex direction={"row"}>
                                    <Text style={{color: trendingIconColor}}>( +{trendingUser.metadata.score} )</Text>
                                    <Ionicons name="trending-up" size={18} color={trendingIconColor}
                                              style={{marginLeft: 8}}/>
                                </Flex>
                            </Flex>
                        </>

                    }
                    thumbStyle={{width: 40, height: 40, borderRadius: 50}}
                    thumb={getAvatarUrl(trendingUser.user)}>
                </Card.Header>
            </Card>
        </TouchableOpacity>
    )
}

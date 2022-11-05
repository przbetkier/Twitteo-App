import {HomeStackScreenProps} from "../../types";
import {Text, useThemeColor, View} from "../Themed";
import {getWidth} from "../../utils/screen";
import React, {useEffect, useState} from "react";
import {BasicUserResponse, getFollowers} from "../../networking/api";
import {ActivityIndicator} from "@ant-design/react-native";
import {FlatList, RefreshControl} from "react-native";
import {FollowerRecord} from "./FollowerRecord";

export const Followers: React.FC<HomeStackScreenProps<'Followees'>> = ({navigation, route}) => {

    const {userId} = route.params;
    const [followers, setFollowers] = useState<BasicUserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)

    const refresh = () => {
        setPage(0);
        fetchFollowers(0, true).then();
    }

    useEffect(() => {
        fetchFollowers(page, true).then();
    }, [userId])

    useEffect(() => {
    }, [followers]);

    const loadFollowers = React.useCallback(() => {
        setLoading(true);
        fetchFollowers(page).then()
    }, []);

    const fetchFollowers = async (page: number, refresh: boolean = false) => {
        const response = await getFollowers(userId, page)
        const responseFollowers = response.followers
        refresh ? setFollowers(responseFollowers) : setFollowers([...followers, ...responseFollowers])
        setPage(page + 1)
        setLoading(false)
    }

    const handleLoadMore = () => {
        fetchFollowers(page).then();
    }

    const renderBasicUser = (user: BasicUserResponse) => {
        return (
            <FollowerRecord user={user}/>
        )
    }

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
                    width: getWidth()
                }}
            >
                {loading && (<ActivityIndicator color={"gray"} size={"large"}/>)}
                {!loading && (
                    <FlatList
                        style={{minWidth: getWidth()}}
                        ListEmptyComponent={
                            <Text style={{textAlign: "center", marginTop: "50%"}}>Nobody follows this user yet.</Text>
                        }
                        nestedScrollEnabled={false}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadFollowers}/>}
                        data={followers}
                        refreshing={loading}
                        onRefresh={refresh}
                        renderItem={({item}) => renderBasicUser(item)}
                        keyExtractor={(item, index) => item.userId + 'key' + index}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.8}
                    >
                    </FlatList>
                )}
            </View>
        </View>
    )
}

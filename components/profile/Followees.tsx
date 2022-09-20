import {HomeStackScreenProps} from "../../types";
import React, {useEffect, useState} from "react";
import {BasicUserResponse, getFollowees} from "../../networking/api";
import {Text, useThemeColor, View} from "../Themed";
import {ActivityIndicator, Card} from "@ant-design/react-native";
import {getWidth} from "../../utils/screen";
import {FlatList, RefreshControl} from "react-native";
import {FollowerRecord} from "./FollowerRecord";

export const Followees: React.FC<HomeStackScreenProps<'Followees'>> = ({navigation, route}) => {

    const {userId} = route.params;

    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background");
    const borderColor = useThemeColor({light: 'gray', dark: 'white'}, "background");

    const [followees, setFollowees] = useState<BasicUserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)

    const refresh = () => {
        setPage(0);
        fetchFollowees(0, true).then();
    }

    useEffect(() => {
        fetchFollowees(page, true).then();
    }, [userId])

    useEffect(() => {
    }, [followees]);

    const loadFollowees = React.useCallback(() => {
        setLoading(true);
        fetchFollowees(page).then()
    }, []);

    const fetchFollowees = async (page: number, refresh: boolean = false) => {
        const response = await getFollowees(userId, page)
        const responseFollowees = response.followees
        refresh ? setFollowees(responseFollowees) : setFollowees([...followees, ...responseFollowees])
        setPage(page + 1)
        setLoading(false)
    }

    const handleLoadMore = () => {
        fetchFollowees(page).then();
    }

    const renderBasicUser = (user: BasicUserResponse) => {
        return (
            <FollowerRecord userId={user.userId} displayName={user.displayName}/>
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
                            <Text style={{textAlign: "center"}}>This user follows nobody.</Text>
                        }
                        nestedScrollEnabled={false}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadFollowees}/>}
                        data={followees}
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

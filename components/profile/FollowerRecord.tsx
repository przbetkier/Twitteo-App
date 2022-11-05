import React from "react";
import {Text, useThemeColor, View} from "../Themed";
import {Card} from "@ant-design/react-native";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {BasicUserResponse} from "../../networking/api";

export interface FollowerRecordProps {
   user: BasicUserResponse;
}

export const FollowerRecord: React.FC<FollowerRecordProps> = ({user}) => {

    const navigation = useNavigation();

    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background");
    const borderColor = useThemeColor({light: 'gray', dark: 'gray'}, "background");

    const handleFollowerClicked = () => {
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
        <View style={{
            flex: 1
        }}>
            <TouchableOpacity onPress={handleFollowerClicked}>
                <Card
                    style={
                        {
                            padding: 8,
                            marginBottom: 8,
                            backgroundColor: bgColor,
                            borderColor: borderColor,
                            borderWidth: 0.5
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
                                    }}>{user.displayName}
                                </Text>
                            </>

                        }
                        thumbStyle={{width: 40, height: 40, borderRadius: 50}}
                        thumb={user.avatarUrl !== "" && user.avatarUrl !== null ? user.avatarUrl : `https://i.pravatar.cc/150?u=${user.userId}`}>
                    </Card.Header>
                </Card>
            </TouchableOpacity>
        </View>
    )
}

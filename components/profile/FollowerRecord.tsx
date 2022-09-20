import React from "react";
import {Text, useThemeColor, View} from "../Themed";
import {Card} from "@ant-design/react-native";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";

export interface FollowerRecordProps {
    userId: string;
    displayName: string;
}

export const FollowerRecord: React.FC<FollowerRecordProps> = ({userId, displayName}) => {

    const navigation = useNavigation();

    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background");
    const borderColor = useThemeColor({light: 'gray', dark: 'gray'}, "background");

    const handleFollowerClicked = () => {
        navigation.navigate('Root', {
            screen: "Home",
            params: {
                screen: "Profiles",
                params: {
                    displayName
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
                                    }}>{displayName}
                                </Text>
                            </>

                        }
                        thumbStyle={{width: 40, height: 40, borderRadius: 50}}
                        thumb={`https://i.pravatar.cc/150?u=${userId}`}>
                    </Card.Header>
                </Card>
            </TouchableOpacity>
        </View>
    )
}

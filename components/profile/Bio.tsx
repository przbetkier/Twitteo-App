import {UserResponse} from "./Profile";
import {Text, useThemeColor, View} from "../Themed";
import {Card, Flex, WhiteSpace} from "@ant-design/react-native";
import React from "react";
import {BoldText, ItalicText} from "../StyledText";

interface BioProperties {
    user: UserResponse;
}

export const Bio: React.FC<BioProperties> = ({ user }) => {

    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background")
    const borderColor = useThemeColor({light: 'black', dark: ''}, "background")

    return (
        <View>
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
                    title={<Text style={{fontSize: 20, marginLeft: 18}}>{user?.displayName}</Text>}
                    thumbStyle={{width: 60, height: 60, borderRadius: 50}}
                    thumb={`https://i.pravatar.cc/150?u=${user?.userId}`}>

                </Card.Header>
                <Card.Body style={{padding: 10}}>
                    <Text>Bio:</Text>
                    <ItalicText>{user?.bio}</ItalicText>

                    <WhiteSpace/>

                    <Flex justify={"around"}>
                        <Flex>
                            <BoldText style={{paddingRight: 8}}>{user?.follows}</BoldText>
                            <Text>following</Text>
                        </Flex>
                        <Flex>
                            <BoldText style={{paddingRight: 8}}>{user?.followers}</BoldText>
                            <Text>followers</Text>
                        </Flex>
                    </Flex>
                </Card.Body>
            </Card>
        </View>
    )
}

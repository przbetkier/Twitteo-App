import {UserResponse} from "./Profile";
import {Text, useThemeColor, View} from "../Themed";
import {Button, Card, Flex, WhiteSpace} from "@ant-design/react-native";
import React, {useEffect, useState} from "react";
import {BoldText, ItalicText} from "../StyledText";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {follow, FollowerState, getFollowerState, unfollow} from "../../networking/api";
import {FontAwesome} from "@expo/vector-icons";

interface BioProperties {
    user: UserResponse;
}

export const Bio: React.FC<BioProperties> = ({user}) => {

    const [isChangingFollowerState, setIsChangingFollowerState] = useState(false);
    const [followerState, setFollowerState] = useState<null | FollowerState>(null)
    const [followers, setFollowers] = useState(user.followers)
    const [followees, setFollowees] = useState(user.follows)

    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background")
    const borderColor = useThemeColor({light: 'lightgray', dark: 'black'}, "background")

    const navigation = useNavigation();

    useEffect(() => {
        getFollowerState(user.userId).then(
            res => setFollowerState(res)
        ).catch((e) => {
            console.log("Error occurred: " + e)
        })
    }, [user])

    const navigateToFollowers = () => {
        navigation.navigate('Root', {
            screen: "Home",
            params: {
                screen: "Followers",
                params: {
                    userId: user.userId
                }
            }
        });
    }

    const navigateToFollowees = () => {
        navigation.navigate('Root', {
            screen: "Home",
            params: {
                screen: "Followees",
                params: {
                    userId: user.userId
                }
            }
        });
    }

    const handleFollowClicked = () => {
        setIsChangingFollowerState(true)
        follow(user.userId).then(
            state => setFollowerState(state)
        ).then(() => {
            setFollowers(prev => prev + 1)
            setIsChangingFollowerState(false)
        })
    }

    const handleUnFollowClicked = () => {
        setIsChangingFollowerState(true)
        unfollow(user.userId).then(
            state => setFollowerState(state)
        ).then(() => {
            setFollowers(prev => prev - 1)
            setIsChangingFollowerState(false)
        })
    }

    return (
        <View>
            <Card
                style={
                    {
                        padding: 8,
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        borderWidth: 0.5
                    }
                }
            >
                <Card.Header
                    title={
                        <View style={{marginLeft: 18, backgroundColor: bgColor}}>
                            <Text style={{fontSize: 20}}>{user?.displayName}</Text>
                            {followerState && followerState !== FollowerState.CANNOT_FOLLOW && (
                                <>
                                    {followerState === FollowerState.DOES_NOT_FOLLOW && (
                                        <Button
                                            size={"small"}
                                            type={"primary"}
                                            style={{marginTop: 8, width: 100}}
                                            onPress={handleFollowClicked}
                                            disabled={isChangingFollowerState}
                                            loading={isChangingFollowerState}
                                        ><FontAwesome name={"rocket"}/> Follow

                                        </Button>
                                    )}
                                    {followerState === FollowerState.FOLLOWS && (
                                        <Button
                                            size={"small"}
                                            type={"warning"}
                                            style={{marginTop: 8, width: 100}}
                                            onPress={handleUnFollowClicked}
                                            disabled={isChangingFollowerState}
                                            loading={isChangingFollowerState}
                                        ><FontAwesome name={"remove"}/> Unfollow</Button>
                                    )}
                                </>
                            )}
                        </View>
                    }
                    thumbStyle={{width: 60, height: 60, borderRadius: 50}}
                    thumb={user.avatarUrl !== "" ? user.avatarUrl : `https://i.pravatar.cc/150?u=${user.userId}`}>

                </Card.Header>
                <Card.Body style={{justifyContent: "center"}}>
                    {user?.bio !== '' && (<>
                        <ItalicText>{user?.bio}</ItalicText>
                        <WhiteSpace/>
                    </>)
                    }

                    <Flex justify={"around"}>
                        <TouchableOpacity onPress={navigateToFollowers}>
                            <Flex>
                                <BoldText style={{paddingRight: 8}}>{followers}</BoldText>
                                <Text>followers</Text>
                            </Flex>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateToFollowees}>
                            <Flex>
                                <BoldText style={{paddingRight: 8}}>{followees}</BoldText>
                                <Text>following</Text>
                            </Flex>
                        </TouchableOpacity>
                    </Flex>
                </Card.Body>
            </Card>
        </View>
    )
}

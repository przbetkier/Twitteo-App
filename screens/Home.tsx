import {useEffect, useState} from "react";
import {User} from "firebase/auth";
import Feed from "../components/Feed";
import {getUser} from "../networking/api";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import * as React from "react";
import Profile from "../components/profile/Profile";
import {View, Text} from "../components/Themed";
import AddTweet from "../components/AddTweet";
import {auth} from '../config/FirebaseConfig';
import Hashtag from "../components/hashtag/Hashtag";
import {Followers} from "../components/profile/Followers";
import {Followees} from "../components/profile/Followees";
import TweetScreen from "../components/TweetScreen";
import {FontAwesome5} from '@expo/vector-icons';
import {tintColorLight} from "../constants/Colors";
import {Flex} from "@ant-design/react-native";

export default function Home() {

    const Stack = createNativeStackNavigator();

    const [user, setUser] = useState<User | null>()

    const loadUser = () => {
        getUser().then(setUser)
    }

    auth.onAuthStateChanged((user) => {
        setUser(user);
    })


    useEffect(() => {
        loadUser()
    }, [])

    return (
        <>
            {user ? (
                <Stack.Navigator
                    initialRouteName="Feed"
                    screenOptions={{
                        headerShown: true
                    }}
                >
                    <Stack.Group>
                        <Stack.Screen
                            name="Feed"
                            component={Feed}
                            options={{
                                title: 'Feed'
                            }}
                        />
                        <Stack.Screen
                            name="Profiles"
                            component={Profile}
                            options={{
                                title: 'Profiles'
                            }}
                        />
                        <Stack.Screen
                            name="Tweet"
                            component={TweetScreen}
                            options={{
                                title: 'Tweet'
                            }}
                        />
                        <Stack.Screen
                            name="Hashtag"
                            component={Hashtag}
                            options={{
                                title: 'Browse hashtag posts'
                            }}
                        />
                    </Stack.Group>
                    <Stack.Group screenOptions={{presentation: 'modal'}}>
                        <Stack.Screen name="AddTweet" component={AddTweet}/>
                        <Stack.Screen name="Followers" component={Followers}/>
                        <Stack.Screen name="Followees" component={Followees}/>
                    </Stack.Group>

                </Stack.Navigator>) : (
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Flex direction={"column"} style={{height: '50%'}} justify={"around"}>
                        <Text style={{fontSize: 30, fontWeight: "bold"}}>Welcome to Twitteo</Text>
                        <FontAwesome5 name="smile-beam" size={100} color={tintColorLight}/>
                        <Text>Log in to join our community!</Text>
                    </Flex>
                </View>
            )
            }
        </>
    );
}

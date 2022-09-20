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
import {Image} from "react-native";

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
                                title: 'Feed',
                                headerRight: () => (
                                    <View style={{backgroundColor: "transparent"}}>
                                        {user && (
                                            <Image style={{width: 30, height: 30, borderRadius: 15}}
                                                   source={{uri: `https://i.pravatar.cc/150?u=${user.uid}`}}/>
                                        )}
                                    </View>),
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
                    <Text>You are not logged in</Text>
                </View>
            )
            }
        </>
    );
}

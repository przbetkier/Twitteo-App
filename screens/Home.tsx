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
                    </Stack.Group>
                    <Stack.Group screenOptions={{ presentation: 'modal' }}>
                        <Stack.Screen name="AddTweet" component={AddTweet}/>
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

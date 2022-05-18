import {FontAwesome} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import Home from '../screens/Home';
import SearchScreen from '../screens/SearchScreen';
import {RootStackParamList, RootTabParamList, RootTabScreenProps} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from "../screens/LoginScreen";
import {auth} from "../config/FirebaseConfig";
import {useEffect, useState} from "react";
import {User} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName }) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator/>
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{title: 'Login to Twitteo!'}}/>
            <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen name="Modal" component={ModalScreen}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState<User | null>(null);

    const storeData = async (user: User | null) => {
        if (user) {
            try {
                await AsyncStorage.setItem(
                    'user',
                    JSON.stringify(user)
                );
                setUser(user);
            } catch (error) {
            }
        } else {
            await AsyncStorage.removeItem(
                'user'
            )
            setUser(null)
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
            storeData(authUser).then()
        });
    }, [])


    return (
        <>
            <BottomTab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors[colorScheme].tint,
                }}>
                <BottomTab.Screen
                    name="Home"
                    component={Home}
                    options={({navigation}: RootTabScreenProps<'Home'>) => ({
                        title: 'Home',
                        tabBarIcon: ({color}) => <TabBarIcon name="home" color={color}/>,
                        headerRight: () => (<></>),
                                // FIXME: To be removed or only displayed on Desktop
                                // <LoginHeader user={user} navigation={navigation}/>

                    })}
                />
                <BottomTab.Screen
                    name="TabTwo"
                    component={SearchScreen}
                    options={{
                        headerShown: true,
                        title: 'Search',
                        tabBarIcon: ({color}) => <TabBarIcon name="search" color={color}/>,
                    }}
                />
                <BottomTab.Screen
                    name="TabThree"
                    component={SearchScreen}
                    options={{
                        title: 'Notifications',
                        tabBarIcon: ({color}) => <TabBarIcon name="bell" color={color}/>,
                    }}
                />
                <BottomTab.Screen
                    name="TabFour"
                    component={SearchScreen}
                    options={{
                        title: 'Tab Four',
                        tabBarIcon: ({color}) => <TabBarIcon name="inbox" color={color}/>,
                    }}
                />
                <BottomTab.Screen
                    name="TabFive"
                    component={LoginScreen}
                    options={{
                        title: 'Login',
                        tabBarIcon: ({color}) => <TabBarIcon name="twitter" color={color}/>,
                    }}
                />
            </BottomTab.Navigator>
        </>
    );
}

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={30} style={{marginBottom: -3}} {...props} />;
}

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
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import {RootStackParamList, RootTabParamList, RootTabScreenProps} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from "../screens/LoginScreen";
import {auth} from "../config/FirebaseConfig";
import {useState} from "react";
import {User} from "firebase/auth";
import LoginHeader from "../components/LoginHeader";
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
        if(user) {
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

    auth.onAuthStateChanged(authUser => {
        storeData(authUser).then()
    });

    return (
        <>
            <BottomTab.Navigator
                initialRouteName="TabOne"
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme].tint,
                }}>
                <BottomTab.Screen
                    name="TabOne"
                    component={TabOneScreen}
                    options={({navigation}: RootTabScreenProps<'TabOne'>) => ({

                        title: 'Feed',
                        tabBarIcon: ({color}) => <TabBarIcon name="home" color={color}/>,
                        headerRight: () => (<LoginHeader user={user} navigation={navigation}/>)
                    })}
                />
                <BottomTab.Screen
                    name="TabTwo"
                    component={TabTwoScreen}
                    options={{
                        title: 'Search',
                        tabBarIcon: ({color}) => <TabBarIcon name="search" color={color}/>,
                    }}
                />
                <BottomTab.Screen
                    name="TabThree"
                    component={TabTwoScreen}
                    options={{
                        title: 'Notifications',
                        tabBarIcon: ({color}) => <TabBarIcon name="bell" color={color}/>,
                    }}
                />
                <BottomTab.Screen
                    name="TabFour"
                    component={TabTwoScreen}
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

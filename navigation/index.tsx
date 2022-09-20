import {FontAwesome} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {useEffect, useState} from 'react';
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
import {User} from "firebase/auth";
import Registration from "../screens/Registration";
import {getUser} from "../networking/api";

export default function Navigation({colorScheme, user}: { colorScheme: ColorSchemeName, user: any }) {

    useEffect(() => {
    }, [user])

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
            <Stack.Screen name="Registration" component={Registration} options={{title: 'Registration'}}/>
            <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen name="Modal" component={ModalScreen}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState<User | null>(null);

    auth.onAuthStateChanged((change) => {
        setUser(change)
    })

    useEffect(() => {
        getUser().then(user => {
                setUser(user)
            }
        )
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
                        tabBarIcon: ({color}) => <TabBarIcon name="home" color={color}/>
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
                        title: user ? 'Profile' : 'Login',
                        tabBarIcon: ({color}) => (
                          <>
                              {!user && <TabBarIcon name="twitter" color={color}/>}
                              {user && <TabBarIcon name="user-circle" color={color}/>}
                          </>

                        ),
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

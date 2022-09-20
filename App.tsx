import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import {Provider} from "@ant-design/react-native";
import {auth} from "./config/FirebaseConfig";
import {User} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useState} from "react";

export default function App() {
    const isLoadingComplete = useCachedResources();
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

    auth.onAuthStateChanged(authUser => {
        storeData(authUser).then()
    });

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <Provider>
                    <Navigation colorScheme={colorScheme} user={user}/>
                    <StatusBar/>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

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
import {QueryClient, QueryClientProvider} from "react-query";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();
    const queryClient = new QueryClient()

    console.disableYellowBox = true;

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
                    <QueryClientProvider client={queryClient}>
                        <Navigation colorScheme={colorScheme} user={user}/>
                        <StatusBar/>
                    </QueryClientProvider>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

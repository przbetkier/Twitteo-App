import {ScrollView, StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {User} from "firebase/auth";

export default function TabOneScreen() {

    const [user, setUser] = useState<User | null>()

    useEffect(() => {
        AsyncStorage.getItem(
            'user'
        ).then((user) => {
            if (user) {
                setUser(JSON.parse(user))
            }
        });
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main Feed</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            {user ? (
                <><Text>You are logged as:</Text>
                    <Text>Email: {user?.email}</Text>
                    <Text>User id: {user?.uid}</Text>
                    <Text>Email verified?: {user?.emailVerified as boolean}</Text>
                </>
            ) : (
                <>
                    <Text>You are not logged in.</Text>
                </>
            )
            }

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});

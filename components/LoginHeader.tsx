import {Text, View} from "./Themed";
import {useEffect, useState} from "react";
import {User} from "firebase/auth";
import {Button, Platform} from "react-native";

import {auth} from "../config/FirebaseConfig";

export interface LoginHeaderProps {
    user: User | null;
    navigation: any;
}

export default function LoginHeader(props: LoginHeaderProps) {

    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        setUser(props.user)
    }, [props.user])

    const logout = () => {
        auth.signOut().then(() => {
                setUser(null)
                props.navigation.replace('Login')
            }
        )
    }

    return (
        <>
            <View style={{backgroundColor: 'transparent'}}>
                {user && (
                    <>
                        <View style={{flexDirection: "row", backgroundColor: 'transparent'}}>
                            {(Platform.OS === 'web' || Platform.OS === 'macos') && (
                                <Text style={{backgroundColor: 'transparent'}}>Logged as {props.user?.email}</Text>
                            )}

                            <View style={{paddingLeft: 12, paddingRight: 12, backgroundColor: 'transparent'}}>
                                <Button
                                    title={'Logout'}
                                    onPress={logout}
                                />
                            </View>
                        </View>
                    </>
                )}

                {!user && (
                    <>
                        <Button
                            title={'Login'}
                            onPress={() => {
                                props.navigation.replace('Login')
                            }}
                        />
                    </>
                )}
            </View>
        </>
    )
}

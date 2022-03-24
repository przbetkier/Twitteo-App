import {Text, View} from "./Themed";
import {useEffect, useState} from "react";
import {User} from "firebase/auth";
import {Platform} from "react-native";
import {Button} from "@ant-design/react-native";

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
            <View style={{backgroundColor: 'transparent', padding: 8}}>
                {user && (
                    <>
                        <View style={{flexDirection: "row", backgroundColor: 'transparent'}}>
                            {(Platform.OS === 'web' || Platform.OS === 'macos') && (
                                <Text style={{backgroundColor: 'transparent'}}>Logged as {props.user?.email}</Text>
                            )}

                            <View style={{backgroundColor: 'transparent'}}>
                                <Button
                                    type={"warning"}
                                    onPress={logout}
                                >Logout</Button>
                            </View>
                        </View>
                    </>
                )}

                {!user && (
                    <>
                        <Button
                            type={"primary"}
                            style={{width: 100}}
                            onPress={() => {
                                props.navigation.replace('Login')
                            }}
                        >Login</Button>
                    </>
                )}
            </View>
        </>
    )
}

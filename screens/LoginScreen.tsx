import {StyleSheet, TextInput} from "react-native";
import {ActivityIndicator, Button, Toast} from "@ant-design/react-native"
import {Text, useThemeColor, View} from "../components/Themed";
import React, {useEffect, useState} from "react";
import {signInWithEmailAndPassword, User} from "firebase/auth";
import {auth} from "../config/FirebaseConfig";
import {RootStackScreenProps} from "../types";
import {getUser} from "../networking/api";
import {tintColorLight} from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";
import {ProfileEditScreen} from "./ProfileEditScreen";

export default function LoginScreen({navigation}: RootStackScreenProps<'Login'>) {

    const [user, setUser] = useState<User | null>()

    const inputBgColor = useThemeColor({light: 'white', dark: '#181818'}, "background");
    const inputColor = useThemeColor({light: 'black', dark: 'white'}, "text");
    const inputBorder = useThemeColor({light: 'gray', dark: 'gray'}, "text");

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 20,
            marginBottom: 100,
            fontWeight: 'bold',
        },
        input: {
            width: 300,
            backgroundColor: inputBgColor,
            padding: 10,
            marginTop: 8,
            color: inputColor,
            borderWidth: 0.5,
            borderColor: inputBorder
        },
    });

    const loadUser = () => {
        getUser().then(setUser).then(() => {
            setLoading(false)
        })
    }


    auth.onAuthStateChanged((user) => {
        setUser(user);
    })

    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSignIn = () => {
        setSubmitting(true);
        signInWithEmailAndPassword(auth, email, password).then(() => {
                navigation.replace('Root')
                setSubmitting(false)
            }
        ).catch((e: any) => {
            setErrors(["New error " + JSON.stringify(e)])
            setSubmitting(false);
        });
    }

    useEffect(() => {
        loadUser()
    }, [])

    return (
        <>
            {loading ? (<ActivityIndicator/>) : (<>
                {user ? (
                    <ProfileEditScreen user={user}/>
                ) : (
                    <View
                        style={styles.container}
                    >
                        <Text style={styles.title}>Login to Twitteo</Text>

                        <TextInput value={email}
                                   onChangeText={setEmail}
                                   style={styles.input}
                                   placeholder={"e-mail"}
                                   autoCorrect={false}
                                   autoCompleteType={'off'}
                        />
                        <TextInput value={password}
                                   onChangeText={setPassword}
                                   style={styles.input}
                                   placeholder={"password"}
                                   secureTextEntry={true}
                        />

                        <>
                            <Button
                                type={"primary"}
                                style={{width: 300, marginTop: 12}}
                                onPress={handleSignIn}
                                loading={submitting}
                            ><FontAwesome
                                name={"rocket"}
                                color={"white"}
                                size={20}
                            ></FontAwesome> Login
                            </Button>
                            <Text style={{color: tintColorLight, marginTop: 16}}
                                  onPress={() => navigation.navigate('Registration')}>
                                Don't have an account?
                            </Text>
                        </>
                    </View>
                )}
            </>)}
        </>

    );
}



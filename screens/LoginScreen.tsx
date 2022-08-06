import {StyleSheet, TextInput} from "react-native";
import {ActivityIndicator, Button} from "@ant-design/react-native"
import {Text, View} from "../components/Themed";
import React, {useEffect, useState} from "react";
import {signInWithEmailAndPassword, User} from "firebase/auth";
import {auth} from "../config/FirebaseConfig";
import {RootStackScreenProps} from "../types";
import {getUser} from "../networking/api";

export default function LoginScreen({navigation}: RootStackScreenProps<'Login'>) {

    const [user, setUser] = useState<User | null>()

    const loadUser = () => {
        getUser().then(setUser).then(() => {
            setLoading(false)
        })
    }

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

    const logout = () => {
        setLoading(true)
        auth.signOut().then(() => {
                setUser(null)
                setLoading(false)
            }
        )
    }

    useEffect(() => {
        loadUser()
    }, [])

    return (
        <View style={styles.container}>
            {loading ? (<ActivityIndicator/>) : (<>
                {user ? (<>
                    <Text>
                        Logged as user {user.uid}
                    </Text>
                    <Text>
                        Your email is {user.email}
                    </Text>
                    <Text>
                        Your bio is {String(user.emailVerified)}
                    </Text>
                    <Button
                        type={"warning"}
                        onPress={logout}
                    >Logout</Button>
                </>) : (
                    <>
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
                                   placeholder={"Password"}
                                   secureTextEntry={true}
                        />

                        <Button
                            type={"primary"}
                            onPress={handleSignIn}
                            loading={submitting}
                        >Login</Button>
                    </>
                )}
            </>)}
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
    input: {
        width: 300,
        backgroundColor: 'white',
        height: 40,
        color: 'black',
        margin: 12,
        borderWidth: 1,
        padding: 5,
    },
});

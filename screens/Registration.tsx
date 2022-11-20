import {RootStackScreenProps} from "../types";
import {View, Text, useThemeColor} from "../components/Themed";
import React, {useState} from "react";
import {Dimensions, StyleSheet, TextInput} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {Button} from "@ant-design/react-native";
import {tintColorLight} from "../constants/Colors";
import {createUserWithEmailAndPassword, AuthError} from "firebase/auth";
import {auth} from "../config/FirebaseConfig";
import {signUp} from "../networking/api";

interface RegistrationData {
    email: string,
    username: string,
    password: string
}

export default function Registration({navigation}: RootStackScreenProps<'Registration'>) {

    const inputBgColor = useThemeColor({light: 'white', dark: '#181818'}, "background");
    const inputColor = useThemeColor({light: 'black', dark: 'white'}, "text");
    const inputBorder = useThemeColor({light: 'gray', dark: 'gray'}, "text");

    const [credentials, setCredentials] = useState<RegistrationData>({email: "", username: "", password: ""});

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    const styles = StyleSheet.create({
        title: {
            fontSize: 20,
            marginBottom: 60,
            marginTop: 20,
            textAlign: "center",
            fontWeight: 'bold',
            color: tintColorLight
        },
        input: {
            width: Dimensions.get("screen").width - 80,
            backgroundColor: inputBgColor,
            padding: 10,
            marginTop: 8,
            color: inputColor,
            borderWidth: 0.5,
            borderColor: inputBorder
        },
    });

    const toErrorDescription = (authError: string) => {
        switch (authError) {
            case "auth/email-already-in-use":
                return "Email already used by another user"
            case "auth/invalid-email":
                return "Invalid email format"
            default:
                return "Something went wrong"
        }
    }

    const isUsernameValid = (): boolean => {
        // FIXME provide better validation than length
        return credentials.username.length > 6;
    }

    const isPasswordValid = (): boolean => {
        // FIXME provide better validation than length
        return credentials.password.length > 4;
    }

    const isEmailValid = (): boolean => {
        return credentials.email.length > 4 && credentials.email.indexOf('@') !== -1
    }

    const isFormValid = () => {
        return isUsernameValid() && isPasswordValid() && isEmailValid();
    }

    const handleSignUp = () => {
        setSubmitting(true)
        createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
            .then(response => {
                    response.user.getIdToken().then(
                        token => signUp(token, credentials.username)
                            .then(() => {
                                    navigation.replace('Root')
                                }
                            )
                    )
                }
            )
            .catch((err: AuthError) => {
                const error = toErrorDescription(err.code)
                setError(error)
            })
            .finally(() => {
                setSubmitting(false)
            })
    }


    return (
        <View style={{flex: 1}}>

            <Text style={styles.title}>Join to Twitteo</Text>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                <Text>
                    <FontAwesome
                        name={"envelope"}
                        color={tintColorLight}
                        size={20}
                    ></FontAwesome>
                </Text>
                <TextInput value={credentials.email}
                           onChangeText={(text) => {
                               setCredentials({...credentials, email: text})
                           }}
                           style={styles.input}
                           placeholder={"e-mail"}
                           autoCapitalize={"none"}
                           autoCorrect={false}
                           autoCompleteType={'off'}
                />
            </View>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                <FontAwesome
                    name={"user-circle"}
                    color={tintColorLight}
                    size={20}
                ></FontAwesome>
                <TextInput value={credentials.username}
                           onChangeText={(text) => {
                               setCredentials({...credentials, username: text})
                           }}
                           style={styles.input}
                           placeholder={"username"}
                           autoCapitalize={"none"}
                           autoCorrect={false}
                           autoCompleteType={'off'}
                />
            </View>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                <FontAwesome
                    name={"key"}
                    color={tintColorLight}
                    size={20}
                ></FontAwesome>
                <TextInput value={credentials.password}
                           onChangeText={(text) => {
                               setCredentials({...credentials, password: text})
                           }}
                           style={styles.input}
                           placeholder={"password"}
                           autoCorrect={false}
                           autoCompleteType={"off"}
                           autoCapitalize={"none"}
                           secureTextEntry={true}
                />
            </View>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Button
                    type={"primary"}
                    style={{width: "90%", marginTop: 60}}
                    onPress={handleSignUp}
                    loading={submitting}
                    disabled={!isFormValid()}
                ><FontAwesome
                    name={"rocket"}
                    color={"white"}
                    size={20}
                ></FontAwesome> Join now!
                </Button>

            </View>
            <View style={{marginTop: 8}}>
                <Text style={{color: "red", textAlign: "center"}}>{error}</Text>
            </View>
        </View>
    )
}

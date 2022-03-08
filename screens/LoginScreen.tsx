import {Button, StyleSheet, TextInput} from "react-native";
import {Text, View} from "../components/Themed";
import {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../config/FirebaseConfig";
import {RootStackScreenProps} from "../types";

export default function LoginScreen({navigation}: RootStackScreenProps<'Login'>) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password).then(() => {
                setSubmitting(false);
                setSuccess(true);
                navigation.replace('Root')
            }
        ).catch((e: any) => {
            setErrors(["New error " + JSON.stringify(e)])
            setSubmitting(false);
        });
    }

    return (
        <View style={styles.container}>

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
                title={'Login'}
                onPress={handleSignIn}
            />
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

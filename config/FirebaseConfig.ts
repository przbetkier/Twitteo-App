import {initializeApp, FirebaseApp} from "firebase/app";
import Constants from "expo-constants";
import { initializeAuth as rnAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseEnv = Constants.manifest?.extra?.firebase

const firebaseConfig = {
    apiKey: firebaseEnv.apiKey,
    authDomain: firebaseEnv.authDomain,
    projectId: firebaseEnv.projectId,
    storageBucket: firebaseEnv.storageBucket,
    messagingSenderId: firebaseEnv.messagingSenderId,
    appId: firebaseEnv.appId,
};

const createAuthObject = (app: FirebaseApp) => {
    return rnAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = createAuthObject(app);





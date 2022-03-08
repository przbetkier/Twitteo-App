import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import Constants from "expo-constants";

const firebaseEnv = Constants.manifest?.extra?.firebase

const firebaseConfig = {
    apiKey: firebaseEnv.apiKey,
    authDomain: firebaseEnv.authDomain,
    projectId: firebaseEnv.projectId,
    storageBucket: firebaseEnv.storageBucket,
    messagingSenderId: firebaseEnv.messagingSenderId,
    appId: firebaseEnv.appId,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);





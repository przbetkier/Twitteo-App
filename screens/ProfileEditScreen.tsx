import React, {useEffect, useState} from "react";
import {Text, useThemeColor, View} from "../components/Themed";
import {User} from "firebase/auth";
import {Button, Card, Toast} from "@ant-design/react-native";
import {auth} from "../config/FirebaseConfig";
import {Image, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {gerUserProfile, getUser, ProfileUpdateRequest, updateProfile, uploadAvatar} from "../networking/api";
import {UserResponse} from "../components/profile/Profile";
import {tintColorLight} from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {useNavigation} from "@react-navigation/native";
import {getAvatarUrl} from "../utils/avatar";

export const ProfileEditScreen: React.FC = () => {

    const [user, setUser] = useState<User | null>(null);
    // const [profile, setProfile] = useState<UserResponse | null>(null);

    useEffect(() => {
        getUser().then(user => {
                setUser(user)
            }
        )
    }, [])

    useEffect(() => {
        if (user) {
            gerUserProfile(user.uid).then(
                profileResponse => setProfile(profileResponse)
            )
        }
    }, [user])

    const navigation = useNavigation()

    const bgColor = useThemeColor({light: 'white', dark: '#181818'}, "background")
    const borderColor = useThemeColor({light: 'lightgray', dark: 'black'}, "background")


    const [profile, setProfile] = useState<UserResponse | null>();
    const [hasChange, setHasChange] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const logout = () => {
        auth.signOut().then();
    }

    const handleBioChanged = (bio: string) => {
        if (profile) {
            setHasChange(true)
            setProfile({...profile, bio: bio})
        }
    }

    const handleAvatarChanged = (avatarUrl: string) => {
        if (profile) {
            setHasChange(true)
            setProfile({...profile, avatarUrl: avatarUrl})
        }
    }

    const update = () => {
        const bio = profile?.bio
        const avatarUrl = profile?.avatarUrl ?? ""
        if (hasChange) {
            const request: ProfileUpdateRequest = {bio: bio, avatarUrl: avatarUrl}
            setIsUpdating(true);
            updateProfile(request).then((profile) => {
                    setHasChange(false);
                    setIsUpdating(false);
                    setProfile(profile)
                    Toast.success({
                        duration: 0.5,
                        content: "Profile updated!",
                    });
                }
            )
        }
    }

    const navigateToProfile = (displayName: string) => {
        navigation.navigate('Root', {
            screen: "Home",
            params: {
                screen: "Profiles",
                params: {
                    displayName: displayName
                }
            }
        });
    }

    const uploadAndDisplay = async (uri: string) => {
        const responseUpload = await uploadAvatar(uri)
        handleAvatarChanged(responseUpload.url)
    };

    const handleImagePicked = async (pickerResult: ImagePicker.ImagePickerResult) => {
        try {
            if (pickerResult.cancelled) {
                console.log("Upload cancelled");
                return;
            } else {
                uploadAndDisplay(pickerResult.uri)
                    .then()
            }
        } catch (e) {
            console.log(e);
            alert("Upload failed");
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: false,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        await handleImagePicked(result);
    };

    const styles = StyleSheet.create({
        text: {
            borderTopWidth: 2,
            borderTopColor: "white",
        },
        container: {
            flex: 1,
            paddingTop: 16
        },
        input: {
            height: 100,
            backgroundColor: bgColor,
            color: useThemeColor({light: 'black', dark: 'white'}, "text"),
            width: "70%"
        },
        gridEntry: {
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 8,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: bgColor,
            borderTopWidth: 0.5,
            borderTopColor: "lightgray"
        },
        gridLabel: {
            width: "25%",
            fontWeight: "bold",
        }
    })


    return (
        <View style={styles.container}>
            {profile && user && (
                <View style={{flex: 1, alignItems: 'center', justifyContent: "flex-start", width: "100%"}}>

                    <Card style={{
                        padding: 8,
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        borderWidth: 0.5,
                        width: "100%",
                        maxWidth: 1200,
                    }}
                    >
                        <Card.Header
                            title={
                                <>
                                    {profile?.displayName && (
                                        <Text style={{fontSize: 20, paddingLeft: 20, color: tintColorLight}}
                                              onPress={() => navigateToProfile(profile.displayName)}>
                                            {profile.displayName}
                                        </Text>

                                    )}
                                </>
                            }
                            thumbStyle={{width: 60, height: 60, borderRadius: 50}}
                            thumb={
                                <View style={{backgroundColor: bgColor}}>
                                    <TouchableOpacity
                                        onPress={pickImage}
                                    >
                                        <Image
                                            style={{width: 50, height: 50, borderRadius: 25}}
                                            source={{uri: getAvatarUrl(profile)}}
                                        />
                                        <FontAwesome
                                            name={"camera"}
                                            color={tintColorLight}

                                            style={{position: "absolute", right: 0, bottom: 0}}
                                            size={15}
                                        ></FontAwesome>
                                    </TouchableOpacity>
                                </View>
                            }
                        >

                        </Card.Header>
                        <Card.Body>
                            <View style={styles.gridEntry}>
                                <Text style={styles.gridLabel}>Email</Text>
                                <Text>{user.email}</Text>
                            </View>
                            <View style={styles.gridEntry}>
                                <Text style={styles.gridLabel}>Login</Text>
                                <Text>{profile?.displayName}</Text>
                            </View>
                            <View style={styles.gridEntry}>
                                <Text style={styles.gridLabel}>Bio</Text>
                                <TextInput
                                    style={styles.input}
                                    multiline={true}
                                    maxLength={300}
                                    autoCorrect={false}
                                    onChangeText={handleBioChanged}
                                    value={profile?.bio}
                                />
                            </View>

                            <View style={{display: "flex", alignItems: "center", backgroundColor: bgColor}}>
                                <Button
                                    style={{marginTop: 8, width: '80%', maxWidth: 600}}
                                    type={"primary"}
                                    onPress={update}
                                    disabled={!hasChange || isUpdating}
                                    loading={isUpdating}
                                >Update</Button>

                                <Button
                                    style={{marginTop: 8, width: '80%', maxWidth: 600}}
                                    type={"warning"}
                                    onPress={logout}
                                >Logout</Button>
                            </View>
                        </Card.Body>
                    </Card>
                </View>
            )}

        </View>
    )
}



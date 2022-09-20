import {HomeStackScreenProps} from "../types";
import {Text, useThemeColor, View} from "./Themed";
import {Card} from "@ant-design/react-native";
import * as ImagePicker from 'expo-image-picker';
import {useState} from "react";
import {Dimensions, ImageBackground, Pressable, StyleSheet, TextInput, TouchableHighlight} from "react-native";
import {API_URL, ObjectUploadResponse, postTweet, uploadImage} from "../networking/api";
import {getWidth} from "../utils/screen";
import {FontAwesome} from "@expo/vector-icons";
import {tintColorLight} from "../constants/Colors";

export default function AddTweet({navigation, route}: HomeStackScreenProps<'AddTweet'>) {

    const [tweetContent, setTweetContent] = useState('');

    const [isPosting, setIsPosting] = useState(false);

    const attachments = (): number[] => {
        if(image) {
            return [image.id]
        } else {
            return []
        }
    }

    const handleTweetSubmitted = () => {
        setIsPosting(true);
        postTweet(tweetContent, attachments())
            .then(() => navigation.navigate('Feed'))
            .then(() => setIsPosting(false))
    }

    const [image, setImage] = useState<ObjectUploadResponse | null>(null);

    const uploadAndDisplay = async (uri: string) => {
        const responseUpload = await uploadImage(uri)
        setImage(responseUpload)
    };

    const handleImagePicked = async (pickerResult: ImagePicker.ImagePickerResult) => {
        try {
            if (pickerResult.cancelled) {
                alert("Upload cancelled");
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

        if (!result.cancelled) {
            setImage(null);
        }
    };

    const clearImage = () => {
        setImage(null)
    }

    const styles = StyleSheet.create({
        input: {
            height: Dimensions.get('window').height / 4,
            backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
            borderBottomColor: useThemeColor({light: 'lightgray', dark: 'white'}, "background"),
            borderBottomWidth: 0.5,
            padding: 10,
            color: useThemeColor({light: 'black', dark: 'white'}, "text"),
        },
    });

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <View
                style={{
                    backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
                    width: getWidth()
                }}
            >
                <Pressable style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    padding: 10,
                    justifyContent: "space-between"
                }}>
                    <Text
                        style={{color: tintColorLight, padding: 8}}
                        onPress={() => handleTweetSubmitted()}>Tweet</Text>
                    <Text
                        style={{color: 'red', padding: 8}}
                        onPress={() => navigation.goBack()}
                    >Cancel</Text>
                </Pressable>

                <Card
                    style={
                        {
                            borderWidth: 0,
                            padding: 8,
                            backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
                        }
                    }
                >
                    <Card.Header title={<Text>Tweet anything you like</Text>}/>
                    <Card.Body style={{
                        padding: 10,
                        backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background")
                    }}>

                        <TextInput
                            style={styles.input}
                            autoFocus={true}
                            value={tweetContent}
                            onChangeText={(text) => {
                                setTweetContent(text)
                            }}
                            multiline={true}
                            placeholder="What's on your mind?"
                            autoCorrect={false}
                            placeholderTextColor={useThemeColor({light: 'gray', dark: 'gray'}, "background")}
                            keyboardType="twitter"
                        />
                        <FontAwesome
                            name={"photo"}
                            color={tintColorLight}
                            size={24}
                            style={{marginTop: 8}}
                            onPress={pickImage}
                        ></FontAwesome>

                        <Text style={{marginTop: 8}}>
                            {image && (
                                <ImageBackground
                                    source={{uri: `${API_URL}/attachments/${image.id}`}}
                                    style={{width: 100, height: 100}}
                                >
                                    <TouchableHighlight>
                                        <FontAwesome
                                            name={"close"}
                                            color={"red"}
                                            size={24}
                                            style={{marginRight: 8}}
                                            onPress={clearImage}
                                        ></FontAwesome>
                                    </TouchableHighlight>
                                </ImageBackground>)
                            }
                        </Text>
                    </Card.Body>
                </Card>
            </View>
        </View>
    )
}

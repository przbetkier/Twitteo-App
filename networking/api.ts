import {Tweet, TweetPageResponse} from "../components/Feed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserResponse} from "../components/profile/Profile";
import {SearchResult} from "../screens/SearchScreen";
import {Platform} from "react-native";
import {toExtension} from "../utils/mime";
import {getBlobFromUri} from "../utils/blob";

// const API_URL = "http://167.99.129.28:8080"
export const API_URL = "http://localhost:8080"

export const getUser = async (): Promise<any> => {
    const user = await AsyncStorage.getItem('user')
    if (user) {
        return JSON.parse(user)
    }
    return null
}

const headers = (token: string) => {
    return {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
}

export const getFeed = async (page: number): Promise<TweetPageResponse> => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken
    const response = await fetch(`${API_URL}/tweets/feed?page=${page}&size=15`, headers(token))
    return await response.json() as TweetPageResponse
}

export const getUserPosts = async (userId: string, page: number): Promise<Tweet[]> => {
    const response = await fetch(`${API_URL}/tweets/${userId}?page=${page}&size=15`)
    return await response.json() as Tweet[]
}

export const getHashtagPosts = async (name: string, page: number): Promise<Tweet[]> => {
    const response = await fetch(`${API_URL}/tags/${name}/tweets?page=${page}&size=15`)
    return await response.json() as Tweet[]
}

export const gerUserProfile = async (userId: string): Promise<UserResponse> => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken
    const response = await fetch(`${API_URL}/users/${userId}`, headers(token))
    return await response.json() as UserResponse
}

export const gerUserProfileByDisplayName = async (displayName: string): Promise<UserResponse> => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken
    const response = await fetch(`${API_URL}/users/?displayName=${displayName}`, headers(token))
    return await response.json() as UserResponse
}

export const postTweet = async (content: string, attachments: number[]): Promise<Tweet> => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken
    // FIXME: Not nullable userId on backend but it's obsolete and not used
    const response = await fetch(`${API_URL}/tweets`, {
        headers: {
            ...headers(token).headers,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({content: content, attachments: attachments}),
    })
    return response.json()
}

export const deleteTweet = async (tweetId: string): Promise<any> => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken

    return await fetch(`${API_URL}/tweets/${tweetId}`, {
        headers: {
            ...headers(token).headers,
        },
        method: 'DELETE',
    })
}


export const uploadImage = async (imageUri: string): Promise<ObjectUploadResponse> => {
    const URL_ATTACHMENT_UPLOAD_URL = `${API_URL}/attachments`
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken

    const formData = new FormData();

    if (Platform.OS === 'web') {
        const blob = await getBlobFromUri(imageUri);
        const extension = toExtension(blob.type)
        formData.append('file', blob, `file.${extension}`);
    } else {
        const fileName = imageUri.split('/').pop();
        const fileType = fileName?.split('.').pop();

        formData.append("file", {
            uri: imageUri,
            type: fileType,
            name: fileName
        } as any)
    }

    return await fetch(URL_ATTACHMENT_UPLOAD_URL, {
        headers: {
            ...headers(token).headers,
        },
        method: "POST",
        body: formData,
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}

export const search = async (query: string): Promise<SearchResult> => {
    const response = await fetch(`${API_URL}/search?query=${query}`)
    return await response.json()
}

export const getFollowers = async (userId: string, page: number) => {
    const response = await fetch(`${API_URL}/users/${userId}/followers?page=${page}&size=10`)
    return await response.json() as FollowersResponse
}

export const getFollowees = async (userId: string, page: number) => {
    const response = await fetch(`${API_URL}/users/${userId}/followees?page=${page}&size=10`)
    return await response.json() as FolloweesResponse
}

export const getFollowerState = async (userId: string) => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken

    const response = await fetch(`${API_URL}/users/${userId}/follower-state`, headers(token))
    return await response.json() as FollowerState
}

export const follow = async (userId: string) => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken

    const response = await fetch(`${API_URL}/users/${userId}/followers`, {
        headers: {
            ...headers(token).headers,
        },
        method: 'POST'
    })
    return await response.json() as FollowerState
}

export const unfollow = async (userId: string) => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken

    const response = await fetch(`${API_URL}/users/${userId}/followers`, {
        headers: {
            ...headers(token).headers,
        },
        method: 'DELETE'
    })
    return await response.json() as FollowerState
}

export const getTweetLikeState = async (tweetId: string) => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken

    const response = await fetch(`${API_URL}/tweets/${tweetId}/like-state`, {
        headers: {
            ...headers(token).headers,
        }
    })
    return await response.json() as TweetLikeStateResponse
}

export const likeTweet = async (tweetId: string, like: boolean) => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken

    const response = await fetch(`${API_URL}/tweets/${tweetId}/${like ? "like": "unlike"}`, {
        headers: {
            ...headers(token).headers,
        },
        method: "POST"
    })
    return await response.json() as TweetLikeStateResponse
}

export const signUp = async (token: string, displayName: string) => {
    return await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({displayName: displayName})
    });
}

export enum TweetLikeState {
    CAN_LIKE = "CAN_LIKE",
    CAN_UNLIKE = "CAN_UNLIKE"
}

export interface TweetLikeStateResponse {
    state: TweetLikeState;
    likes: number;
}

export interface BasicUserResponse {
    userId: string;
    displayName: string;
}

export interface ObjectUploadResponse {
    id: number,
    name: string
}


export interface FollowersResponse {
    followers: BasicUserResponse[]
}

export interface FolloweesResponse {
    followees: BasicUserResponse[]
}

export enum FollowerState {
    FOLLOWS = "FOLLOWS",
    DOES_NOT_FOLLOW = "DOES_NOT_FOLLOW",
    CANNOT_FOLLOW = "CANNOT_FOLLOW"

}

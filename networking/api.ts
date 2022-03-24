import {Tweet, TweetPageResponse} from "../components/Feed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserResponse} from "../components/Profile";

const API_URL = "http://167.99.129.28:8080"

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
    const response = await fetch(`${API_URL}/tweets/feed?page=${page}&size=8`, headers(token))
    return await response.json() as TweetPageResponse
}

export const gerUserProfile = async (userId: string): Promise<UserResponse> => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken
    const response = await fetch(`${API_URL}/users/${userId}`, headers(token))
    return await response.json() as UserResponse
}

export const postTweet = async (content: string): Promise<Tweet> => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken
    // FIXME: Not nullable userId on backend but it's obsolete and not used
    const response = await fetch(`${API_URL}/tweets`, {
        headers: {
            ...headers(token).headers,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({userId: 'FIXME', content: content}),
    })
    return response.json()
}

import {Tweet, TweetPageResponse} from "../components/Feed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserResponse} from "../components/profile/Profile";
import {SearchResult} from "../screens/SearchScreen";

// const API_URL = "http://167.99.129.28:8080"
const API_URL = "http://localhost:8080"

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
    console.log("Getting feed for page " + page);
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

export const search = async (query: string): Promise<SearchResult> => {
    const response = await fetch(`${API_URL}/search?query=${query}`)
    return await response.json()
}

import {Tweet} from "../components/Feed";
import {API_URL} from "./api";
import {UserResponse} from "../components/profile/Profile";

export const getMostLikedTweets = async () => {
    const response = await fetch(`${API_URL}/trending/tweets/most-liked`)
    return await response.json() as Tweet[]
}

export const getMostDiscussedTweets = async () => {
    const response = await fetch(`${API_URL}/trending/tweets/most-discussed`)
    return await response.json() as Tweet[]
}

export const getMostFollowedUsers = async () => {
    const response = await fetch(`${API_URL}/trending/users/most-followed`)
    return await response.json() as TrendingUserResponse[]
}

export interface TrendingMetadata {
    key: string;
    score: number;
}

export interface TrendingUserResponse {
    user: UserResponse;
    metadata: TrendingMetadata;
}

import {API_URL, getUser, headers} from "./api";
import {Tweet} from "../components/Feed";
import {UserResponse} from "../components/profile/Profile";

export const getLikedByPeopleYouFollow = async () => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken
    const response = await fetch(`${API_URL}/recommendations/tweets/liked-by-followees`, headers(token))
    return await response.json() as Tweet[]
}

export const getRecommendedUsers = async () => {
    const user = await getUser()
    const token = await user.stsTokenManager.accessToken
    const response = await fetch(`${API_URL}/recommendations/users/to-follow`, headers(token))
    return await response.json() as RecommendedUserResponse[]
}

export interface RecommendedUserResponse {
    user: UserResponse;
    metadata: RecommendedUserMetadata;
}

export interface RecommendedUserMetadata {
    followedBy: string[]
}

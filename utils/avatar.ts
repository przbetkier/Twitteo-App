import {UserResponse} from "../components/profile/Profile";

export const getAvatarUrl = (user: UserResponse): string => {
    return user.avatarUrl !== "" && user.avatarUrl !== null ? user.avatarUrl : `https://i.pravatar.cc/150?u=${user.userId}`
}

import {Dimensions, Platform} from "react-native";

export const getWidth = () => {
    return Dimensions.get('window').width < 1200 ? "100%" : "1200px";
}

export const getPageSidePadding = (): number => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
        return 0;
    }
    return 6;
}

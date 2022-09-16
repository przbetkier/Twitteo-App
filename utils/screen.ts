import {Dimensions} from "react-native";

export const getWidth = () => {
    return Dimensions.get('window').width < 1200 ? "100%": "1200px";
}

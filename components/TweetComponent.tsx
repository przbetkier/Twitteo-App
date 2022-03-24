import {Tweet} from "./Feed";
import {Text, useThemeColor} from "./Themed"
import {Card, Flex, Tag, WhiteSpace} from "@ant-design/react-native";
import {formatDate} from "../utils/date-util";
import {tintColorLight} from "../constants/Colors";
import {TouchableOpacity} from "react-native";
import React from "react";

export interface TweetProps {
    tweet: Tweet;
    onProfileClicked: (userId: string) => void;
}

export const TweetComponent: React.FC<TweetProps> = ({tweet, onProfileClicked}) => {

    return (
        <>
            <Card
                style={
                    {
                        padding: 8,
                        backgroundColor: useThemeColor({light: 'white', dark: '#181818'}, "background"),
                        borderColor: useThemeColor({light: 'black', dark: ''}, "background")
                    }
            }
            >
                <Card.Header
                    title={
                        <Flex justify={"between"}>
                            <TouchableOpacity onPress={() => onProfileClicked(tweet.userId)}>
                                <Text style={{color: `${tintColorLight}`}}>{tweet.userName}</Text>
                            </TouchableOpacity>
                            <Text>{formatDate(tweet.createdAt)}</Text>
                        </Flex>
                    }
                    thumbStyle={{width: 30, height: 30}}
                    thumb={`https://i.pravatar.cc/150?u=${tweet.userId}`}
                />
                <Card.Body>
                    <Text style={{marginLeft: 16}}>
                        {tweet.content}
                    </Text>
                </Card.Body>
                <Card.Footer
                    content={<Flex justify={"start"}>
                        {tweet.hashtags.map(tag => {
                            return (
                                <Tag key={`${tweet.id}-${tag}`} style={{marginRight: 8}} selected>
                                    {tag}
                                </Tag>
                            )
                        })}
                    </Flex>}>
                </Card.Footer>
            </Card>
            <WhiteSpace/>
        </>
    )

}

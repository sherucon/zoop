import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useState } from "react";
import { useEffect } from "react";

import { Channel as ChannelType, StreamChat } from "stream-chat";
import { Channel, MessageList, MessageInput, useChatContext } from "stream-chat-expo";



export default function ChannelScreen() {
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const { cid } = useLocalSearchParams<{ cid: string }>();
    const { client } = useChatContext();



    const Spacer = ({ size = 10 }) => <View style={{ backgroundColor: "#fff", height: size }} />;

    useEffect(() => {
        const fetchChannel = async () => {
            const channels = await client.queryChannels({ cid });
            setChannel(channels[0])
        }

        fetchChannel();
    }, [cid]);


    if (!channel) {
        return (<ActivityIndicator />);
    }

    return (
        <Channel channel={channel}>
            <MessageList />
            <MessageInput />
            <Spacer />
        </Channel>
    )
}

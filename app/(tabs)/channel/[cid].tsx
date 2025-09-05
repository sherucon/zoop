import { useLocalSearchParams, useNavigation } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useEffect, useLayoutEffect, useState } from "react";

import { Channel as ChannelType } from "stream-chat";
import { Channel, MessageInput, MessageList, useChatContext } from "stream-chat-expo";

import { useUserProfile } from "../../../firebase/useuserprofile";

export default function ChannelScreen() {
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const { cid } = useLocalSearchParams<{ cid: string }>();
    const { client } = useChatContext();
    const navigation = useNavigation();

    const {
        userProfile,
        uid,
        age,
        gender,
        lookingFor,
        photoUrl,
        firstTime,
        username,
        updateAge,
        updateGender,
        updateLookingFor,
        updateUsername,
        updateUserPfp,
        updateFirstTime
    } = useUserProfile();

    const Spacer = ({ size = 10 }) => <View style={{ backgroundColor: "#fff", height: size }} />;

    useEffect(() => {
        const fetchChannel = async () => {

            const channels = await client.queryChannels({ cid: { $eq: cid } });
            setChannel(channels[0])
        }

        fetchChannel();
    }, [cid]);


    useLayoutEffect(() => {
        const setHeader = async () => {
            if (!channel) return;

            try {
                // Get all members in the channel
                const result = await channel.queryMembers({});
                const members = result.members || [];

                // Pick the other user (not me)
                const otherMember = members.find(m => m.user?.id !== client.userID);

                navigation.setOptions({
                    title: otherMember?.user?.name || channel.data?.name || "Chat",
                });
            } catch (err) {
                console.error("Error fetching members:", err);
                navigation.setOptions({ title: "Chat" });
            }
        };

        setHeader();
    }, [channel, client.userID, navigation]);

    if (!channel) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <Channel channel={channel}>
            <MessageList />
            <MessageInput />
            <Spacer />
        </Channel>
    )
}

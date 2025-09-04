import { Text, View, StyleSheet, Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { router } from 'expo-router';

import { useUserProfile } from '@/firebase/useuserprofile';
import { useAuth } from "../components/AuthContext";
import { Channel, ChannelList, MessageInput, MessageList, OverlayProvider } from 'stream-chat-expo';
import { Channel as ChannelType, StreamChat } from "stream-chat";
import PressableButton from '../components/PressableButton';


export default function index() {
    const { user, loading } = useAuth();
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


    return (
        <View style={styles.Container}>
            <ChannelList
                filters={{ members: { $in: [uid] } }}
                sort={{ last_message_at: -1 }}
                options={{ state: true, watch: true, presence: true }}
                onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
            />
            <Pressable style={styles.FloatingBox}>
                <FontAwesome6 name="plus" size={24} color="white" />
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    FloatingBox: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 15,
        right: 15,
        width: 60,
        height: 60,
        backgroundColor: "#007AFF",
        borderRadius: 8,
    },
});

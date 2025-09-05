import { Text, View, StyleSheet, Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { router } from 'expo-router';

import { useUserProfile } from '@/firebase/useuserprofile';
import { db } from '@/firebase/firebaseconfig';
import { useAuth } from "../components/AuthContext";
import { Channel, ChannelList, MessageInput, MessageList, OverlayProvider } from 'stream-chat-expo';
import { Channel as ChannelType, StreamChat, } from "stream-chat";
import PressableButton from '../components/PressableButton';


import { collection, query, getDocs, where } from 'firebase/firestore';
import { client } from '../components/ChatProvider';


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


    const getRandomUser = async (lookingFor: string) => {
        try {
            // 1. Get all existing chat partners
            const channels = await client.queryChannels({ members: { $in: [uid] } });
            const chattedUserIds = new Set<string>();

            channels.forEach(channel => {
                const members = Object.keys(channel.state.members);
                members.forEach(memberId => {
                    if (memberId !== uid) {
                        chattedUserIds.add(memberId);
                    }
                });
            });

            // 2. Build Firestore query
            const usersRef = collection(db, "users");
            let q;

            if (lookingFor === "male") {
                q = query(usersRef, where("gender", "==", "male"));
            } else if (lookingFor === "female") {
                q = query(usersRef, where("gender", "==", "female"));
            } else {
                q = query(usersRef); // both
            }

            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                console.log("No users found for:", lookingFor);
                return null;
            }

            // 3. Filter out current user + already chatted users
            const candidates = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => user.id !== uid && !chattedUserIds.has(user.id));

            if (candidates.length === 0) {
                console.log("No new users available.");
                return null;
            }

            // 4. Pick a truly random candidate
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const randomUser = candidates[randomIndex];

            console.log("Picked random user:", randomUser.id);
            return randomUser.id;

        } catch (error) {
            console.error("Error picking random user:", error);
            return null;
        }
    };

    const connectRandom = async (randomUser: string | null) => {
        if (!randomUser) {
            return ("No connectable user");
        }


        const channel = client.channel("messaging", {
            members: [uid!, randomUser]
        });
        await channel.watch();
        router.push(`/channel/${channel.cid}`);
    }


    return (
        <View style={styles.Container}>
            <ChannelList
                filters={{ members: { $in: [uid] } }}
                sort={{ last_message_at: -1 }}
                options={{ state: true, watch: true, presence: true }}
                onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
            />
            <Pressable style={styles.FloatingBox} onPress={async () => {
                const channel = await connectRandom(await getRandomUser(lookingFor));
            }}>
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
        borderRadius: 30,
    },
});

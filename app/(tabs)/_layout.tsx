import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { useUserProfile } from '@/firebase/useuserprofile';

import { useEffect } from 'react';
import { StreamChat, } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuth } from '../components/AuthContext';

export default function TabLayout() {

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

    const { user, signOut, refreshUserProfile } = useAuth();
    const client = StreamChat.getInstance("xgae7qrdrnm4");
    console.log("Client created");

    useEffect(() => {

        const connect = async () => {
            await client.connectUser(
                {
                    id: uid!,
                    name: username,
                    image: photoUrl,
                },
                client.devToken(uid!),
            );
            const channel = client.channel("messaging", "the_park", { name: "The Park" });
            await channel.create();
            await channel.addMembers([uid!])
            await channel.watch();
        };

        connect();
    });

    return (

        <OverlayProvider>
            <Chat client={client}>
                <Tabs>
                    <Tabs.Screen name="index" options={{
                        title: 'Chat', headerShown: true, tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={24} color={focused ? "#007AFF" : "#8E8E8F"} />)
                    }} />
                    <Tabs.Screen name="profile" options={{
                        title: 'Profile', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={24} color={focused ? "#007AFF" : "#8E8E8F"} />), headerRight: () => (
                            <Pressable onPress={() => { router.navigate("../signin"); signOut(); }} style={{ padding: 10 }}>
                                <Text style={{ color: "red" }}>Sign out</Text>
                            </Pressable>
                        ),
                    }} />
                    <Tabs.Screen name="onboarding" options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' } }} />
                    <Tabs.Screen name="channel" options={{ href: null, tabBarStyle: { display: 'none' } }} />

                </Tabs>
            </Chat>
        </OverlayProvider>
    );
}

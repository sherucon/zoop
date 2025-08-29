import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text } from 'react-native';

import { useAuth } from '../components/AuthContext';

export default function TabLayout() {

    const { signOut } = useAuth();

    return (
        <Tabs>
            <Tabs.Screen name="index" options={{
                title: 'Chat', headerShown: false, tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={24} color={focused ? "#007AFF" : "#8E8E8F"} />)
            }} />
            <Tabs.Screen name="profile" options={{
                title: 'Profile', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={24} color={focused ? "#007AFF" : "#8E8E8F"} />), headerRight: () => (
                    <Pressable onPress={signOut} style={{ padding: 10 }}>
                        <Text style={{ color: "red" }}>Sign out</Text>
                    </Pressable>
                ),
            }} />
        </Tabs>
    );
}

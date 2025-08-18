import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{
                title: 'Chat', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={24} color={focused ? "#007AFF" : "#8E8E8F"} />)
            }} />
            <Tabs.Screen name="profile" options={{
                title: 'Profile', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={24} color={focused ? "#007AFF" : "#8E8E8F"} />)
            }} />
        </Tabs>
    );
}

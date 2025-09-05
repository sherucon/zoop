import { Stack } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from "react-native";
import { router } from "expo-router";

export default function ChannelStack() {
    return (
        <Stack>
            <Stack.Screen name="[cid]" options={{
                headerBackVisible: true, headerBackButtonDisplayMode: "minimal", headerLeft: () => (
                    <Pressable onPress={router.back}>
                        <Ionicons name="chevron-back-outline" size={24} color="#007AFF" style={{ paddingLeft: 5 }} />
                    </Pressable>)
            }} />
        </Stack>
    )
}

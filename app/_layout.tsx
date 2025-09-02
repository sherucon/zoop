import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from './components/AuthContext';

function InnerStack() {
    const { user } = useAuth();

    return (
        <Stack>
            <Stack.Protected guard={!!user}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Screen name="signin" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <InnerStack />
        </AuthProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

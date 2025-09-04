import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from './components/AuthContext';

function InnerStack() {
    const { user } = useAuth();

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.container}>
                <Stack>
                    <Stack.Protected guard={!!user}>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack.Protected>
                    <Stack.Screen name="signin" options={{ headerShown: false }} />
                    <Stack.Screen name="signup" options={{ headerShown: false }} />
                </Stack>
            </GestureHandlerRootView>
        </SafeAreaProvider>
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

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Text, TextInput, View, Button } from 'react-native';
import { router } from "expo-router";



import { app } from "@/firebase/firebaseconfig";
import { navigate } from "expo-router/build/global-state/routing";

export default function index() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>OK NIGGA</Text>
            <Button title="go" onPress={() => router.push("/signin")} />
        </View>
    )
}

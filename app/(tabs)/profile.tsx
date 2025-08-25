import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useAuth } from '../components/AuthContext';


export default function profile() {

    const { user, loading } = useAuth();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{user ? user?.uid : "Not logged in Nigga"}</Text>
        </View>
    )
}

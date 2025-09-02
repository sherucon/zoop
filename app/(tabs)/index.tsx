import { Text, View } from 'react-native';




import { useUserProfile } from '@/firebase/useuserprofile';
import { useAuth } from "../components/AuthContext";


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
        <View>
            <Text>Hello</Text>
        </View>
    )
}

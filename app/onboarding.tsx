import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, Dimensions } from 'react-native';


import { useAuth, } from './components/AuthContext';
import { useUserProfile } from '@/firebase/useuserprofile';
import PressableButton from './components/PressableButton';


export default function onboarding() {
    const { user, loading } = useAuth();

    let [usernameModalShown, setUsernameModalShown] = useState<boolean>(false);

    let [localUsername, setLocalUsername] = useState("");
    let [localAge, setLocalAge] = useState<number>();
    let [localGender, setLocalGender] = useState("");
    let [localLookingFor, setLocalLookingFor] = useState("");
    let [localPhotoUrl, setLocalPhotoUrl] = useState("");

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

    useEffect(() => {
        if (userProfile) {
            setLocalAge(age);
            setLocalUsername(userProfile.username);
            setLocalPhotoUrl(`https://sherucon.tech/pfps/${userProfile.uid}.webp?t=${Date.now()}`);
        }
    }, [age, username, userProfile]);

    return (
        <View style={styles.Container}>
            <View style={styles.PfpContainer}>
                <Image style={styles.Pfp} />
                <Text style={styles.Username} onPress={() => setUsernameModalShown(true)} >{username}</Text>
                <Text style={styles.Email}>{userProfile?.email}</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Modal visible={usernameModalShown} transparent={true} animationType='slide' style={{ width: "90%", }}>
                        <View style={styles.ModalContainer}>
                            <Text style={{ alignSelf: "flex-start", fontSize: 25, padding: 10, }}>Enter new username</Text>
                            <TextInput value={localUsername} style={styles.TextInput} />
                            <View style={{ padding: 10, flexDirection: "row", gap: 10, alignSelf: "flex-end" }}>
                                <PressableButton style={styles.unButton} label='Close' onPress={() => { setUsernameModalShown(false) }} />
                                <PressableButton style={styles.unButton} label='Submit' onPress={() => { updateUsername(localUsername); setUsernameModalShown(false) }} />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
            <View style={styles.SlipContainer}>
                <View style={styles.Slip}>
                    <Text>Age</Text>
                </View>
                <View style={styles.Slip}>
                    <Text>Gender</Text>
                </View>
                <View style={styles.Slip}>
                    <Text>Looking for</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Pfp: {
        width: 170,
        height: 170,
        verticalAlign: "middle",
        borderWidth: 2,
        borderRadius: 85,
        borderColor: "#007AFF"

    },
    PfpContainer: {
        alignSelf: "center",
        flex: 1 / 2,
        alignItems: "center",
        flexDirection: "column",
    },
    Slip: {
        justifyContent: "center",
        width: "90%",
        backgroundColor: "#E8E8E8",
        borderRadius: 15,
        padding: 15
    },
    SlipContainer: {
        flex: 1 / 4,
        gap: 10,
        width: "100%",
        alignItems: "center"
    },
    ModalContainer: {
        flex: 0,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: '#fff',
        marginHorizontal: '5%',
        marginTop: '15%',
        borderRadius: 25,
        alignItems: "center",
        //height: '30%',
        width: '90%',
        borderColor: "#007AFF",
        borderWidth: 2
    },
    Username: {
        color: "#2E2E2E",
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        fontSize: 20,
        padding: 5
    },
    Email: {
        color: "#9FA1A0",
        fontSize: 13
    },
    unButton: {
        width: 90
    },
    TextInput: {
        padding: 10,
        backgroundColor: "#E8E8E8",
        borderRadius: 10,
        width: 0.9 * Dimensions.get('window').width - 20,
    }

})




//await updateDoc(docRef, { firstTime: false });

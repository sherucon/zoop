import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


import { useUserProfile } from '@/firebase/useuserprofile';
import { useAuth, } from '../components/AuthContext';
import PressableButton from '../components/PressableButton';
import SmallSelector from '../components/SmallSelector';


export default function onboarding() {
    const { user, loading } = useAuth();

    let [usernameModalShown, setUsernameModalShown] = useState<boolean>(false);
    let [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);

    let [localUsername, setLocalUsername] = useState("Zooper");
    let [localAge, setLocalAge] = useState("18");
    let [localGender, setLocalGender] = useState("");
    let [localLookingFor, setLocalLookingFor] = useState("");
    const defaultPfp = require('@/assets/images/default_pfp.png');
    let [localPhotoUrl, setLocalPhotoUrl] = useState<string | number>(defaultPfp);

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


    const pickImageAsync = async () => {
        console.log('pickImageAsync called');
        try {
            // defensive: ensure ImagePicker functions exist
            if (!ImagePicker.requestMediaLibraryPermissionsAsync) {
                console.error('ImagePicker.requestMediaLibraryPermissionsAsync is not a function', ImagePicker);
                alert('Image picker is not available on this platform.');
                return;
            }

        } catch (e) {
            console.error('Error before requesting permissions', e);
            alert('Unexpected error launching image picker. See console.');
            return;
        }
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // older/newer SDKs may return { status } or { granted }
        if (!(permissionResult as any).granted && (permissionResult as any).status !== 'granted') {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            aspect: [1, 1]
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;

            // show immediate preview
            setLocalPhotoUrl(selectedImageUri);

            try {
                // Upload to server
                const filename = selectedImageUri.split('/').pop() || 'upload.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                const formData = new FormData();
                formData.append('uuid', user?.uid || '');
                formData.append('pfp', {
                    uri: selectedImageUri,
                    name: filename,
                    type: type,
                } as any);

                const response = await fetch('https://sherucon.tech/uploadPfp', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    const text = await response.text();
                    console.error('Non-JSON response from upload:', text);
                    throw new Error('Server did not return valid JSON');
                }

                if (data.success) {
                    alert('Upload successful!');
                    // After successful upload, update Firestore with the hosted URL
                    if (user?.uid) {
                        await updateUserPfp(`https://sherucon.tech/pfps/${user.uid}.webp`);
                        // show hosted image (cache-busted)
                        setLocalPhotoUrl(`https://sherucon.tech/pfps/${user.uid}.webp?t=${Date.now()}`);
                    }
                } else {
                    console.error('Upload failed response:', data);
                    alert('Upload failed: ' + (data.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Upload error', error);
                alert('Upload error. Check console for details.');
            }
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            if (userProfile) {
                setLocalAge(age.toString());
                if (!usernameModalShown) setLocalUsername(username || "");

                const url = `https://sherucon.tech/pfps/${userProfile.uid}.webp?t=${Date.now()}`;

                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        const res = await fetch(url, { method: 'HEAD' }); //check if image exists
                        if (res.ok) {
                            setLocalPhotoUrl(url);
                            break;
                        } else {
                            console.log("error in pfp setting")
                            setLocalPhotoUrl(defaultPfp);
                        }
                    } catch (err) {
                        setLocalPhotoUrl(defaultPfp);
                    }
                }
            }
        };

        loadProfile();
    }, [age, username, userProfile]);

    const handleAgeUpdate = async () => {
        const numAge = parseInt(localAge);
        if (!isNaN(numAge) && numAge > 0 && numAge < 100) {
            await updateAge(numAge);
        }
    };

    const handleUsernameUpdate = async () => {
        const trimmedUsername = localUsername.trim();
        if (trimmedUsername && trimmedUsername.length > 0) {
            await updateUsername(trimmedUsername);
        }
    };

    if (firstTime == false) {
        router.navigate("/(tabs)");
        return (
            <View>
                <Text>Hello</Text>
            </View>
        )
    }
    else {
        return (
            <View style={styles.Container}>
                <View style={styles.PfpContainer}>
                    <Pressable onPress={pickImageAsync}>
                        <Image style={styles.Pfp} source={typeof localPhotoUrl === 'string' ? { uri: localPhotoUrl } : localPhotoUrl} />
                        <View style={{
                            position: 'absolute',
                            bottom: 6,
                            right: 10,
                            backgroundColor: '#007AFF',
                            borderRadius: 15,
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <MaterialCommunityIcons name="account-edit" size={16} color="#fff" />
                        </View>
                    </Pressable>
                    <TextInput
                        style={styles.Username}
                        numberOfLines={1}
                        autoCapitalize='none'
                        value={localUsername}
                        onChangeText={setLocalUsername}
                        onFocus={() => setIsEditingUsername(true)}
                        onEndEditing={() => {
                            setIsEditingUsername(false);
                            handleUsernameUpdate();
                        }}
                        placeholder="Username"
                        placeholderTextColor="#C0C0C0"
                    />
                    <Text style={styles.Email}>{userProfile?.email}</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Modal visible={usernameModalShown} transparent={true} animationType='slide' style={{ width: "90%", }}>
                            <View style={styles.ModalContainer}>
                                <Text style={{ alignSelf: "flex-start", fontSize: 25, padding: 10, }}>Enter new username</Text>
                                <TextInput
                                    style={styles.Username}
                                    numberOfLines={1}
                                    autoCapitalize='none'
                                    value={localUsername}
                                    onChangeText={setLocalUsername}
                                    onFocus={() => setIsEditingUsername(true)}
                                    onEndEditing={() => {
                                        setIsEditingUsername(false);
                                        handleUsernameUpdate();
                                    }}
                                    placeholder="Username"
                                    placeholderTextColor="#C0C0C0"
                                />
                                <View style={{ padding: 10, flexDirection: "row", gap: 10, alignSelf: "flex-end" }}>
                                    <PressableButton style={styles.unButton} label='Close' onPress={() => { setUsernameModalShown(false) }} />
                                    <PressableButton style={styles.unButton} label='Submit' onPress={() => { handleUsernameUpdate(); setUsernameModalShown(false) }} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
                <View style={styles.SlipContainer}>
                    <View style={styles.Slip}>
                        <Text>Age</Text>
                        <SmallSelector
                            onPress={() => { }}
                        />

                        <TextInput
                            editable={true}
                            value={localAge}
                            onChangeText={setLocalAge}
                            onEndEditing={handleAgeUpdate}
                            placeholder="Enter age"
                            placeholderTextColor="#808080"
                            keyboardType="numeric"
                            style={{ color: '#007AFF', fontSize: 16, minWidth: 60, textAlign: 'right', padding: 0 }}
                        />
                    </View>
                    <View style={styles.Slip}>
                        <Text>Gender</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <SmallSelector
                                onPress={() => updateGender('male')}
                                icon={<Ionicons
                                    name="male"
                                    size={25}
                                    color={gender === 'male' ? '#007AFF' : '#C0C0C0'}
                                />}
                            />
                            <SmallSelector
                                onPress={() => updateGender('female')}
                                icon={<Ionicons
                                    name="female"
                                    size={25}
                                    color={gender === 'female' ? '#007AFF' : '#C0C0C0'}
                                />}
                            />
                        </View>
                    </View>
                    <View style={styles.Slip}>
                        <Text>Looking for</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <SmallSelector
                                onPress={() => updateLookingFor('male')}
                                icon={<Ionicons
                                    name="male"
                                    size={25}
                                    color={lookingFor === 'male' ? '#007AFF' : '#C0C0C0'}
                                />}
                            />
                            <SmallSelector
                                onPress={() => updateLookingFor('female')}
                                icon={<Ionicons
                                    name="female"
                                    size={25}
                                    color={lookingFor === 'female' ? '#007AFF' : '#C0C0C0'}
                                />}
                            />
                            <SmallSelector
                                onPress={() => updateLookingFor('both')}
                                icon={<Ionicons
                                    name="male-female"
                                    size={25}
                                    color={lookingFor === 'both' ? '#007AFF' : '#C0C0C0'}
                                />}
                            />
                        </View>
                    </View>

                    <PressableButton style={styles.Button} label='Proceed' onPress={() => { updateFirstTime(false); router.navigate("/(tabs)"); }} />
                </View>
            </View >
        );
    }
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
        borderColor: "#007AFF",
        aspectRatio: 1

    },
    PfpContainer: {
        alignSelf: "center",
        flex: 1 / 2,
        alignItems: "center",
        flexDirection: "column",
    },
    Slip: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        backgroundColor: "#E8E8E8",
        borderRadius: 15,
        padding: 15,
    },
    SlipContainer: {
        flex: 1 / 4,
        gap: 10,
        width: "100%",
        alignItems: "center"
    },
    ModalContainer: {
        flex: 0,
        top: 300,
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
    },
    Button: {
        width: 90,
        alignSelf: "flex-end",
        marginRight: "5%"
    },

})




//await updateDoc(docRef, { firstTime: false });

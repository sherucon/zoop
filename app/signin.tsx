import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, TextInput, View } from 'react-native';
import { useAuth } from './components/AuthContext';


import { auth, db } from '@/firebase/firebaseconfig';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";


import PressableButton from './components/PressableButton';
import SecondaryButton from './components/SecondaryButton';
import TermsAndConditions from './components/TNC';
import TypingText from "./components/TypingText";

const Spacer = ({ size = 20 }) => <View style={{ height: size }} />;

const logo = require('@/assets/images/zoop-trans-logo.png');


export default function signin() {
    const { user, loading } = useAuth();

    // If already signed in, redirect to protected (tabs)
    useEffect(() => {
        if (!loading && user) {
            router.replace('/onboarding');
        }
    }, [user, loading]);

    const [Email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // temporary user variable removed; use value from signIn response directly


    const isValidEmail = (s: string) => {
        const trimmed = s.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    };

    let [TNCShown, setShowTNC] = useState<boolean>(false);


    const handleSignin = () => {
        signInWithEmailAndPassword(auth, Email, password)
            .then(async (userCredential) => {
                const signedInUser = userCredential.user;
                console.log(signedInUser)
                if (signedInUser?.emailVerified == true) {
                    console.log("Signed in successfully");
                    const docRef = doc(db, "users", signedInUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (!docSnap.exists()) {
                        initUser(signedInUser)
                    }
                    router.navigate("/onboarding")
                }
                else {
                    auth.signOut();
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);

                if (errorCode === "auth/invalid-credential") {
                    Alert.alert('Sign up failed', 'Invalid credentials');
                }
                else {
                    Alert.alert('Sign up failed', errorMessage + "Please report this" || 'Unknown error' + "Please report this");
                }
            });
    }


    const initUser = async (user: User) => {
        try {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                username: "Zooper",
                photoUrl: "https://sherucon.tech/pfps/default_pfp.webp",
                age: 18,
                gender: "male",
                lookingFor: "both",
                firstTime: true
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <View style={styles.Container}>
            <View style={{ flex: 1 / 2 }}>
                <Image source={logo} style={styles.HeroLogo} />
            </View>

            <Spacer size={100} />
            <View style={{ width: "100%", alignItems: 'center', flex: 1 / 2 }}>
                <TextInput style={styles.TextInput} placeholder='Enter your email here' placeholderTextColor={"#C0C0C0"} value={Email} onChangeText={setEmail} inputMode="email" autoCapitalize='none' />
                {Email.length > 0 && !isValidEmail(Email) ? (<TypingText text="• enter a valid email" delay={6} />) : null}
                <TextInput style={[styles.TextInput, { marginTop: 5 }]} placeholder='Enter your password here' placeholderTextColor={"#C0C0C0"} value={password} onChangeText={setPassword} secureTextEntry />

                <PressableButton style={styles.SigningButton} label='Sign in' onPress={handleSignin} />
                <SecondaryButton label='Not a user already? Sign up →' onPress={() => router.navigate("/signup")} />
                <SecondaryButton label='Terms and Conditions' onPress={() => setShowTNC(true)} />
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Modal visible={TNCShown} transparent={true} animationType='slide' style={{ width: "90%" }}>
                    <View style={styles.ModalContainer}>
                        <TermsAndConditions />
                        <View style={{ padding: 10, }}>
                            <PressableButton label='Close' onPress={() => setShowTNC(false)} />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}





const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
    },
    ModalContainer: {
        flex: 0,
        backgroundColor: '#fff',
        marginLeft: '5%',
        marginTop: '15%',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: '80%',
        width: '90%',
        borderColor: "#007AFF",
        borderWidth: 2
    },
    HeroLogo: {
        top: 50,
        aspectRatio: 1,
        height: 0.45 * Dimensions.get('window').height,
    },
    TextInput: {
        backgroundColor: "#E8E8E8",
        paddingVertical: 15,
        width: "90%",
        borderRadius: 15,
        padding: 10,
    },
    SigningButton: {
        width: "90%",
        marginTop: 5
    }
})


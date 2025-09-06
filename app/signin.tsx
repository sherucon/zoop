import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useAuth } from './components/AuthContext';

import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from './firebase/firebaseconfig';


import PressableButton from './components/PressableButton';
import SecondaryButton from './components/SecondaryButton';
import TermsAndConditions from './components/TNC';
import TypingText from "./components/TypingText";

const Spacer = ({ size = 20 }) => <View style={{ height: size }} />;

const logo = require('@/assets/images/zoop-trans-logo.png');


export default function signin() {
    const { user, loading, refreshUserProfile } = useAuth();

    // If already signed in, redirect to protected (tabs)
    useEffect(() => {
        if (!loading && user) {
            router.replace('/onboarding');
        }
    }, [user, loading]);

    const [Email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [processing, setProcessing] = useState(false);

    // temporary user variable removed; use value from signIn response directly


    const isValidEmail = (s: string) => {
        const trimmed = s.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    };

    let [TNCShown, setShowTNC] = useState<boolean>(false);


    const handleSignin = () => {
        setProcessing(true);
        signInWithEmailAndPassword(auth, Email, password)
            .then(async (userCredential) => {
                const signedInUser = userCredential.user;
                console.log(signedInUser)
                if (signedInUser?.emailVerified == true) {
                    console.log("Signed in successfully");
                    const docRef = doc(db, "users", signedInUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (!docSnap.exists()) {
                        await initUser(signedInUser)
                    }
                    refreshUserProfile();
                    router.navigate("/onboarding");
                    setProcessing(false);
                }
                else {
                    auth.signOut();
                    Alert.alert("Please verify your email from the link sent to your mail. \n Check your spam folder")
                    setProcessing(false);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);

                if (errorCode === "auth/invalid-credential") {
                    Alert.alert('Sign in failed', 'Invalid credentials.');
                }

                else {
                    Alert.alert('Sign up failed', errorMessage + "Please report this" || 'Unknown error' + "Please report this");
                }
                setProcessing(false);
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? -60 : -90}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Modal visible={processing} transparent={true} animationType='none' style={{ width: "100%", height: "100%", }}>
                            <View style={{ paddingTop: 0.50 * Dimensions.get("window").height, backgroundColor: "#FFF", opacity: 0.3, height: Dimensions.get("window").height, width: Dimensions.get("window").width }}>
                                <ActivityIndicator color={"black"} />
                            </View>
                        </Modal>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
        paddingTop: 50,
        aspectRatio: 1,
        height: 0.45 * Dimensions.get('window').height,
    },
    TextInput: {
        color: "#000",
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


import { auth } from "@/firebase/firebaseconfig";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseconfig";


import { Alert, Dimensions, Modal, StyleSheet, TextInput, View } from 'react-native';
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from 'react';


import PressableButton from './components/PressableButton';
import SecondaryButton from './components/SecondaryButton';
import TermsAndConditions from './components/TNC';
import TypingText from "./components/TypingText";


const Spacer = ({ size = 20 }) => <View style={{ height: size }} />;


const logo = require('@/assets/images/zoop-trans-logo.png');


export default function signin() {
    const [Email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    var passwordValidator = require('password-validator');


    // Create a schema
    var schema = new passwordValidator();


    schema
        .is().min(8)
        .is().max(100)
        .has().lowercase()
        .has().uppercase()
        .has().digits(3)
        .has().not().spaces()


    const handleSignup = () => {
        const emailTrimmed = Email.trim();
        if (!isValidEmail(emailTrimmed)) {
            Alert.alert('Invalid email', 'Please enter a valid email address.');
            return;
        }
        if (!schema.validate(password)) {
            Alert.alert('Invalid password', 'Please enter a stronger password.');
            return;
        }

        createUserWithEmailAndPassword(auth, emailTrimmed, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Signed up:', user);
                Alert.alert('Successfully signed up', `Welcome ${user.email}`);
                initUser(user);
                try { router.push('/signin'); } catch (e) { /* ignore navigation errors */ }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                if (errorCode === "auth/email-already-in-use") {
                    Alert.alert('Sign up failed', 'User already exists');
                }
                else {
                    Alert.alert('Sign up failed', errorMessage + "Please report this" || 'Unknown error' + "Please report this");
                }
            });
    };

    const initUser = async (user: User) => {
        try {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                username: "Zooper",
                photoUrl: "https://sherucon.tech/pfps/default_pfp.webp",
                age: 0,
                gender: "male",
                lookingFor: "both",
                firstTime: true
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    const isValidEmail = (s: string) => {
        const trimmed = s.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    };


    let [TNCShown, setShowTNC] = useState<boolean>(false);


    return (
        <View style={styles.Container}>
            <View style={{ flex: 1 / 2 }}>
                <Image source={logo} style={styles.HeroLogo} />
            </View>

            <Spacer size={100} />
            <View style={{ width: "100%", alignItems: 'center', flex: 1 / 2 }}>
                <TextInput style={styles.TextInput} placeholder='Enter your email here' placeholderTextColor={"#C0C0C0"} value={Email} onChangeText={setEmail} inputMode="email" autoCapitalize="none" />
                {Email.length > 0 && !isValidEmail(Email) ? (<TypingText text="• enter a valid email" delay={6} />) : null}

                <TextInput style={[styles.TextInput, { marginTop: 5 }]} placeholder='Enter your password here' placeholderTextColor={"#C0C0C0"} value={password} onChangeText={setPassword} secureTextEntry />
                {password.length > 0 && schema.validate(password, { list: true }).includes("min") ? (<TypingText text="• must contain atleast 8 characters" delay={6} />) : null}
                {password.length > 0 && schema.validate(password, { list: true }).includes("lowercase") ? (<TypingText text="• must contain atleast 1 lowercase character" delay={6} />) : null}
                {password.length > 0 && schema.validate(password, { list: true }).includes("uppercase") ? (<TypingText text="• must contain atleast 1 uppercase character" delay={6} />) : null}
                {password.length > 0 && schema.validate(password, { list: true }).includes("digits") ? (<TypingText text="• must contain atleast 3 digits" delay={6} />) : null}
                {password.length > 0 && schema.validate(password, { list: true }).includes("spaces") ? (<TypingText text="• must not contain spaces" delay={6} />) : null}

                <PressableButton style={styles.SigningButton} label='Sign up' onPress={handleSignup} />
                <SecondaryButton label='Already a user? Sign in →' onPress={() => router.navigate("/signin")} />
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



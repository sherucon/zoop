import React, { createContext, useContext, useEffect, useState } from "react";


import { signOut as firebaseSignOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseconfig"; // your firebase.ts file

export interface UserProfile {
    uid: string;
    email: string | null;
    photoUrl: string | null;
    username: string;
    age: number;
    gender: string;
    lookingFor: string;
    firstTime: boolean;
}

type AuthContextType = {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    userProfile: null,
    signOut: async () => { },
    refreshUserProfile: async () => { }
});




export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);



    const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                return {
                    uid: data.uid,
                    email: data.email,
                    // support both photoURL and photoUrl field names
                    photoUrl: data.photoURL || data.photoUrl || null,
                    username: data.username,
                    age: data.age,
                    gender: data.gender,
                    lookingFor: data.lookingFor,
                    firstTime: data.firstTime ?? true,
                } as UserProfile;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    };

    useEffect(() => {
        console.log('🔄 Setting up auth state listener...');
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            console.log('🔄 Auth state changed:', user ? `User: ${user.email}, UID: ${user.uid}` : 'No user');

            if (user) {
                console.log('👤 User is signed in, fetching profile...');

                // Set user immediately so other hooks/components can react
                setUser(user);
                setLoading(true);

                // Fetch and set profile
                const profile = await fetchUserProfile(user.uid);
                setUserProfile(profile);
                setLoading(false);
            } else {
                console.log('👤 No user signed in');
                setUser(null);
                setUserProfile(null);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const refreshUserProfile = async () => {
        if (user) {
            setLoading(true);
            const profile = await fetchUserProfile(user.uid);
            setUserProfile(profile);
            setLoading(false);
        }
    };

    const signOut = async () => {
        firebaseSignOut(auth).then(() => {
            console.log("Sign-out successful.")
        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            userProfile,
            signOut,
            refreshUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;

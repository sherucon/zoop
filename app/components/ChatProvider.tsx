import { PropsWithChildren } from "react";
import { StreamChat } from "stream-chat";
import { useUserProfile } from "@/firebase/useuserprofile";
import { useEffect, useState } from "react"
import { OverlayProvider, Chat } from "stream-chat-expo";
import { ActivityIndicator, View } from "react-native";


export const client = StreamChat.getInstance("xgae7qrdrnm4")


export default function ChatProvider({ children }: PropsWithChildren) {

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

    const [isReady, setIsReady] = useState(false);

    //const client = StreamChat.getInstance("xgae7qrdrnm4");

    useEffect(() => {
        if (!userProfile) {
            return;
        }
        const connect = async () => {
            await client.connectUser(
                {
                    id: uid!,
                    name: username,
                    image: photoUrl
                },
                client.devToken(uid!)
            );
            setIsReady(true);
        };

        connect();

        return () => {
            if (isReady) {
                client.disconnectUser();
            }
            setIsReady(false);
        };
    }, [uid]);
    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <OverlayProvider>
            <Chat client={client}>
                <>
                    {children}
                </>
            </Chat>
        </OverlayProvider>
    )
}


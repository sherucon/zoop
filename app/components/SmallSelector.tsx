import { Pressable, StyleSheet, View } from 'react-native';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type Props = {
    onPress?: () => void,
    icon?: React.ReactElement,
    style?: ViewStyle,
}

const Spacer = ({ size = 20 }) => <View style={{ width: size }} />;

export default function SmallSelector({ onPress, icon, style }: Props) {
    return (
        <View style={styles.Container}>
            <Pressable onPress={onPress} style={[styles.Pressable, style]}>
                <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 7 }}>
                    {icon}
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        borderRadius: 7,
        backgroundColor: "#2E2E2E",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    Pressable: {
        borderRadius: 7,
        marginVertical: 1,
        width: 30,
        backgroundColor: "#2E2E2E",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

})

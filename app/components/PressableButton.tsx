import { View, Text, Pressable, StyleSheet, } from 'react-native';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type Props = {
    label: string,
    onPress?: () => void,
    icon?: React.ReactElement,
    style?: ViewStyle,
}

const Spacer = ({ size = 20 }) => <View style={{ width: size }} />;

export default function PressableButton({ label, onPress, icon, style }: Props) {
    return (
        <View style={[styles.Container, style]}>
            <Pressable onPress={onPress} style={styles.Pressable}>
                {icon}
                {icon ? <Spacer size={10} /> : null}
                <Text style={{ color: '#fff', fontWeight: 'bold', }}>{label}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        borderRadius: 15,
        maxWidth: 400,
        backgroundColor: "#007AFF",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    Pressable: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 15,
        backgroundColor: "#007AFF",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        textAlign: "center"
    },

})

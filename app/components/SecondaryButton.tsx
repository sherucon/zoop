import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type Props = {
    label: string,
    onPress?: () => void,
    style?: ViewStyle
}


export default function SecondaryButton({ label, onPress, style }: Props) {
    return (
        <View style={[styles.Container, style]}>
            <Pressable onPress={onPress} style={styles.Pressable}>
                <Text style={{ color: '#303030', lineHeight: 20 }}>{label}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        padding: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Pressable: {
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

})

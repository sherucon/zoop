import React from 'react'
import { View, Text } from 'react-native'
import { MotiText } from 'moti'

type TypingTextProps = {
    text: string
    delay?: number
}

export default function TypingText({ text, delay = 100 }: TypingTextProps) {
    return (
        <View style={{ flexDirection: 'row', alignSelf: "flex-start", marginLeft: "7%", }}>
            {text.split('').map((char, index) => (
                <MotiText
                    key={index}
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                        delay: index * delay,
                        duration: 300,
                    }}
                    style={{ color: 'red', }}
                >
                    {char}
                </MotiText>
            ))}
        </View>
    )
}

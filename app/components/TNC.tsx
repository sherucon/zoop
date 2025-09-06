import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

const TermsAndConditions: React.FC = () => (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Zoop Chat Terms and Conditions</Text>
        <Text style={styles.subheading}>Last Updated: August 2025</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>Welcome to Zoop Chat ("App"). These Terms and Conditions ("Terms") govern your use of the Zoop Chat mobile and web applications and any related services (collectively "Services"). By accessing or using Zoop Chat, you agree to be bound by these Terms.</Text>

        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.paragraph}>You must be at least 13 years of age to use Zoop Chat. By using the App, you represent that you are eligible to enter into a legally binding contract.</Text>

        <Text style={styles.sectionTitle}>3. Use of the Service</Text>
        <Text style={styles.paragraph}>- You agree to use Zoop Chat only for lawful purposes. {'\n'}- You understand that chats are random and anonymous; Zoop Chat does not verify user identity. {'\n'}- You are responsible for any content you send or upload via the App.</Text>

        <Text style={styles.sectionTitle}>4. Prohibited Conduct</Text>
        <Text style={styles.paragraph}>You agree NOT to:{'\n'}- Harass, threaten, or harm other users.{"\n"}- Post or share illegal, abusive, defamatory, or sexually explicit content.{"\n"}- Attempt to collect personal information of other users.{"\n"}- Use the Service for commercial purposes without permission.</Text>

        <Text style={styles.sectionTitle}>5. Content Ownership</Text>
        <Text style={styles.paragraph}>You retain all rights to the content you send via Zoop Chat. By transmitting content, you grant Zoop Chat a worldwide, royalty-free license to use, modify, display, and distribute it for the purpose of operating the Services.</Text>

        <Text style={styles.sectionTitle}>6. Privacy</Text>
        <Text style={styles.paragraph}>Zoop Chat collects and processes user data in accordance with our Privacy Policy. By using Zoop Chat, you consent to such data practices.</Text>

        <Text style={styles.sectionTitle}>7. Termination</Text>
        <Text style={styles.paragraph}>Zoop Chat reserves the right to suspend or terminate your access at any time, without notice, if you violate these Terms.</Text>

        <Text style={styles.sectionTitle}>8. Disclaimers</Text>
        <Text style={styles.paragraph}><Text style={{ fontWeight: 'bold' }}>No Warranty:</Text> Zoop Chat is provided "as is" without warranties of any kind.{"\n"}<Text style={{ fontWeight: 'bold' }}>Limitation of Liability:</Text> Zoop Chat is not liable for any indirect or consequential damages arising from your use of the App.</Text>

        <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
        <Text style={styles.paragraph}>We may modify these Terms at any time. Continued use of Zoop Chat following changes constitutes your acceptance of the revised Terms.</Text>

        <Text style={styles.sectionTitle}>10. Governing Law</Text>
        <Text style={styles.paragraph}>These Terms shall be governed by and interpreted in accordance with the laws of India, without regard to its conflict of law provisions.</Text>

        <Text style={styles.paragraphItalic}>By using Zoop Chat, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</Text>
    </ScrollView>
);
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#1a1a1a', // Match fade color
    },
    container: {
        padding: 16,
        paddingTop: 40,
        paddingBottom: 40,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2E2E2E',
    },
    subheading: {
        fontSize: 14,
        marginBottom: 16,
        fontStyle: 'italic',
        color: '#2E2E2E',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
        color: '#2E2E2E',
    },
    paragraph: {
        fontSize: 14,
        marginTop: 4,
        lineHeight: 20,
        color: '#2E2E2E',
    },
    paragraphItalic: {
        fontSize: 14,
        marginTop: 12,
        fontStyle: 'italic',
        color: '#2E2E2E',
    },
});
export default TermsAndConditions;

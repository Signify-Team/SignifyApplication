/**
 * @file ConsentFormPage.js
 * @description Consent form page that users must agree to before proceeding with registration
 * @datecreated 30.04.2025
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../utils/constants';

const ConsentFormPage = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { username, email, password } = route.params;

    const consentText = `By checking this box, you agree to our Terms of Service and Privacy Policy. 

We value your privacy and want to ensure you understand how we handle your data:

1. Your personal information will be collected and stored securely
2. We will only use your data for the purposes specified in our Privacy Policy
3. You can request access to or deletion of your data at any time
4. We will never share your personal information with third parties without your explicit consent
5. You will receive important updates and notifications via email
6. You can opt-out of non-essential communications at any time

This consent is required to create your account and use our services. You must be at least 13 years old to agree to these terms.`;

    const handleContinue = () => {
        if (isChecked) {
            navigation.navigate('Authentication', {
                email,
                username,
                password
            });
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/icons/course-info/greetings.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.contentContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Consent Form</Text>
                    <ScrollView style={styles.scrollContainer}>
                        <Text style={styles.consentText}>{consentText}</Text>
                    </ScrollView>
                    <View style={styles.checkboxSection}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setIsChecked(!isChecked)}>
                            <View style={[styles.checkbox, isChecked && styles.checked]}>
                                {isChecked && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>
                                I have read and understood the terms.
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {isChecked && (
                    <TouchableOpacity
                        style={[styles.loginButton, { marginTop: 20 }]}
                        onPress={handleContinue}>
                        <Text style={styles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        paddingTop: 0,
    },
    logo: {
        width: 280,
        height: 280,
        marginBottom: 0,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        marginTop: -40,
    },
    formContainer: {
        height: '80%',
        backgroundColor: COLORS.neutral_base_soft,
        borderRadius: 8,
        padding: 20,
        width: '100%',
        borderWidth: 2,
        borderColor: COLORS.neutral_base_dark,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: COLORS.neutral_base_dark,
        fontFamily: 'Poppins-Bold',
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 20,
    },
    consentText: {
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.neutral_base_dark,
        fontFamily: 'Poppins-Regular',
    },
    checkboxSection: {
        borderTopWidth: 1,
        borderTopColor: COLORS.primary,
        paddingTop: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.button_color,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: COLORS.button_color,
    },
    checkmark: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        marginLeft: 12,
        fontSize: 14,
        color: COLORS.button_color,
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    loginButton: {
        backgroundColor: COLORS.button_color,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    loginButtonText: {
        color: COLORS.light_gray_2,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
});

export default ConsentFormPage; 
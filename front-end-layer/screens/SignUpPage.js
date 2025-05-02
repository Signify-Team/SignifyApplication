/**
 * @file SignUpPage.js
 * @description The sign up page of the application
 *              Asks for the user name and email address
 *              Allows options for signing up with Google or Apple account
 *              Includes a button to navigate to the login page
 *
 * @datecreated 05.11.2024
 * @lastmodified 30.04.2025
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';
import { sendVerificationCode, registerUser } from '../utils/services/authService';

// SignUp Page layout
const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { email: verifiedEmail, verified } = route.params || {};

    // If coming back from verification, pre-fill the email
    React.useEffect(() => {
        if (verifiedEmail) {
            setEmail(verifiedEmail);
        }
    }, [verifiedEmail]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return password.length >= 8;
    };

    const handleContinue = async () => {
        setErrorMessage('');
        
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            if (verified) {
                // If email is verified, proceed with registration
                const result = await registerUser(username, email, password);
                if (result) {
                    navigation.replace('Login');
                }
            } else {
                // Navigate to consent form first
                navigation.navigate('ConsentForm', {
                    email,
                    username,
                    password
                });
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled">
                {/* Logo */}
                <Image
                    source={require('../assets/images/Signify-Logo.png')}
                    style={styles.loginLogo}
                />

                {/* Welcome Text */}
                <Text style={styles.loginWelcomeText}>
                    Welcome!
                </Text>

                {/* Inputs */}
                <CustomTextInput
                    label="USERNAME"
                    placeholder="yourusername"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <CustomTextInput
                    label="EMAIL"
                    placeholder="yourmail@mail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!verifiedEmail}
                />
                <CustomTextInput
                    label="PASSWORD"
                    placeholder="yourpassword"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <CustomTextInput
                    label="CONFIRM PASSWORD"
                    placeholder="confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {errorMessage ? (
                    <Text style={styles.errorMessage}>
                        {errorMessage}
                    </Text>
                ) : null}

                {/* Sign up container */}
                <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleContinue}
                    disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.loginButtonText}>
                            {verified ? 'Sign Up' : 'Continue'}
                        </Text>
                    )}
                </TouchableOpacity>
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.replace('Login')}>
                        <Text style={styles.signUpLink}>
                            {' '}Log In.
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUpPage;

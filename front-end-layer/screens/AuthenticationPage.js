/**
 * @file AuthenticationPage.js
 * @description Allows the user to enter the code came to their email.
 *
 * @datecreated 12.11.2024
 * @lastmodified 12.11.2024
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';
import { verifyCode, sendVerificationCode } from '../utils/apiService';

// Authentication Page Layout
const AuthenticationPage = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const navigation = useNavigation();
    const route = useRoute();
    const { email, password, username } = route.params || {};

    // Send verification code when component mounts
    useEffect(() => {
        const sendInitialVerificationCode = async () => {
            if (email && username && password) {
                setIsLoading(true);
                try {
                    await sendVerificationCode(email, username, password);
                    setErrorMessage('Verification code sent!');
                } catch (error) {
                    const errorMessage = error.response?.data?.message ||
                                       error.response?.data?.error ||
                                       error.message ||
                                       'Failed to send verification code';
                    setErrorMessage(`Error: ${errorMessage}`);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        sendInitialVerificationCode();
    }, []); 

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerification = async () => {
        setErrorMessage('');

        if (!verificationCode) {
            setErrorMessage('Please enter the verification code');
            return;
        }

        setIsLoading(true);

        try {
            await verifyCode(email, verificationCode);
            navigation.replace('Login');
        } catch (error) {
            setErrorMessage(error.message || 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (timeLeft > 0) {
            setErrorMessage(`Please wait ${formatTime(timeLeft)} before requesting a new code`);
            return;
        }

        if (!password) {
            setErrorMessage('Password is required to resend verification code');
            return;
        }

        setIsLoading(true);
        try {
            const response = await sendVerificationCode(email, username, password);
            setTimeLeft(300);
            setErrorMessage('New verification code sent!');
        } catch (error) {
            const resendErrorMessage = error.response?.data?.message ||
                                       error.response?.data?.error ||
                                       error.message ||
                                       'Failed to send verification code';
            setErrorMessage(`Error: ${resendErrorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                        Verify Your Email
                    </Text>

                    <Text style={styles.welcomeDescription}>
                        We've sent a verification code to{'\n'}
                        {email}
                    </Text>

                    {/* Verification Code Input */}
                    <CustomTextInput
                        label="VERIFICATION CODE"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                        maxLength={6}
                    />

                    {errorMessage ? (
                        <Text style={styles.errorMessage}>
                            {errorMessage}
                        </Text>
                    ) : null}

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleVerification}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>
                                Verify
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Timer */}
                    <Text style={[styles.signUpText, { marginTop: 20 }]}>
                        {timeLeft > 0 ? `Time remaining: ${formatTime(timeLeft)}` : ''}
                    </Text>

                    {/* Resend Code - Only show when timer runs out */}
                    {timeLeft === 0 && (
                        <TouchableOpacity
                            onPress={handleResendCode}>
                            <Text style={styles.signUpLink}>
                                Resend verification code
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default AuthenticationPage;

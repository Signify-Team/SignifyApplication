/**
 * @file ForgotPasswordPage.js
 * @description Page for handling forgot password functionality.
 *              Allows users to request a password reset link via email.
 *
 * @datecreated 20.03.2024
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';
import { forgotPassword } from '../utils/apiService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigation = useNavigation();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleForgotPassword = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        
        // Basic validation
        if (!email) {
            setErrorMessage('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            await forgotPassword(email);
            setSuccessMessage('Password reset instructions have been sent to your email');
            setEmail('');
        } catch (error) {
            console.error('Error in handleForgotPassword:', error);

            // Handle specific error cases
            if (error.message.includes('Network error')) {
                setErrorMessage('Unable to connect to the server. Please check your internet connection.');
            } else if (error.response?.status === 404) {
                setErrorMessage('Unable to find an account with this email. Please check if the email is correct or try signing up.');
            } else {
                setErrorMessage(error.message || 'Unable to process your request. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require('../assets/images/Signify-Logo.png')}
                style={styles.loginLogo}
            />

            {/* Title Text */}
            <Text style={styles.loginWelcomeText}>
                Forgot Password
            </Text>

            {/* Description Text */}
            <Text style={[styles.signUpText, { width: '75%', textAlign: 'center', marginBottom: 20 }]}>
                Enter your email address and we'll send you instructions to reset your password.
            </Text>

            {/* Email Input */}
            <CustomTextInput
                label="EMAIL"
                placeholder="yourmail@mail.com"
                onChangeText={(text) => setEmail(text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
            />

            {errorMessage ? (
                <Text style={[styles.errorMessage, { width: '100%', marginBottom: 10 }]}>
                    {errorMessage}
                </Text>
            ) : null}

            {successMessage ? (
                <Text style={[styles.signUpText, { color: '#4CAF50', width: '100%', marginBottom: 10 }]}>
                    {successMessage}
                </Text>
            ) : null}

            <TouchableOpacity
                style={[
                    styles.loginButton,
                    isLoading && styles.loginButtonDisabled,
                    { marginTop: 10 }
                ]}
                onPress={handleForgotPassword}
                disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.loginButtonText}>
                        Send Reset Link
                    </Text>
                )}
            </TouchableOpacity>

            <View style={[styles.signUpContainer, { marginTop: 20 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.signUpLink}>
                        Back to Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ForgotPasswordPage; 
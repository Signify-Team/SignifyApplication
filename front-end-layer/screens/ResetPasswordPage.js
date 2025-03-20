/**
 * @file ResetPasswordPage.js
 * @description Page for handling password reset functionality.
 *              Allows users to set a new password using the reset token.
 *
 * @datecreated 20.03.2024
 */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';
import { resetPassword } from '../utils/apiService';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { token } = route.params || {};

    useEffect(() => {
        // Log the token when the component mounts
        console.log('ResetPasswordPage mounted with token:', token);
    }, [token]);

    const validatePassword = (password) => {
        // At least 8 characters
        return password.length >= 8;
    };

    const handleResetPassword = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        
        // Basic validation
        if (!newPassword || !confirmPassword) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (!validatePassword(newPassword)) {
            setErrorMessage('Password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (!token) {
            setErrorMessage('Invalid reset link. Please request a new password reset.');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token, newPassword);
            setSuccessMessage('Password reset successfully! You can now log in with your new password.');
            setTimeout(() => {
                navigation.replace('Login');
            }, 2000);
        } catch (error) {
            if (error.message.includes('Invalid or expired reset token')) {
                setErrorMessage('This reset link has expired. Please request a new password reset.');
            } else {
                setErrorMessage(error.message || 'Failed to reset password. Please try again.');
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
                Reset Password
            </Text>

            {/* Description Text */}
            <Text style={[styles.signUpText, { textAlign: 'center', marginBottom: 20 }]}>
                Please enter your new password below.
            </Text>

            {/* Password Inputs */}
            <CustomTextInput
                label="NEW PASSWORD"
                placeholder="Enter new password"
                onChangeText={(text) => setNewPassword(text)}
                value={newPassword}
                secureTextEntry
                editable={!isLoading}
            />
            <CustomTextInput
                label="CONFIRM PASSWORD"
                placeholder="Confirm new password"
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                secureTextEntry
                editable={!isLoading}
            />

            {errorMessage ? (
                <Text style={[styles.errorMessage, { textAlign: 'center', marginBottom: 10 }]}>
                    {errorMessage}
                </Text>
            ) : null}

            {successMessage ? (
                <Text style={[styles.signUpText, { color: '#4CAF50', textAlign: 'center', marginBottom: 10 }]}>
                    {successMessage}
                </Text>
            ) : null}

            <TouchableOpacity
                style={[
                    styles.loginButton,
                    isLoading && styles.loginButtonDisabled,
                    { marginTop: 10 }
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.loginButtonText}>
                        Reset Password
                    </Text>
                )}
            </TouchableOpacity>

            <View style={[styles.signUpContainer, { marginTop: 20 }]}>
                <TouchableOpacity
                    onPress={() => navigation.replace('Login')}>
                    <Text style={styles.signUpLink}>
                        Back to Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ResetPasswordPage; 
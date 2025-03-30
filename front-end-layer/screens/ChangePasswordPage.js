/**
 * @file ChangePasswordPage.js
 * @description Page for changing user password.
 *              Requires current password for security.
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
import { changePassword } from '../utils/apiService';
import { COLORS } from '../utils/constants';

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigation = useNavigation();

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleChangePassword = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (!validatePassword(newPassword)) {
            setErrorMessage('New password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('New passwords do not match');
            return;
        }

        if (currentPassword === newPassword) {
            setErrorMessage('New password must be different from current password');
            return;
        }

        setIsLoading(true);

        try {
            await changePassword(currentPassword, newPassword);
            setSuccessMessage('Password changed successfully!');
            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to change password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: 50 }]}>
            {/* Logo */}
            <Image
                source={require('../assets/images/Signify-Logo.png')}
                style={styles.loginLogo}
            />

            {/* Title Text */}
            <Text style={styles.loginWelcomeText}>
                Change Password
            </Text>

            {/* Description Text */}
            <Text style={[styles.signUpText, { textAlign: 'center', marginBottom: 20, width: '75%' }]}>
                Please enter your current password and new password below.
            </Text>

            {/* Password Inputs */}
            <CustomTextInput
                label="CURRENT PASSWORD"
                placeholder="Enter current password"
                onChangeText={(text) => setCurrentPassword(text)}
                value={currentPassword}
                secureTextEntry
                editable={!isLoading}
            />
            <CustomTextInput
                label="NEW PASSWORD"
                placeholder="Enter new password"
                onChangeText={(text) => setNewPassword(text)}
                value={newPassword}
                secureTextEntry
                editable={!isLoading}
            />
            <CustomTextInput
                label="CONFIRM NEW PASSWORD"
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
                onPress={handleChangePassword}
                disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.loginButtonText}>
                        Change Password
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.loginButton,
                    {
                        backgroundColor: COLORS.soft_pink_background,
                        marginTop: 20
                    }
                ]}
                onPress={() => navigation.goBack()}
                disabled={isLoading}>
                <Text style={[styles.loginButtonText, { color: COLORS.black }]}>
                    Cancel
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChangePasswordPage; 
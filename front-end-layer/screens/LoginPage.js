/**
 * @file LoginPage.js
 * @description Login page for the application. Asks for name and password.
 *              Adds a sign up option if the user doesn't have an account.
 *
 * @datecreated 05.11.2024
 * @lastmodified 18.11.2024
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
import { loginUser, fetchUserProfile } from '../utils/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StreakNotification from '../components/StreakNotification';

// Login Page layout
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [showStreakNotification, setShowStreakNotification] = useState(false);
    const [streakCount, setStreakCount] = useState(0);
    const navigation = useNavigation();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleLogin = async () => {
        setErrorMessage('');
        setStatusMessage('');
        
        // Basic validation
        if (!email || !password) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const data = await loginUser(email, password);
            
            const serverLanguagePreference = data.user?.languagePreference;
            
            setStatusMessage(`Server Language: ${serverLanguagePreference || 'None'}`);
            
            if (data.user?.streakCount) {
                setStreakCount(data.user.streakCount);
                setShowStreakNotification(true);
            }
                    
            if (!serverLanguagePreference) {
                navigation.replace('LanguagePreference', { userId: data.user._id });
            } else {
                navigation.replace('Home');
            }
        } catch (error) {
            setErrorMessage(error.message || 'Unable to connect to the server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {showStreakNotification && (
                <StreakNotification
                    streakCount={streakCount}
                    onClose={() => setShowStreakNotification(false)}
                />
            )}

            {/* Logo */}
            <Image
                source={require('../assets/images/Signify-Logo.png')}
                style={styles.loginLogo}
            />

            {/* Welcome Text */}
            <Text style={styles.loginWelcomeText}>
                Welcome back, {'\n'} Dila!
            </Text>

            {/* Inputs */}
            <CustomTextInput
                label="EMAIL"
                placeholder="yourmail@mail.com"
                onChangeText={(text) => setEmail(text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <CustomTextInput
                label="PASSWORD"
                placeholder="yourpassword"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>
                    Forgot Your Password?
                </Text>
            </TouchableOpacity>

            {errorMessage ? (
                <Text style={styles.errorMessage}>
                    {errorMessage}
                </Text>
            ) : null}

            <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.loginButtonText}>
                        Log In
                    </Text>
                )}
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>
                    Don't have an account?
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.replace('SignUp')}>
                    <Text style={styles.signUpLink}>
                        {' '}Sign Up.
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginPage;

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
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';
import { loginUser } from '../utils/apiService';

// Login Page layout
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        // Basic validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const data = await loginUser(email, password);
            Alert.alert('Success', 'Login successful');
            navigation.replace('Home');
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert(
                'Error',
                error.message || 'Unable to connect to the server. Please check your internet connection.'
            );
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
            <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>
                    Forgot Your Password?
                </Text>
            </TouchableOpacity>

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

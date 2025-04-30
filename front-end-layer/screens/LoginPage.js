/**
 * @file LoginPage.js
 * @description Login page for the application. Asks for name and password.
 *              Adds a sign up option if the user doesn't have an account.
 *
 * @datecreated 05.11.2024
 * @lastmodified 18.11.2024
 */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';
import { loginUser, fetchUserProfile } from '../utils/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StreakPopup from '../components/StreakPopup';
import { COLORS } from '../utils/constants';

// Login Page layout
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [showStreakPopup, setShowStreakPopup] = useState(false);
    const [streakMessage, setStreakMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [username, setUsername] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        // load remembered email and username if exists
        const loadSavedData = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('rememberedEmail');
                const savedUsername = await AsyncStorage.getItem('rememberedUsername');
                if (savedEmail) {
                    setEmail(savedEmail);
                    setRememberMe(true);
                }
                if (savedUsername) {
                    setUsername(savedUsername);
                }
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        };
        loadSavedData();
    }, []);

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
            
            const rememberedUsername = data?.user?.username
            
            if (rememberedUsername) {
                setUsername(rememberedUsername);
                if (rememberMe) {
                    await AsyncStorage.setItem('rememberedUsername', rememberedUsername);
                }
            } else {
                try {
                    const userProfile = await fetchUserProfile();
                    const profileUsername = userProfile?.username;
                    if (profileUsername) {
                        setUsername(profileUsername);
                        if (rememberMe) {
                            await AsyncStorage.setItem('rememberedUsername', profileUsername);
                        }
                    }
                } catch (profileError) {
                    console.error('Error fetching profile:', profileError);
                }
            }
            
            if (rememberMe) {
                await AsyncStorage.setItem('rememberedEmail', email);
            } else {
                await AsyncStorage.removeItem('rememberedEmail');
                await AsyncStorage.removeItem('rememberedUsername');
            }
            
            const serverLanguagePreference = data.user?.languagePreference;
            
            setStatusMessage(`Server Language: ${serverLanguagePreference || 'None'}`);
            
            if (!serverLanguagePreference) {
                navigation.replace('LanguagePreference', { userId: data.user._id });
            } else {
                navigation.replace('Home', { streakMessage: data.streakMessage });
            }
        } catch (error) {
            setErrorMessage(error.message || 'Unable to connect to the server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStreakPopupClose = () => {
        setShowStreakPopup(false);
        const serverLanguagePreference = statusMessage.replace('Server Language: ', '');
        if (serverLanguagePreference === 'None') {
            navigation.replace('LanguagePreference', { userId: data.user._id });
        } else {
            navigation.replace('Home');
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
                {username ? `Welcome back, ${username}!` : 'Welcome!'}
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

            {/* Remember Me Switch */}
            <View style={styles.rememberMeContainer}>
                <Text style={styles.rememberMeText}>Remember Me</Text>
                <Switch
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    trackColor={{ false: '#767577', true: COLORS.button_color }}
                    thumbColor={rememberMe ? COLORS.soft_accent : '#f4f3f4'}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
            </View>

            <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPasswordText}>
                        Forgot Your Password?
                    </Text>
                </TouchableOpacity>
            </View>

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

            <StreakPopup
                visible={showStreakPopup}
                message={streakMessage}
                onClose={handleStreakPopupClose}
            />
        </View>
    );
};

export default LoginPage;

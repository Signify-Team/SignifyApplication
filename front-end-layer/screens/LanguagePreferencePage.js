/**
 * @file LanguagePreferencePage.js
 * @description Allows users to select their preferred sign language (TID or ASL).
 *
 * @datecreated 14.12.2024
 * @lastmodified 14.12.2024
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
import { updateLanguagePreference } from '../utils/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../utils/apiService';

const LanguagePreferencePage = () => {
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const handleLanguageSelect = async (language) => {
        setSelectedLanguage(language);
        setIsLoading(true);
        setErrorMessage('');

        try {
            const userId = await getUserId();
            if (!userId) {
                throw new Error('User ID not found');
            }
            await updateLanguagePreference(language);
            await AsyncStorage.setItem('@language_preference', language);
            navigation.replace('Home');
        } catch (error) {
            setErrorMessage(error.message || 'Failed to update language preference');
            setSelectedLanguage(null);
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
                Choose Your Language
            </Text>

            <Text style={styles.welcomeDescription}>
                Select your preferred sign language{'\n'}
                to start learning
            </Text>

            {/* Language Selection Buttons */}
            <View style={{ width: '80%', gap: 20 }}>
                <TouchableOpacity
                    style={[
                        styles.loginButton,
                        selectedLanguage === 'TID' && { backgroundColor: '#4CAF50' }
                    ]}
                    onPress={() => handleLanguageSelect('TID')}
                    disabled={isLoading}>
                    <Text style={styles.loginButtonText}>
                        Turkish Sign Language (TID)
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.loginButton,
                        selectedLanguage === 'ASL' && { backgroundColor: '#4CAF50' }
                    ]}
                    onPress={() => handleLanguageSelect('ASL')}
                    disabled={isLoading}>
                    <Text style={styles.loginButtonText}>
                        American Sign Language (ASL)
                    </Text>
                </TouchableOpacity>
            </View>

            {errorMessage ? (
                <Text style={styles.errorMessage}>
                    {errorMessage}
                </Text>
            ) : null}

            {isLoading && (
                <ActivityIndicator 
                    size="large" 
                    color="#4CAF50" 
                    style={{ marginTop: 20 }}
                />
            )}
        </View>
    );
};

export default LanguagePreferencePage; 
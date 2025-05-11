/**
 * @file SplashScreen.js
 * @description The splash screen of the application
 *             Displays a logo with animations and plays a sound.
 *
 * @datecreated 12.03.2025
 * @lastmodified 10.04.2025
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/SplashScreenStyles.js';
import { updateStreakCount } from '../utils/services/streakService';
import { USER_ID_KEY } from '../utils/config';
import UserManual from '../components/UserManual';
import { fetchUserProfile, updateManualStatus } from '../utils/services/userService';

const SplashScreen = () => {
    const navigation = useNavigation();
    const [showManual, setShowManual] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [serverLanguagePreference, setServerLanguagePreference] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;

    const checkRememberedCredentials = async () => {
        try {
            const userId = await AsyncStorage.getItem(USER_ID_KEY);
            const rememberedEmail = await AsyncStorage.getItem('rememberedEmail');
            const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
            
            if (userId && rememberedEmail && rememberedUsername) {
                try {
                    // Fetch user profile to check hasSeenManual
                    const userProfile = await fetchUserProfile();
                    setCurrentUserId(userId);
                    setServerLanguagePreference(userProfile.languagePreference);

                    const streakData = await updateStreakCount(rememberedEmail);
                    
                    // Navigate to Home first
                    navigation.replace('Home', { 
                        email: rememberedEmail,
                        username: rememberedUsername,
                        streakMessage: streakData.streakMessage,
                        shouldShowNotification: streakData.shouldShowNotification,
                        showManual: !userProfile.hasSeenManual // Pass this flag to Home
                    });
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    navigation.replace('Home', { 
                        email: rememberedEmail,
                        username: rememberedUsername
                    });
                }
            } else {
                navigation.replace('Welcome');
            }
        } catch (error) {
            console.error('Error checking remembered credentials:', error);
            navigation.replace('Welcome');
        }
    };

    const handleManualClose = async () => {
        try {
            await updateManualStatus();
            setShowManual(false);
            if (!serverLanguagePreference) {
                navigation.replace('LanguagePreference', { userId: currentUserId });
            } else {
                navigation.replace('Home');
            }
        } catch (error) {
            console.error('Error updating manual status:', error);
            // Continue with navigation even if update fails
            setShowManual(false);
            if (!serverLanguagePreference) {
                navigation.replace('LanguagePreference', { userId: currentUserId });
            } else {
                navigation.replace('Home');
            }
        }
    };

    useEffect(() => {
        Sound.setCategory('Playback');

        const sound = new Sound('splash_screen.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Sound load error:', error);
                return;
            }
            setTimeout(() => {
                sound.play((success) => {
                    if (!success) {
                        console.log('Sound playback failed');
                    }
                    sound.release();
                });
            }, 400);
        });

        // Bounce
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -10,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Wave
        Animated.loop(
            Animated.sequence([
                Animated.timing(waveAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(waveAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Fade in and navigate
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(1500),
        ]).start(checkRememberedCredentials);

        // Clean up
        return () => {
            sound.release();
        };
    }, [bounceAnim, fadeAnim, navigation, waveAnim]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/icons/header/koala-hand.png')}
                style={[
                    styles.logo,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: bounceAnim },
                            {
                                scale: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1],
                                }),
                            },
                            {
                                rotate: waveAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '20deg'],
                                }),
                            },
                        ],
                    },
                ]}
            />
            <UserManual
                visible={showManual}
                onClose={handleManualClose}
            />
        </View>
    );
};

export default SplashScreen;

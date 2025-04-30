/**
 * @file SplashScreen.js
 * @description The splash screen of the application
 *             Displays a logo with animations and plays a sound.
 *
 * @datecreated 12.03.2025
 * @lastmodified 10.04.2025
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/SplashScreenStyles.js';
import { getUserId } from '../utils/services/authService';
import { updateStreakCount } from '../utils/services/streakService';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const SplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;

    const checkRememberedCredentials = async () => {
        try {
            const rememberedEmail = await AsyncStorage.getItem('rememberedEmail');
            const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
            const userId = await getUserId();
            
            if (rememberedEmail && rememberedUsername && userId) {
                try {
                    // Check if streak was lost
                    const response = await axios.get(`${API_BASE_URL}/users/${userId}/check-streak-loss`);
                    if (response.data?.streakLost) {
                        navigation.replace('Home', { 
                            email: rememberedEmail,
                            username: rememberedUsername,
                            streakMessage: response.data.message,
                            shouldShowNotification: true
                        });
                    } else {
                        navigation.replace('Home', { 
                            email: rememberedEmail,
                            username: rememberedUsername
                        });
                    }
                } catch (error) {
                    console.error('Error checking streak loss:', error);
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
        </View>
    );
};

export default SplashScreen;

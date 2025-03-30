import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/constants';

const SplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = new Animated.Value(0);
    const waveAnim = new Animated.Value(0);

    useEffect(() => {
        // Create continuous waving animation
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
        ]).start(() => {
            navigation.replace('Welcome');
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/icons/header/koala-hand.png')}
                style={[
                    styles.logo,
                    {
                        opacity: fadeAnim,
                        transform: [
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});

export default SplashScreen; 
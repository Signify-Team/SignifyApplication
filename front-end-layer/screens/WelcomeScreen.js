import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../utils/constants';
import styles from '../styles/styles';

const {width, height} = Dimensions.get('window');

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const translateY = bounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={welcomeStyles.contentContainer}>
                {/* Animated Koala */}
                <Animated.View style={[welcomeStyles.koalaContainer, { transform: [{ translateY }] }]}>
                    <Image
                        source={require('../assets/icons/course-info/greetings.png')}
                        style={welcomeStyles.koala}
                    />
                </Animated.View>

                {/* Welcome Text */}
                <Text style={styles.loginWelcomeText}>
                    Welcome to Signify!
                </Text>
                <Text style={styles.welcomeDescription}>
                    Learn sign language in a fun and interactive way
                </Text>

                {/* Buttons Container */}
                <View style={welcomeStyles.buttonContainer}>
                    <TouchableOpacity
                        style={[welcomeStyles.button]}
                        onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.loginButtonText}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[welcomeStyles.button]}
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginButtonText}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const welcomeStyles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: height * 0.05,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: height * 0.05,
    },
    button: {
        width: width * 0.7,
        backgroundColor: COLORS.button_color,
        paddingHorizontal: width * 0.08,
        paddingVertical: height * 0.008,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        marginBottom: height * 0.02, // Negative margin to reduce space
    },
    koalaContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: height * 0.05,
    },
    koala: {
        width: width * 0.8,
        height: width * 0.8,
        resizeMode: 'contain',
    },
});

export default WelcomeScreen; 
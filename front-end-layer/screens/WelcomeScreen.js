import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../utils/constants';

const WelcomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require('../assets/images/Signify-Logo.png')}
                style={styles.logo}
            />

            {/* Welcome Text */}
            <Text style={styles.welcomeText}>
                Welcome to Signify!
            </Text>
            <Text style={styles.subtitleText}>
                Learn sign language in a fun and interactive way
            </Text>

            {/* Buttons Container */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.registerButton]}
                    onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.buttonText}>
                        Register
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.loginButton]}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 32,
        fontFamily: FONTS.baloo_font,
        color: COLORS.neutral_base_dark,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 16,
        color: COLORS.neutral_base_dark,
        marginBottom: 40,
        textAlign: 'center',
        opacity: 0.8,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerButton: {
        backgroundColor: COLORS.primary,
    },
    loginButton: {
        backgroundColor: COLORS.secondary,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: FONTS.baloo_font,
    },
});

export default WelcomeScreen; 
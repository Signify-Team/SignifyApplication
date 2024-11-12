/**
 * @file styles.js  
 * @description Includes styles for the texts, buttons, etc.
 * 
 * @datecreated 05.11.2024
 * @lastmodified 12.11.2024
 */

import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.background,
    },
    textTitle: {
        fontSize: FONTS.title,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },

    // Login Page styles
    loginWelcomeText: {
        fontSize: FONTS.title,
        fontWeight: 'bold',
        color: COLORS.signUpLoginMainText,
        marginBottom: height * 0.03,
        textAlign: 'center',
    },
    forgotPasswordText: {
        color: COLORS.placeholderTextSignUp,
        textAlign: 'center',
        marginBottom: height * 0.03,
    },
    loginInputContainer: {
        width: '100%',
        marginBottom: 20,
        position: 'relative',
        color: COLORS.text,
    },
    loginLabel: {
        color: COLORS.loginBordorColor,
        marginBottom: -9,
        position: 'absolute',
        backgroundColor: COLORS.background,
        top: - (height * 0.01), 
        left: width * 0.04,
        paddingHorizontal: width * 0.02,
        zIndex: 1,
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
    },
    loginTextInput: {
        borderWidth: 3,
        borderColor: COLORS.loginBordorColor,
        borderRadius: 8, 
        padding: 10,
        height: height * 0.07,
        backgroundColor: COLORS.background,
        fontSize: 13,
        color: COLORS.placeholderTextSignUp,
        fontFamily: 'PassionOne-Regular',
    },
});
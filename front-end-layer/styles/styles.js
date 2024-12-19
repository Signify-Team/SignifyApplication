/**
 * @file styles.js
 * @description Includes styles for the texts, buttons, etc.
 *
 * @datecreated 05.11.2024
 * @lastmodified 17.12.2024
 */

import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    COLORS,
    FONTS,
} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create(
    {
        container: {
            flex: 1,
            paddingVertical: height * 0.02,
            backgroundColor: COLORS.neutral_base_soft,
            alignItems: 'center',
        },
        scrollContainer: {
            paddingVertical: 20,
            width: '100%',
            alignItems: 'flex-start',
        },
        buttonRow: {
            width: '100%',
            marginVertical: height * 0.01,
            flexDirection: 'row',
        },
        leftButton: {
            justifyContent: 'flex-start',
            flex: 1,
            paddingLeft: width * 0.1,
        },
        rightButton: {
            justifyContent: 'flex-end',
            flex: 1,
            paddingRight: width * 0.1,
        },
        textTitle: {
            fontSize:
                FONTS.title,
            fontWeight:
                'bold',
            color: COLORS.neutral_base_dark,
        },
        button: {
            backgroundColor:
                COLORS.primary,
            padding: 10,
            borderRadius: 5,
            alignItems:
                'center',
        },

        // Login Page styles
        loginWelcomeText:
            {
                fontSize:
                    FONTS.title,
                fontWeight:
                    'bold',
                color: COLORS.neutral_base_dark,
                marginBottom:
                    height * 0.07,
                marginTop:
                    height * 0.05,
                textAlign:
                    'center',
            },
        forgotPasswordText:
            {
                color: COLORS.neutral_base_dark,
                textAlign:
                    'center',
                marginTop:
                    -height * 0.015,
                marginBottom:
                    height * 0.03,
            },
        loginInputContainer:
            {
                width: '75%',
                marginBottom:
                    height * 0.03,
                position:
                    'center',
                color: COLORS.neutral_base_dark,
            },
        loginLabel: {
            color: COLORS.dark_accent,
            marginBottom:
                -9,
            position:
                'absolute',
            backgroundColor:
                COLORS.neutral_base_soft,
            top: -(
                height * 0.01
            ),
            left:
                width * 0.04,
            paddingHorizontal:
                width * 0.02,
            zIndex: 1,
            fontSize: 13,
            fontWeight:
                'bold',
        },
        loginTextInput:
            {
                borderWidth: 3,
                borderColor:
                    COLORS.dark_accent,
                borderRadius: 8,
                padding: 10,
                height:
                    height * 0.07,
                backgroundColor:
                    COLORS.neutral_base_soft,
                fontSize: 13,
                color: COLORS.neutral_base_dark,
                // fontFamily: 'PassionOne-Regular',
            },
        loginLogo: {
            width:
                width * 0.6,
            height:
                height * 0.2,
            top:
                height * 0.02,
            alignSelf:
                'center',
            resizeMode:
                'contain',
            marginBottom:
                height * 0.03,
        },
        loginButton: {
            backgroundColor:
                COLORS.button_color,
            paddingHorizontal:
                width * 0.08,
            paddingVertical:
                height *
                0.008,
            alignItems:
                'center',
            borderRadius: 10,
            justifyContent:
                'center',
            marginTop:
                height *
                0.04,
            marginBottom:
                -(
                    height *
                    0.01
                ),
        },
        loginButtonText: {
            color: COLORS.soft_accent,
            fontSize: 16,
            fontWeight:
                '500',
        },
        signUpContainer: {
            flexDirection:
                'row',
            marginTop:
                height *
                0.03,
            justifyContent:
                'center',
            alignItems:
                'center',
        },
        signUpText: {
            fontSize: 13,
            color: COLORS.button_color,
        },
        signUpLink: {
            fontSize: 13,
            color: COLORS.button_color,
            fontWeight:
                'bold',
        },
    },
);

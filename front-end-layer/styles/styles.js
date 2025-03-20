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
            flexGrow: 1,
            paddingVertical: height * 0.02,
            backgroundColor: COLORS.neutral_base_soft,
            alignItems: 'center',
            paddingBottom: height * 0.1,
        },
        scrollContainer: {
            flex: 1,
            width: '100%',
            paddingBottom: height * 0.1,
        },
        questionsContainer: {
            alignItems: 'center',
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
            fontFamily: FONTS.baloo_font,
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

        bottomBarIcon: {
            paddingTop: height * 0.01,
        },


        bottomBarContainer: {
            backgroundColor: COLORS.neutral_base_soft,
            borderTopWidth: 1 ,
            borderTopColor: "#95A3AA", 
            
        },


        // Login Page styles
        loginWelcomeText:
            {
                fontSize:
                    FONTS.title,
                    fontFamily: FONTS.baloo_font,
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
                fontFamily: FONTS.poppins_font,
                color: COLORS.neutral_base_dark,
                textAlign:
                    'center',
                marginTop:
                    -height * 0.015,
                marginBottom:
                    height * 0.03,
            },
        loginInputContainer: {
            fontFamily: FONTS.poppins_font,
            width: '75%',
            marginBottom: height * 0.03,
            position: 'center',
            color: COLORS.neutral_base_dark,
        },
        inputContainer: {
            position: 'relative',
            width: '100%',
        },
        loginLabel: {
            fontFamily: FONTS.login_box_credential_font,
            color: COLORS.dark_accent,
            marginBottom: -9,
            position: 'absolute',
            backgroundColor: COLORS.neutral_base_soft,
            top: -(height * 0.01),
            left: width * 0.04,
            paddingHorizontal: width * 0.02,
            zIndex: 1,
            fontSize: 16,
            fontWeight: 'bold',
        },
        loginTextInput: {
            fontFamily: FONTS.poppins_font,
            borderWidth: 3,
            borderColor: COLORS.dark_accent,
            borderRadius: 8,
            padding: 10,
            height: height * 0.07,
            backgroundColor: COLORS.neutral_base_soft,
            fontSize: 13,
            color: COLORS.neutral_base_dark,
            width: '100%',
        },
        showPasswordButton: {
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: [{ translateY: -10 }],
            padding: 5,
        },
        showPasswordText: {
            color: COLORS.button_color,
            fontSize: 12,
            fontFamily: FONTS.poppins_font,
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
            fontFamily: FONTS.poppins_font,
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
            fontFamily: FONTS.poppins_font,
            fontSize: 13,
            color: COLORS.button_color,
        },
        signUpLink: {
            fontSize: 13,
            color: COLORS.button_color,
            fontWeight:
                'bold',
        },
        welcomeDescription: {
            fontFamily: FONTS.poppins_font,
            fontSize: 16,
            color: COLORS.neutral_base_dark,
            textAlign: 'center',
            marginTop: -height * 0.02,
            marginBottom: height * 0.05,
            width: '75%',
            lineHeight: 24,
        },
        errorMessage: {
            fontFamily: FONTS.poppins_font,
            fontSize: 12,
            color: '#FF0000',
            textAlign: 'center',
            marginTop: -height * 0.01,
            marginBottom: height * 0.02,
            width: '75%',
        },
    },
);

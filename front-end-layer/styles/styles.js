/**
 * @file styles.js
 * @description Includes styles for the texts, buttons, etc.
 *
 * @datecreated 05.11.2024
 * @lastmodified 12.11.2024
 */

import { StyleSheet, Dimensions } from 'react-native'
import { COLORS, FONTS } from '../utils/constants'

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: height * 0.07,
    marginTop: height * 0.05,
    textAlign: 'center',
  },
  forgotPasswordText: {
    color: COLORS.placeholderTextSignUp,
    textAlign: 'center',
    marginTop: -height * 0.015,
    marginBottom: height * 0.03,
  },
  loginInputContainer: {
    width: '75%',
    marginBottom: height * 0.03,
    position: 'center',
    color: COLORS.text,
  },
  loginLabel: {
    color: COLORS.loginBordorColor,
    marginBottom: -9,
    position: 'absolute',
    backgroundColor: COLORS.background,
    top: -(height * 0.01),
    left: width * 0.04,
    paddingHorizontal: width * 0.02,
    zIndex: 1,
    fontSize: 13,
    fontWeight: 'bold',
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
  },
  loginLogo: {
    width: width * 0.6,
    height: height * 0.2,
    top: height * 0.02,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: height * 0.03,
  },
  loginButton: {
    backgroundColor: COLORS.signUpLoginMainText,
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.008,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: height * 0.04,
    marginBottom: -(height * 0.01),
  },
  loginButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '500',
  },
  loginSignUpLink: {
    color: COLORS.signUpLoginMainText,
    fontWeight: 'bold',
  },
  loginDontHaveAccountText: {
    color: COLORS.placeholderTextSignUp,
    textAlign: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: height * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 13,
    color: COLORS.signUpLineText,
  },
  signUpLink: {
    fontSize: 13,
    color: COLORS.signUpLineText,
    fontWeight: 'bold',
  },
})

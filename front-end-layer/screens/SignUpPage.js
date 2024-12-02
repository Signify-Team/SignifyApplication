/**
 * @file SignUpPage.js
 * @description The sign up page of the application
 *              Asks for the user name and email address
 *              Allows options for signing up with Google or Apple account
 *              Includes a button to navigate to the login page
 *
 * @datecreated 05.11.2024
 * @lastmodified 12.11.2024
 */

import React from 'react';
import {View, Text, Button, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';

// SignUp Page layout
const SignUpPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/Signify-Logo.png')}
        style={styles.loginLogo}
      />

      {/* Welcome Text */}
      <Text style={styles.loginWelcomeText}>WELCOME!</Text>

      {/* Inputs */}
      <CustomTextInput label="USERNAME" placeholder="yourusername" />
      <CustomTextInput label="EMAIL" placeholder="yourmail@mail.com" />

      {/* Sign up container */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.replace('Authentication')}>
        <Text style={styles.loginButtonText}>Continue</Text>
      </TouchableOpacity>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.signUpLink}> Log In.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpPage;

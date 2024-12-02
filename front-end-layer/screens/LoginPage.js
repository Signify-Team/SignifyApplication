/**
 * @file LoginPage.js
 * @description Login page for the application. Asks for name and password.
 *              Adds a sign up option if the user doesn't have an account.
 *
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';

// Login Page layout
const LoginPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/Signify-Logo.png')}
        style={styles.loginLogo}
      />

      {/* Welcome Text TODO: Fetch user name to display*/}
      <Text style={styles.loginWelcomeText}>WELCOME BACK, {'\n'} UNAME!</Text>

      {/* Inputs */}
      <CustomTextInput label="EMAIL" placeholder="yourmail@mail.com" />
      <CustomTextInput label="PASSWORD" placeholder="yourpassword" />
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.replace('Home')}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
          <Text style={styles.signUpLink}> Sign Up.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;

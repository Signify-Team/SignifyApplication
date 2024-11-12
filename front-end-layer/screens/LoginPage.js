/**
 * @file LoginPage.js  
 * @description Login page for the application. Asks for name and password. 
 *              Adds a sign up option if the user doesn't have an account. 
 * 
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';

// SignUp Page layout
const SignUpPage = () => {
    const navigation = useNavigation();
  
    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image 
                source={require('../assets/images/Signify-Logo-HighRes.png')}
                style={styles.loginLogo}
            />

            {/* Welcome Text TODO: Fetch user name to display*/}
            <Text style ={styles.loginWelcomeText}>WELCOME BACK, UNAME!</Text>

            {/* Inputs */}
            <CustomTextInput label="EMAIL" placeholder="yourmail@mail.com"/>
            <CustomTextInput label="PASSWORD" placeholder="yourpassword"/>
            <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>        

            <Button
                title="Log In"
                onPress={() => navigation.replace('Home')}  
            />
            <Button
                title="SignUp"
                onPress={() => navigation.replace('SignUp')}  
            />
        </View>
    );
};

export default SignUpPage;


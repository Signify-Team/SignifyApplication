/**
 * @file LoginPage.js
 * @description Login page for the application. Asks for name and password.
 *              Adds a sign up option if the user doesn't have an account.
 *
 * @datecreated 05.11.2024
 * @lastmodified 18.11.2024
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/styles';
import CustomTextInput from '../utils/textInputSignLogin';
import { loginUser } from '../utils/apiService'; // Import API service
import axios from 'axios';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

// Login Page layout
const LoginPage =
    () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const navigation =
            useNavigation();

            const handleLogin = async () => {
                try {
                    const response = await axios.post(API_URL, {
                        email,
                        password,
                    });
            
                    console.log('Response:', response);
            
                    if (response.status === 200) {
                        Alert.alert('Success', 'Login successful');
                        navigation.replace('Home'); // Navigate to Home screen
                    } else {
                        Alert.alert('Error', response.data.message || 'Login failed');
                    }
                } catch (error) {
                    Alert.alert(
                        'Error',
                        error.response?.data?.message || error.message || 'An error occurred'
                    );
                }
            };
            

        return (
            <View
                style={
                    styles.container
                }>
                {/* Logo */}
                <Image
                    source={require('../assets/images/Signify-Logo.png')}
                    style={
                        styles.loginLogo
                    }
                />

                {/* Welcome Text TODO: Fetch user name to display*/}
                <Text
                    style={
                        styles.loginWelcomeText
                    }>
                    WELCOME
                    BACK,{' '}
                    {
                        '\n'
                    }{' '}
                    UNAME!
                </Text>

                {/* Inputs */}
                <CustomTextInput
                    label="EMAIL"
                    placeholder="yourmail@mail.com"
                    onChangeText={(text) => setEmail(text)}
                />
                <CustomTextInput
                    label="PASSWORD"
                    placeholder="yourpassword"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity>
                    <Text
                        style={
                            styles.forgotPasswordText
                        }>
                        Forgot
                        Password?
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={
                        styles.loginButton
                    }
                    onPress={handleLogin}>
                    <Text
                        style={
                            styles.loginButtonText
                        }>
                        Log
                        In
                    </Text>
                </TouchableOpacity>

                <View
                    style={
                        styles.signUpContainer
                    }>
                    <Text
                        style={
                            styles.signUpText
                        }>
                        Don't
                        have
                        an
                        account?
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.replace(
                                'SignUp',
                            )
                        }>
                        <Text
                            style={
                                styles.signUpLink
                            }>
                            {' '}
                            Sign
                            Up.
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

export default LoginPage;

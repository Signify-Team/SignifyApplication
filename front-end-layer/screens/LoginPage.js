/**
 * @file LoginPage.js  
 * @description Login page for the application. Asks for name and password. 
 *              Adds a sign up option if the user doesn't have an account. 
 * 
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

// SignUp Page layout
const SignUpPage = () => {
    const navigation = useNavigation();
  
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Page</Text>
            <Button
                title="Complete Login"
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
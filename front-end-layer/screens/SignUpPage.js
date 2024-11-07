/**
 * @file SignUpPage.js  
 * @description The sign up page of the application 
 *              Asks for the user name and email address
 *              Allows options for signing up with Google or Apple account 
 *              Includes a button to navigate to the login page
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
            <Text style={styles.text}>SignUp Page</Text>
            <Button
                title="Login"
                onPress={() => navigation.replace('Login')}  
            />
        </View>
    );
};

export default SignUpPage;
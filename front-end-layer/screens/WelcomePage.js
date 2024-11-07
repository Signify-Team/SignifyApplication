/**
 * @file WelcomePage.js  
 * @description Initial page when the application is opened for the first time 
 *              Includes information about the application
 * 
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

// Welcome Page Layout
const WelcomePage = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome Page</Text>
            <Button
                title="Get Started"
                onPress={() => navigation.replace('SignUp')}  
            />
        </View>
    );
};

export default WelcomePage;
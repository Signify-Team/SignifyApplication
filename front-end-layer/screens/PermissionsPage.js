/**
 * @file PermissionsPage.js  
 * @description Asks the user for consent after the sign up process. 
 *              If not signed the user can't continue to the application. 
 * 
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/styles';

// Permissions Page layout
const PermissionsPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Permissions Page</Text>
        </View>
    );
};

export default PermissionsPage;
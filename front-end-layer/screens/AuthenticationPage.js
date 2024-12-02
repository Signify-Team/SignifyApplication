/**
 * @file AuthenticationPage.js
 * @description Allows the user to enter the code came to their email.
 *
 * @datecreated 12.11.2024
 * @lastmodified 12.11.2024
 */

import React from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/styles';

// Authentication Page Layout
const AuthenticationPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Authentication Page</Text>
      <Button
        title="Get Started"
        onPress={() => navigation.replace('SignUp')}
      />
    </View>
  );
};

export default AuthenticationPage;

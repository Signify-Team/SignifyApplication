import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

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

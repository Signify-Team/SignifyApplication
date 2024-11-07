import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

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

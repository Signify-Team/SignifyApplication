import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

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

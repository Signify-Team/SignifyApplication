import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUpPage = () => {
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
          <Text style={styles.text}>Login Page</Text>
          <Button
              title="Login"
              onPress={() => navigation.replace('Dashboard')}  
          />
          <Button
          title="SignUp"
          onPress={() => navigation.replace('SignUp')}  
      />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SignUpPage;

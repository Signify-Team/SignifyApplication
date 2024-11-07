import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

const ProfilePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Profile Page</Text>
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

export default ProfilePage;

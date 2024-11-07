import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

const AchievementsPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Achievements Page</Text>
    </View>
  );
};

export default AchievementsPage;

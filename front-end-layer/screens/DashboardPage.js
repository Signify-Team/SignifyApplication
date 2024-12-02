/**
 * @file DashboardPage.js
 * @description Dashboard of the application where the user can reach the courses,
 *              see their overall process, see latest badges, and current streak.
 *
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import {View, Text} from 'react-native';
import styles from '../styles/styles';

// Dashboard Page layout
const DashboardPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard Page</Text>
    </View>
  );
};

export default DashboardPage;

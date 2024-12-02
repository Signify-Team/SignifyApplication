/**
 * @file ProfilePage.js
 * @description Profile page including user information, preferences, changeable information.
 *              Includes a settings button for the user to change their preferences.
 *
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import styles from '../styles/styles'

// Profile Page layout
const ProfilePage = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Page</Text>
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  )
}

export default ProfilePage

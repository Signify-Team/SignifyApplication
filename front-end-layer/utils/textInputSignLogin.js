import React from 'react';
import {View, Text, TextInput} from 'react-native';
import styles from '../styles/styles';

const CustomTextInput = ({label, placeholder}) => {
  return (
    <View style={styles.loginInputContainer}>
      <Text style={styles.loginLabel}>{label}</Text>
      <TextInput
        style={styles.loginTextInput}
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
        keyboardType="default"
      />
    </View>
  );
};

export default CustomTextInput;

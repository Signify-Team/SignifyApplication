import React from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native';
import styles from '../styles/styles';

const CustomTextInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
}) => {
    return (
        <View style={styles.loginInputContainer}>
            <Text style={styles.loginLabel}>
                {label}
            </Text>
            <TextInput
                style={styles.loginTextInput}
                placeholder={placeholder}
                placeholderTextColor="#A9A9A9"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
            />
        </View>
    );
};

export default CustomTextInput;

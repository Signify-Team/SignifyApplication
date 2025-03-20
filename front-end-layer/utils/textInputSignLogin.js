import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
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
    editable,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.loginInputContainer}>
            <Text style={styles.loginLabel}>
                {label}
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.loginTextInput, secureTextEntry && { paddingRight: 40 }]}
                    placeholder={placeholder}
                    placeholderTextColor="#A9A9A9"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    editable={editable}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.showPasswordButton}
                        onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.showPasswordText}>
                            {showPassword ? 'Hide' : 'Show'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default CustomTextInput;

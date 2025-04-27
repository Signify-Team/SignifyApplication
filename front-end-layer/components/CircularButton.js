/**
 * @file CircularButton.js
 * @description Circular Button component with input and icon.
 *
 * @datecreated 19.12.2024
 * @lastmodified 31.03.2025
 */

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/CircularButtonStyle';
import { COLORS, darkenColor } from '../utils/constants';

const CircularButton = ({
    size = 100, // Diameter
    text = '',
    icon = null,
    onlyIcon = false,
    onlyText = false,
    color = COLORS.bright_button_color,
    onPress,
    disabled = false, // Added disabled prop
    textColor = '#FFFFFF', // Added textColor prop
    completed = false, // Added completed prop but not showing badge
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        if (!disabled) {
            setIsPressed(true);
        }
    };

    const handlePressOut = () => {
        if (!disabled) {
            setIsPressed(false);
            if (onPress) {
                onPress();
            }
        }
    };

    return (
        <View
            style={[
                styles.outerWrapper,
                {
                    width: size,
                    height: size,
                    backgroundColor: darkenColor(color, 35),
                    borderRadius: size / 2,
                },
                isPressed && styles.outerWrapperPressed,
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: size / 2,
                    },
                    isPressed && styles.buttonPressed,
                ]}
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
            >
                {disabled && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: size / 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        }}
                    />
                )}
                {onlyIcon && icon ? (
                    <Image source={icon} style={styles.icon} />
                ) : onlyText ? (
                    <Text style={[styles.text, { color: textColor }]}>{text}</Text>
                ) : (
                    <View style={styles.contentWrapper}>
                        {icon && <Image source={icon} style={styles.icon} />}
                        {text ? <Text style={[styles.text, { color: textColor }]}>{text}</Text> : null}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default CircularButton;

/**
 * @file CircularButton.js
 * @description Circular Button component with input and icon.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
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
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
        if (onPress) {onPress();}
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
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: size / 2,
                        borderWidth: 2,
                    },
                    isPressed && styles.buttonPressed,
                ]}
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {onlyIcon && icon ? (
                    <Image source={icon} style={styles.icon} />
                ) : onlyText ? (
                    <Text style={styles.text}>{text}</Text>
                ) : (
                    <View style={styles.contentWrapper}>
                        {icon && <Image source={icon} style={styles.icon} />}
                        {text ? <Text style={styles.text}>{text}</Text> : null}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default CircularButton;

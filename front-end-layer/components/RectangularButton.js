/**
 * @file RectangularButton.js
 * @description Rectangular Button component with input and icon.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */
import React, { useState } from 'react';
import styles from '../styles/RectangularButtonStyle';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, darkenColor } from '../utils/constants';

const RectangularButton = ({
    width: buttonWidth = 200, // Default width
    text = 'Button',
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
        <View style={[styles.outerWrapper, { width: buttonWidth, backgroundColor: darkenColor(color, 30) }, isPressed && styles.outerWrapperPressed]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    { width: buttonWidth, backgroundColor: color },
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

export default RectangularButton;

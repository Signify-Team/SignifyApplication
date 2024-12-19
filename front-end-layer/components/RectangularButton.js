/**
 * @file RectangularButton.js
 * @description Rectangular Button component with input and icon.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const RectangularButton = ({
    width = 200,
    text = 'Button',
    icon = null,
    onlyIcon = false,
    onlyText = false,
    color = COLORS.bright_button_color,
    shadowColor = COLORS.shadow || '#2C6BB2', // Shadow color for 3D effect
    onPress,
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
        if (onPress) onPress();
    };

    return (
        <View
            style={[
                styles.outerWrapper,
                { width, backgroundColor: isPressed ? 'transparent' : shadowColor },
            ]}
        >
            <TouchableOpacity
                style={{
                    ...styles.button,
                    width,
                    backgroundColor: color,
                    borderBottomWidth: isPressed ? 0 : 2,
                }}
                activeOpacity={0.8}
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

const styles = StyleSheet.create({
    outerWrapper: {
        backgroundColor: COLORS.shadow || '#2C6BB2', // Shadow color
        borderRadius: 12,
        paddingBottom: 6, // Slight offset to create depth
        alignItems: 'center',
    },
    button: {
        backgroundColor: COLORS.bright_button_color,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomStartRadius: 6,
        borderBottomEndRadius: 6,
        borderBottomWidth: 2, // White underline
        borderColor: COLORS.highlight || '#FFFFFF', // Lighter highlight for 3D effect
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
});

export default RectangularButton;

/**
 * @file InfoBox.js
 * @description Displays an info box with an image/icon, a number, and a label.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/InfoBoxStyles';

const InfoBox = ({ icon, value, label, onPress }) => {
    const content = (
        <View style={styles.infoBox}>
            {icon && <Image source={icon} style={styles.icon} />}
            {value && <Text style={styles.value}>{value}</Text>}
            {label && <Text style={styles.label}>{label}</Text>}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

export default InfoBox;

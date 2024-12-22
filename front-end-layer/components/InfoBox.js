/**
 * @file InfoBox.js
 * @description Displays an info box with an image/icon, a number, and a label.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/InfoBoxStyles';

const InfoBox = ({ icon, value, label }) => {
    return (
        <View style={styles.infoBox}>
            {icon && <Image source={icon} style={styles.icon} />}
            {value && <Text style={styles.value}>{value}</Text>}
            {label && <Text style={styles.label}>{label}</Text>}
        </View>
    );
};

export default InfoBox;

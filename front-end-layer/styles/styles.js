/**
 * @file styles.js  
 * @description Includes styles for the texts, buttons, etc.
 * 
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.background,
    },
    textTitle: {
        fontSize: FONTS.title,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});
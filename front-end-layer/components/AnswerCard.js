/**
 * @file AnswerCard.js
 * @description Answer card component for the active course.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/AnswerCardStyles';

const AnswerCard = ({ answer, isSelected, isCorrect, onPress, isAnswered }) => {
    const getBackgroundColor = () => {
        if (!isAnswered) {return COLORS.soft_pink_background;}
        if (isSelected) { return isCorrect ? COLORS.tertiary : COLORS.highlight_color_2; } // Green if correct, Red if incorrect 
        if (isCorrect) { return COLORS.tertiary; }// Green for the correct answer even if not selected
        return COLORS.soft_pink_background;
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: getBackgroundColor() }]}
            onPress={onPress}
            disabled={isAnswered}
        >
            <Text style={styles.text}>{answer}</Text>
        </TouchableOpacity>
    );
};

export default AnswerCard;

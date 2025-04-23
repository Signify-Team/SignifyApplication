/**
 * @file VertCard.js
 * @description Vertical card component with title, description and button.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, darkenColor } from '../utils/constants';
import RectangularButton from './RectangularButton';
import DictionaryIcon from '../assets/icons/header/dictionary_icon.png';
const { width, height } = Dimensions.get('window');

const VertCard = ({
    title = 'Card Title',
    description = 'Card description goes here.',
    buttonText = 'START',
    buttonColor = COLORS.start_button,
    onPress,
    onDictionaryPress,
    courseId,
}) => {
    return (
        <View style={[styles.cardWrapper, { backgroundColor: darkenColor(COLORS.soft_pink_background, 40) }]}>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <View style={styles.buttonRow}>
                    <RectangularButton
                        width={width * 0.25}
                        text={buttonText}
                        color={buttonColor}
                        onPress={() => { onPress(); }}
                    />
                    {onDictionaryPress && (
                        <RectangularButton
                            width={width * 0.12}
                            icon={DictionaryIcon}
                            iconHeight={height * 0.03}
                            iconWidth={width * 0.08}
                            onlyIcon={true}
                            color={COLORS.paw_color}
                            onPress={() => onDictionaryPress(courseId)}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        position: 'absolute',
        bottom: 0,
        left: width * 0.05,
        right: width * 0.05,
        borderRadius: 12,
        paddingBottom: height * 0.008,
        alignItems: 'center',
        zIndex: 1000,
        elevation: 5,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    card: {
        width: '100%',
        backgroundColor: COLORS.soft_pink_background,
        borderRadius: 12,
        padding: width * 0.06,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        color: COLORS.neutral_base_dark,
        marginBottom: height * 0.01,
    },
    description: {
        fontSize: 16,
        color: COLORS.dark_gray_1,
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    buttonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: width * 0.17,
      },
});

export default VertCard;

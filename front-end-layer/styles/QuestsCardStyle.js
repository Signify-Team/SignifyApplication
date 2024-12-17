/**
 * @file QuestsCardStyle.js
 * @description Includes styles for the quests card component.
 *
 * @datecreated 17.12.2024
 * @lastmodified 17.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS,} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
        backgroundColor: '#d6e6f2',
        padding: 16,
        borderRadius: 12,
        minHeight: 100,
        justifyContent: 'center',
    },
    timeLimitedCard: {
        backgroundColor: '#fbe3e3',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timeRemaining: {
        color: '#ff5e5e',
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#007bff',
    },
    icon: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 24,
        height: 24,
    },
});

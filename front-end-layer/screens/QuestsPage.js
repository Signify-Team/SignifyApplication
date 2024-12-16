/**
 * @file QuestsPage.js
 * @description Contains the quests of the user.
 *
 * @datecreated 16.12.2024
 * @lastmodified 16.12.2024
 */

import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import styles from '../styles/styles';

// Achievements Page Layout
const QuestsPage =
    () => {
        return (
            <View
                style={
                    styles.container
                }>
                <Text
                    style={
                        styles.text
                    }>
                    Quests
                    Page
                </Text>
            </View>
        );
    };

export default QuestsPage;

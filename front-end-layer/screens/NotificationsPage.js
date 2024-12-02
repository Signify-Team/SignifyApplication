/**
 * @file NotificationsPage.js
 * @description The notifications of the application including new challenges,
 *              daily goal reminders, feed updates etc.
 *
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import styles from '../styles/styles';

// Notifications Page layout
const NotificationsPage =
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
                    Notifications
                    Page
                </Text>
            </View>
        );
    };

export default NotificationsPage;

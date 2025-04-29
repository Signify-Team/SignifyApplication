/**
 * @file BadgeModal.js
 * @description Modal component to display badge details.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';
import styles from '../styles/ProfileCardStyle';

const BadgeModal = ({ visible, onClose, badge, userBadges }) => {
    if (!badge) return null;

    const hasBadge = userBadges?.some(userBadge => userBadge._id === badge._id);

    const formatDate = (dateString) => {
        try {
            // Create a new Date object directly from the dateString
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Date not available';
            }
            return date.toLocaleDateString();
        } catch (error) {
            return 'Date not available';
        }
    };

    const textStyle = {
        fontFamily: FONTS.poppins_font,
        textAlign: 'left',
        fontSize: 16,
        color: COLORS.neutral_base_dark
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{badge.name}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBody}>
                        <Text style={[styles.modalDescription, textStyle]}>{badge.description}</Text>
                        {hasBadge ? (
                            <Text style={[styles.modalDate, textStyle]}>
                                Earned on {formatDate(badge.dateEarned)}
                            </Text>
                        ) : (
                            <Text style={[styles.modalDate, textStyle, { color: COLORS.neutral_base_dark, opacity: 0.7 }]}>
                                Not earned yet
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default BadgeModal; 
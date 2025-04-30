/**
 * @file BadgeModal.js
 * @description Modal component to display badge details.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';
import styles from '../styles/ProfileCardStyle';

const BadgeModal = ({ visible, onClose, badge, userBadges }) => {
    if (!badge) return null;

    const hasBadge = userBadges?.some(userBadge => userBadge._id === badge._id);
    const earnedBadge = userBadges?.find(userBadge => userBadge._id === badge._id);

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'Date not available';
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Date not available';
            }
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date not available';
        }
    };

    const textStyle = {
        fontFamily: FONTS.poppins_font,
        textAlign: 'left',
        fontSize: 16,
        color: COLORS.neutral_base_dark
    };

    const handleImageError = (error) => {
        console.error('Error loading badge icon:', error.nativeEvent.error);
        console.error('Badge icon URL:', badge.iconUrl);
    };

    const handleImageLoad = () => {
        console.log('Badge icon loaded successfully:', badge.iconUrl);
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
                        {badge.iconUrl ? (
                            <Image 
                                source={{ uri: badge.iconUrl }} 
                                style={[styles.badgeIcon, !hasBadge && { opacity: 0.7 }]}
                                resizeMode="contain"
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                            />
                        ) : (
                            <Text style={[textStyle, { marginBottom: 10 }]}>No icon available</Text>
                        )}
                        <Text style={[styles.modalDescription, textStyle]}>{badge.description}</Text>
                        {hasBadge ? (
                            <Text style={[styles.modalDate, textStyle]}>
                                Earned on {formatDate(earnedBadge?.dateEarned)}
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
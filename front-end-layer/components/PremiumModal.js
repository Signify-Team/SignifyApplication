/**
 * @file PremiumModal.js
 * @description Modal component to display premium course upgrade prompt.
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';
import RectangularButton from './RectangularButton';

const { width, height } = Dimensions.get('window');

const PremiumModal = ({ visible, onClose, onUpgrade }) => {
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
                        <Text style={styles.modalTitle}>Premium Course</Text>
                    </View>
                    <View style={styles.modalBody}>
                        <Image 
                            source={require('../assets/icons/course-info/trophyIcon.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.modalDescription}>
                            This is a premium course. Upgrade to access all premium content and features!
                        </Text>
                        <View style={styles.buttonContainer}>
                            <RectangularButton
                                width={width * 0.6}
                                text="UPGRADE TO PREMIUM"
                                color={COLORS.premium_gold}
                                onPress={onUpgrade}
                            />
                            <RectangularButton
                                width={width * 0.6}
                                text="MAYBE LATER"
                                color={COLORS.dark_gray_1}
                                onPress={onClose}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        fontWeight: 'bold',
    },
    modalBody: {
        width: '100%',
        alignItems: 'center',
    },
    modalDescription: {
        fontSize: 16,
        fontFamily: FONTS.poppins_font,
        color: COLORS.dark_gray_1,
        textAlign: 'center',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    icon: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
    },
});

export default PremiumModal; 
/**
 * @file LogoutModal.js
 * @description Logout confirmation modal component
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/ModalStyles';

const LogoutModal = ({ visible, onClose, onConfirm }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={[styles.title, { color: COLORS.neutral_base_dark }]}>
                        Logout
                    </Text>
                    <Text style={styles.message}>
                        Are you sure you want to logout?
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.actionButton]}
                            onPress={onConfirm}
                        >
                            <Text style={[styles.buttonText, styles.actionButtonText]}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LogoutModal; 
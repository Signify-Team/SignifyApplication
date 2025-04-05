/**
 * @file DeleteAccountModal.js
 * @description Delete account confirmation modal component
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/ModalStyles';

const DeleteAccountModal = ({ visible, onClose, onConfirm, isLoading }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={[styles.title, { color: COLORS.button_color }]}>
                        Delete Account
                    </Text>
                    <Text style={styles.message}>
                        Are you sure you want to delete your account?
                    </Text>
                    <Text style={styles.warningText}>
                        This action cannot be undone.
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.dangerButton]}
                            onPress={onConfirm}
                            disabled={isLoading}
                        >
                            <Text style={[styles.buttonText, styles.actionButtonText]}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteAccountModal; 
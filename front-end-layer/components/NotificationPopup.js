/**
 * @file NotificationPopup.js
 * @description Custom notification popup component with modern UI
 * @datecreated 31.03.2025
 */

import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import styles from '../styles/NotificationPopupStyles';

const NotificationPopup = ({ visible, onClose, title, message, icon }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.content}>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.okButton}
                        onPress={onClose}
                    >
                        <Text style={styles.okButtonText}>Got it!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default NotificationPopup; 
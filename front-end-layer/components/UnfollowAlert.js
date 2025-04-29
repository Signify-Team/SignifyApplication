import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const UnfollowAlert = ({ visible, onClose, onConfirm, title, message }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton]} 
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.confirmButton]} 
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>Unfollow</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        width: '80%',
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
    title: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.neutral_base_dark,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: COLORS.neutral_base_dark,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.neutral_base_soft,
    },
    confirmButton: {
        backgroundColor: COLORS.bright_button_color,
    },
    cancelButtonText: {
        color: COLORS.neutral_base_dark,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    confirmButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
});

export default UnfollowAlert; 
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const ConfirmationModal = ({ visible, title, message, onConfirm, onCancel, confirmText = "Leave", cancelText = "Stay" }) => {
    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={onCancel}
                    >
                        <Text style={[styles.buttonText, styles.cancelButtonText]}>{cancelText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.confirmButton]}
                        onPress={onConfirm}
                    >
                        <Text style={[styles.buttonText, styles.confirmButtonText]}>{confirmText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: COLORS.white,
        borderRadius: 16,
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
    title: {
        fontSize: 24,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.light_gray_1,
    },
    confirmButton: {
        backgroundColor: COLORS.highlight_color_2,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: FONTS.poppins_font,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: COLORS.neutral_base_dark,
    },
    confirmButtonText: {
        color: COLORS.white,
    },
});

export default ConfirmationModal; 
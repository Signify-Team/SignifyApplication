import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/StreakPopupStyles';

const StreakPopup = ({ visible, message, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Image
                        source={require('../assets/icons/header/streak.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.modalTitle}>Streak Update!</Text>
                    <Text style={styles.modalText}>{message}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Continue Learning</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default StreakPopup; 
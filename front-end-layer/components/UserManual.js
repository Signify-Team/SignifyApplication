import React from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { COLORS } from '../utils/constants';

const UserManual = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.title}>Welcome to Signify!</Text>
                        
                        <Text style={styles.sectionTitle}>Getting Started</Text>
                        <Text style={styles.text}>
                            • Choose your preferred sign language (ASL or TID){'\n'}
                            • Complete daily lessons to maintain your streak{'\n'}
                            • Track your progress in the profile section{'\n'}
                            • Earn points and unlock achievements
                        </Text>

                        <Text style={styles.sectionTitle}>Key Features</Text>
                        <Text style={styles.text}>
                            • Interactive lessons with video demonstrations{'\n'}
                            • Practice exercises to reinforce learning{'\n'}
                            • Progress tracking and statistics{'\n'}
                            • Daily streaks and rewards{'\n'}
                            • Community features and social sharing
                        </Text>

                        <Text style={styles.sectionTitle}>Tips for Success</Text>
                        <Text style={styles.text}>
                            • Practice regularly to maintain your streak{'\n'}
                            • Complete all exercises in each lesson{'\n'}
                            • Review previous lessons periodically{'\n'}
                            • Use the practice mode to reinforce learning{'\n'}
                            • Join the community to learn from others
                        </Text>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Got it!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: Dimensions.get('window').width * 0.9,
        maxHeight: Dimensions.get('window').height * 0.8,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollView: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginTop: 15,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: COLORS.button_color,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserManual; 
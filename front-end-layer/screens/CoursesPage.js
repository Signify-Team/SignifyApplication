/**
 * @file CoursesPage.js  
 * @description Courses page of the application including different courses according
 *              to the curriculum. 
 * 
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../styles/styles';
import { useNavigation } from '@react-navigation/native';

// Courses Page layout
const CoursesPage = () => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Courses Page</Text>
            <Button
                title="Image Processing"
                onPress={() => navigation.replace('ImageProcessing')}  
            />
        </View>
    );
};

export default CoursesPage;
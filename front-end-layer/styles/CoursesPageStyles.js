import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonRow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    leftButton: {
        alignItems: 'flex-start',
        paddingLeft: 50,
    },
    rightButton: {
        alignItems: 'flex-end',
        paddingRight: 50,
    },
    pathContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        elevation: 1,
    },
    buttonContainer: {
        position: 'relative',
        zIndex: 2,
        elevation: 5,
        backgroundColor: 'transparent',
    },
}); 
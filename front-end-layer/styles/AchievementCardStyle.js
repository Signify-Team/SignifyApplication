/**
 * @file AchievementCardStyles.js
 * @description Styling for the achievement card component
 *
 * @datecreated 21.12.2024
 * @lastmodified 21.12.2024
 */

export default {
    achievementCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    achievementContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    achievementText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#555555',
    },
    trophyImage: {
        width: 40,
        height: 40,
        marginTop: -20,
    },
    collectButton: {
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    collectButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    collectButtonDisabled: {
        backgroundColor: '#FFCFCF',
    },
    buttonContainer: {
        paddingTop: 16,
        alignItems: 'center',
    },
};

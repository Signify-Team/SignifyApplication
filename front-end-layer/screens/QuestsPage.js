/**
 * @file QuestsPage.js
 * @description Contains the quests of the user.
 *
 * @datecreated 17.12.2024
 * @lastmodified 17.12.2024
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Modal, ActivityIndicator, RefreshControl, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/QuestsCardStyle.js';
import QuestsCard from '../components/QuestsCard';
import { getUserId } from '../utils/services/authService';
import { fetchQuests, fetchCompletedQuests, completeQuest, collectQuestReward } from '../utils/services/questService';
import { getUserLanguagePreference } from '../utils/services/languageService';
import { API_URL } from '@env';
import { COLORS } from '../utils/constants';

const LANGUAGE_PREFERENCE_KEY = '@user_language_preference';

const QuestsPage = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [collectError, setCollectError] = useState(null);
  const [dailyQuests, setDailyQuests] = useState([]);
  const [friendQuests, setFriendQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userLanguage, setUserLanguage] = useState('ASL');

  // Animation values
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const questAnimations = useRef({}).current;

  // Add useEffect to handle route params
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = navigation.getState().routes.find(route => route.name === 'Quests')?.params;
      if (params?.refresh) {
        console.log('Refreshing quests due to language change');
        onRefresh();
        // Clear the refresh parameter
        navigation.setParams({ refresh: undefined });
      }
    });

    // Initial load
    initializeUserId();

    return unsubscribe;
  }, [navigation]);

  // Add useEffect to watch for language changes
  useEffect(() => {
    const checkAndUpdateLanguage = async () => {
      if (userId) {
        try {
          const currentLanguage = await fetchUserLanguage();
          if (currentLanguage !== userLanguage) {
            setUserLanguage(currentLanguage);
            await fetchQuestsData(userId);
          }
        } catch (error) {
          console.error('Error checking language:', error);
        }
      }
    };

    checkAndUpdateLanguage();
  }, [userId]);

  // Add focus listener to refresh when page comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const currentLanguage = await fetchUserLanguage();
        if (currentLanguage !== userLanguage) {
          setUserLanguage(currentLanguage);
          if (userId) {
            await fetchQuestsData(userId);
          }
        }
      } catch (error) {
        console.error('Error fetching language on focus:', error);
      }
    });

    // Initial load
    initializeUserId();

    return unsubscribe;
  }, [navigation, userId]);

  // Fetch user language preference
  const fetchUserLanguage = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error('No user ID found. Please log in again.');
      }

      const language = await getUserLanguagePreference();
      
      if (!language) {
        throw new Error('User language preference not set');
      }

      const userLang = language === 'TİD' || language === 'TID' ? 'TİD' : language;
      
      return userLang;
    } catch (error) {
      console.error('Error in fetchUserLanguage:', error);
      throw error;
    }
  };

  const initializeUserId = async () => {
    try {
      setLoading(true);
      const id = await getUserId();
      if (!id) {
        setError('Please log in to view your quests');
        setLoading(false);
        return;
      }
      setUserId(id);
      try {
        const currentLanguage = await fetchUserLanguage();
        setUserLanguage(currentLanguage);
        await fetchQuestsData(id);
      } catch (error) {
        console.error('Error fetching user language:', error);
        setError('Failed to load user preferences. Please try again later.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error in initializeUserId:', err);
      setError('Failed to get user information');
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (userId) {
      fetchUserLanguage()
        .then((currentLanguage) => {
          if (currentLanguage !== userLanguage) {
            setUserLanguage(currentLanguage);
          }
          fetchQuestsData(userId);
        })
        .catch((error) => {
          console.error('Error refreshing user language:', error);
          setError('Failed to refresh user preferences. Please try again later.');
          setRefreshing(false);
        });
    } else {
      initializeUserId();
    }
  }, [userId, userLanguage]);

  const fetchQuestsData = async (currentUserId) => {
    try {
      setError(null);
      setCollectError(null);

      let allQuests, userQuests;
      try {
        allQuests = await fetchQuests();
      } catch (error) {
        console.error('Error fetching quests:', error);
        throw new Error('Failed to fetch quests: ' + error.message);
      }

      try {
        userQuests = await fetchCompletedQuests(currentUserId);
      } catch (error) {
        console.error('Error fetching completed quests:', error);
        throw new Error('Failed to fetch completed quests: ' + error.message);
      }

      // Helper function to get user quest data
      const getQuestStatus = (quest, userQuests) => {
        const userQuest = userQuests.find(uq => uq.questId === quest._id);
        if (userQuest) {
          return {
            isCompleted: userQuest.status === 'Completed',
            collected: userQuest.collected || false,
            dateCompleted: userQuest.dateCompleted
          };
        }
        return { isCompleted: false, collected: false, dateCompleted: null };
      };

      // Filter and sort quests
      const filterAndSortQuests = (quests, type) => {
        const now = new Date();
        
        const filteredQuests = quests
          .filter(quest => {
            const status = getQuestStatus(quest, userQuests);
            
            const isWithinDateRange = () => {
              const hasStartDate = quest.startDate;
              const hasDeadline = quest.deadline;
              
              if (hasStartDate && hasDeadline) {
                return new Date(quest.startDate) <= now && new Date(quest.deadline) >= now;
              }
              
              if (hasStartDate) {
                return new Date(quest.startDate) <= now;
              }
              
              if (hasDeadline) {
                return new Date(quest.deadline) >= now;
              }
              
              return true;
            };

            const isLanguageMatch = () => {

              if (userLanguage === 'TİD' || userLanguage === 'TID') {
                const isTIDQuest = quest.language === 'TİD';
                return isTIDQuest;
              }
              
              if (userLanguage === 'ASL') {
                const isASLQuest = quest.language === 'ASL' || !quest.language;
                return isASLQuest;
              }
              
              return false;
            };
            
            const isPastDeadline = quest.deadline && new Date(quest.deadline) < now;

            const shouldShow = quest.questType === type &&
              (!status.isCompleted || (status.isCompleted && !status.collected)) &&
              !(isPastDeadline && !status.isCompleted) &&
              isWithinDateRange() &&
              isLanguageMatch();

            return shouldShow;
          })
          .map(quest => {
            const status = getQuestStatus(quest, userQuests);
            return {
              ...quest,
              isCompleted: status.isCompleted,
              collected: status.collected,
              dateCompleted: status.dateCompleted
            };
          })
          .sort((a, b) => {
            const aStatus = getQuestStatus(a, userQuests);
            const bStatus = getQuestStatus(b, userQuests);
            
            if (aStatus.isCompleted && !aStatus.collected) return -1;
            if (bStatus.isCompleted && !bStatus.collected) return 1;
            return 0;
          });

        return filteredQuests;
      };

      const daily = filterAndSortQuests(allQuests, 'daily');
      const friends = filterAndSortQuests(allQuests, 'friend');

      const formattedCompletedQuests = userQuests
        .map(quest => {
          const originalQuest = allQuests.find(q => {
            const match = q._id === quest.questId || q.questId === quest.questId;
            return match;
          });

          if (!originalQuest) {
            return null;
          }

          const formattedQuest = {
            ...originalQuest,
            ...quest,
            questId: quest.questId || originalQuest._id,
            _id: quest.questId || originalQuest._id,
            title: originalQuest.title || 'Unknown Quest',
            description: originalQuest.description || '',
            questType: originalQuest.questType || 'friend',
            rewardPoints: originalQuest.rewardPoints || 0,
            dateCompleted: quest.dateCompleted || new Date(),
            status: 'Completed',
            isCompleted: true,
            collected: quest.collected || false
          };

          return formattedQuest;
        })
        .filter(quest => {
          const isValid = quest !== null && quest.isCompleted && quest.collected === true;
          return isValid;
        });

      setDailyQuests(daily);
      setFriendQuests(friends);
      setCompletedQuests(formattedCompletedQuests);
    } catch (err) {
      console.error('Error in fetchQuestsData:', err);
      setError('Failed to fetch quests. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initialize animation
  const initializeQuestAnimation = (questId) => {
    if (!questAnimations[questId]) {
      questAnimations[questId] = {
        scale: new Animated.Value(1),
        translateY: new Animated.Value(0),
      };
    }
  };

  // Animate quest card press
  const animateQuestPress = (questId) => {
    const animation = questAnimations[questId];
    Animated.sequence([
      Animated.timing(animation.scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation.scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animate modal appearance
  const animateModalIn = () => {
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animate modal disappearance
  const animateModalOut = () => {
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  // Animate quest completion
  const animateQuestCompletion = (questId) => {
    const animation = questAnimations[questId];
    Animated.sequence([
      Animated.timing(animation.scale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation.scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation.translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleQuestPress = (quest) => {
    setSelectedQuest(quest);
    setModalVisible(true);
    animateQuestPress(quest.questId || quest._id);
    animateModalIn();
  };

  const handleCollectReward = async (questId) => {
    try {
      setCollectError(null);
      
      // collect the reward
      const result = await collectQuestReward(questId, userId);
      
      // Refresh quests after collection
      await fetchQuestsData(userId);
    } catch (err) {
      console.error('Error collecting quest reward:', err);
      setCollectError('Failed to collect reward. Please try again.');
    }
  };

  const formatTimeRemaining = (deadline) => {
    if (!deadline) return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffInHours = Math.round((deadlineDate - now) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      const remainingHours = diffInHours % 24;
      return `${days}d ${remainingHours}h`;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { flex: 1, paddingBottom: 0 }]}>
      {collectError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{collectError}</Text>
        </View>
      )}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            {dailyQuests.length > 0 && (
              <>
                <Text style={styles.header}>Daily Quests</Text>
                {dailyQuests.map((quest) => {
                  const questId = quest.questId || quest._id;
                  initializeQuestAnimation(questId);
                  return (
                    <Animated.View
                      key={questId}
                      style={{
                        transform: [
                          { scale: questAnimations[questId]?.scale || 1 },
                          { translateY: questAnimations[questId]?.translateY || 0 }
                        ]
                      }}
                    >
                      {quest.isCompleted && !quest.collected ? (
                        <QuestsCard
                          title={quest.title}
                          description={quest.description}
                          timeRemaining={formatTimeRemaining(quest.deadline)}
                          progress={0}
                          total={1}
                          isDailyQuest={true}
                          isCompleted={quest.isCompleted}
                          collected={quest.collected}
                          onCollectPress={() => handleCollectReward(questId)}
                          rewardPoints={quest.rewardPoints}
                        />
                      ) : (
                        <TouchableOpacity 
                          onPress={() => handleQuestPress(quest)}
                        >
                          <QuestsCard
                            title={quest.title}
                            description={quest.description}
                            timeRemaining={formatTimeRemaining(quest.deadline)}
                            progress={0}
                            total={1}
                            isDailyQuest={true}
                            isCompleted={quest.isCompleted}
                            collected={quest.collected}
                            onCollectPress={quest.isCompleted && !quest.collected ? () => handleCollectReward(questId) : undefined}
                            rewardPoints={quest.rewardPoints}
                          />
                        </TouchableOpacity>
                      )}
                    </Animated.View>
                  );
                })}
              </>
            )}

            {friendQuests.length > 0 && (
              <>
                <Text style={styles.header}>Quests Between Friends</Text>
                {friendQuests.map((quest) => {
                  const questId = quest._id || quest.questId;
                  initializeQuestAnimation(questId);
                  return (
                    <Animated.View
                      key={questId}
                      style={{
                        transform: [
                          { scale: questAnimations[questId]?.scale || 1 },
                          { translateY: questAnimations[questId]?.translateY || 0 }
                        ]
                      }}
                    >
                      {quest.isCompleted && !quest.collected ? (
                        <QuestsCard
                          title={quest.title}
                          description={quest.description}
                          timeRemaining={formatTimeRemaining(quest.deadline)}
                          progress={0}
                          total={1}
                          isDailyQuest={false}
                          isCompleted={quest.isCompleted}
                          collected={quest.collected}
                          onCollectPress={() => handleCollectReward(questId)}
                          rewardPoints={quest.rewardPoints}
                        />
                      ) : (
                        <TouchableOpacity 
                          onPress={() => handleQuestPress(quest)}
                        >
                          <QuestsCard
                            title={quest.title}
                            description={quest.description}
                            timeRemaining={formatTimeRemaining(quest.deadline)}
                            progress={0}
                            total={1}
                            isDailyQuest={false}
                            isCompleted={quest.isCompleted}
                            collected={quest.collected}
                            onCollectPress={quest.isCompleted && !quest.collected ? () => handleCollectReward(questId) : undefined}
                            rewardPoints={quest.rewardPoints}
                          />
                        </TouchableOpacity>
                      )}
                    </Animated.View>
                  );
                })}
              </>
            )}

            {completedQuests.length > 0 && (
              <>
                <Text style={styles.header}>Completed Quests</Text>
                {completedQuests.map((quest) => {
                  const questId = quest.questId || quest._id;
                  initializeQuestAnimation(questId);
                  return (
                    <Animated.View
                      key={questId}
                      style={{
                        transform: [
                          { scale: questAnimations[questId]?.scale || 1 },
                          { translateY: questAnimations[questId]?.translateY || 0 }
                        ]
                      }}
                    >
                      <TouchableOpacity 
                        onPress={() => handleQuestPress(quest)}
                      >
                        <QuestsCard
                          title={quest.title || 'Unknown Quest'}
                          description={quest.description}
                          progress={1}
                          total={1}
                          isDailyQuest={quest.questType === 'daily'}
                          isCompleted={true}
                          collected={true}
                          dateCompleted={quest.dateCompleted}
                          rewardPoints={quest.rewardPoints}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </>
            )}

            {dailyQuests.length === 0 && friendQuests.length === 0 && completedQuests.length === 0 && (
              <Text style={styles.noQuestsText}>No quests available</Text>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={animateModalOut}
      >
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: modalOpacityAnim
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ scale: modalScaleAnim }]
              }
            ]}
          >
            {selectedQuest && (
              <>
                <Text style={styles.modalTitle}>{selectedQuest.title}</Text>
                <Text style={styles.modalDescription}>{selectedQuest.description}</Text>
                {selectedQuest.startDate && (
                  <Text style={styles.modalDeadline}>
                    Start Date: {new Date(selectedQuest.startDate).toLocaleString()}
                  </Text>
                )}
                {selectedQuest.deadline && (
                  <Text style={styles.modalDeadline}>
                    Deadline: {new Date(selectedQuest.deadline).toLocaleString()}
                  </Text>
                )}
                <Text style={styles.modalLanguage}>
                  Language: {selectedQuest.language || 'ASL'}
                </Text>
                <Text style={styles.modalPoints}>
                  Reward Points: {selectedQuest.rewardPoints}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={animateModalOut}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default QuestsPage;

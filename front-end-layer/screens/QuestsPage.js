/**
 * @file QuestsPage.js
 * @description Contains the quests of the user.
 *
 * @datecreated 17.12.2024
 * @lastmodified 17.12.2024
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Modal, ActivityIndicator, RefreshControl, TouchableOpacity, Animated, Easing } from 'react-native';
import styles from '../styles/QuestsCardStyle.js';
import QuestsCard from '../components/QuestsCard';
import { getUserId, fetchQuests, fetchCompletedQuests, completeQuest, collectQuestReward } from '../utils/apiService';

const QuestsPage = () => {
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

  // Animation values
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const questAnimations = useRef({}).current;

  useEffect(() => {
    initializeUserId();
  }, []);

  const initializeUserId = async () => {
    try {
      const id = await getUserId();
      if (!id) {
        setError('Please log in to view your quests');
        return;
      }
      setUserId(id);
      fetchQuestsData(id);
    } catch (err) {
      setError('Failed to get user information');
      console.error('Error getting user ID:', err);
    }
  };

  const fetchQuestsData = async (currentUserId) => {
    try {
      setLoading(true);
      const [allQuests, userQuests] = await Promise.all([
        fetchQuests(),
        fetchCompletedQuests(currentUserId)
      ]);


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
        
        const filteredQuests = quests
          .filter(quest => {
            const status = getQuestStatus(quest, userQuests);
            
            // completed AND collected quests
            if (type === 'completed') {
              return status.isCompleted && status.collected;
            }
            
            // // uncompleted quests or completed but not collected
            // return quest.questType === type && (!status.isCompleted || (status.isCompleted && !status.collected));

            // keep the completed / uncompleted and not collected quests but hide the expired ones
            const now = new Date();
            const isPastDeadline = quest.deadline && new Date(quest.deadline) < now;

            return (
              quest.questType === type &&
              (!status.isCompleted || (status.isCompleted && !status.collected)) &&
              !(isPastDeadline && !status.isCompleted) // <== hide incomplete + expired quests
            );

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
            // Prioritizes completed but not collected quests
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
            collected: quest.collected || false // Default to false if not set
          };

          return formattedQuest;
        })
        .filter(quest => {
          // completed and collected
          const isValid = quest !== null && quest.isCompleted && quest.collected === true;
          return isValid;
        });

      setDailyQuests(daily);
      setFriendQuests(friends);
      setCompletedQuests(formattedCompletedQuests);
      setError(null);
      setCollectError(null);
    } catch (err) {
      console.error('Error fetching quests:', err);
      setError('Failed to fetch quests. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (userId) {
      fetchQuestsData(userId);
    }
  }, [userId]);

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
        <ActivityIndicator size="large" color="#0000ff" />
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
            colors={['#0000ff']}
            tintColor="#0000ff"
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
                {selectedQuest.deadline && (
                  <Text style={styles.modalDeadline}>
                    Deadline: {new Date(selectedQuest.deadline).toLocaleString()}
                  </Text>
                )}
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

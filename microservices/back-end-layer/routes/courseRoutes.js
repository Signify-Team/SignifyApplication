/**
 * @file courseRoutes.js
 * @description This file handles the course routes.
 *
 * @datecreated 16.02.2025
 * @lastmodified 16.02.2025
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import Course from '../models/CourseDB.js';
import User from '../models/UserDB.js';
import mongoose from 'mongoose';
import Section from '../models/SectionDB.js';
import Quest from '../models/QuestDB.js';
import Notification from '../models/NotificationDB.js';

const router = express.Router();

// rate limiter 
const courseLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3000, // Limit each IP to 300 requests per window (increased from 100)
    message: { error: 'Too many requests. Please try again later.' },
    statusCode: 429,
});

// Apply rate limiter to all course routes
router.use(courseLimiter);

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('exercises');
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('exercises')
            .populate('dictionary');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start a course (User selects a course to start)
router.post('/:id/start', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json({ message: `Course '${course.name}' started!`, course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Finish a course (Mark course as completed)
router.post('/:id/finish', async (req, res) => {
    try {
        const { userId, isPassed, completed, progress } = req.body;
        const courseId = req.params.id;

        // Validate required fields
        if (!userId || isPassed === undefined || completed === undefined || progress === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find course and user
        const [course, user] = await Promise.all([
            Course.findById(courseId),
            User.findById(userId)
        ]);

        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find or create course progress entry
        let courseProgress = user.courseProgress.find(p => p.courseId.toString() === courseId);
        if (!courseProgress) {
            user.courseProgress.push({
                courseId: courseId,
                isLocked: false, // First course is always unlocked
                progress: 0,
                completed: false,
                lastAccessed: new Date()
            });
            courseProgress = user.courseProgress[user.courseProgress.length - 1];
        }

        // Only update streak if the course wasn't already completed
        let streakMessage = null;
        let shouldShowNotification = false;

        if (completed && isPassed && !courseProgress.completed) {
            const currentDate = new Date();
            const yesterday = new Date(currentDate);
            yesterday.setDate(yesterday.getDate() - 1);

            // Format dates to compare only the date part (ignoring time)
            const formatDate = (date) => {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            };

            const currentDateFormatted = formatDate(currentDate);
            const yesterdayFormatted = formatDate(yesterday);
            const lastCompletedFormatted = user.lastCompletedCourseDate ? formatDate(user.lastCompletedCourseDate) : null;

            if (!lastCompletedFormatted) {
                // First course completion
                user.streakCount = 1;
                streakMessage = "Great start! You've completed your first course!";
                shouldShowNotification = true;
            } else if (currentDateFormatted.getTime() === lastCompletedFormatted.getTime()) {
                // Already completed a course today - no streak change
                streakMessage = `Keep going! You're on a ${user.streakCount}-day streak!`;
            } else if (yesterdayFormatted.getTime() === lastCompletedFormatted.getTime()) {
                // Completed a course yesterday - increment streak
                user.streakCount += 1;
                streakMessage = `Congratulations! Your streak is now ${user.streakCount} days!`;
                shouldShowNotification = true;
            } else {
                // Streak broken - reset to 1 instead of 0
                user.streakCount = 1;
                streakMessage = "You've started a new streak! Keep it going!";
                shouldShowNotification = true;
            }

            // Update last completed course date
            user.lastCompletedCourseDate = currentDate;

            // Find all courses in the same section
            const allCourses = await Course.find().sort({ createdAt: 1 });
            const currentCourseIndex = allCourses.findIndex(c => c._id.toString() === courseId);
            
            // Get the current section with populated courses
            const currentSection = await Section.findOne({ courses: courseId }).populate('courses');
            
            if (currentCourseIndex !== -1 && currentSection) {
                // Find the current course's index in the section's courses array
                const currentCourseInSectionIndex = currentSection.courses.findIndex(c => c._id.toString() === courseId);
                
                // Handle next course in the same section
                if (currentCourseInSectionIndex < currentSection.courses.length - 1) {
                    const nextCourse = currentSection.courses[currentCourseInSectionIndex + 1];
                    const nextCourseProgress = user.courseProgress.find(p => p.courseId.toString() === nextCourse._id.toString());
                    
                    if (!nextCourseProgress) {
                        // Add next course to progress, unlocked
                        user.courseProgress.push({
                            courseId: nextCourse._id,
                            isLocked: false,
                            progress: 0,
                            completed: false,
                            lastAccessed: new Date(),
                            unlockDate: new Date()
                        });
                    } else {
                        // If it exists, ensure it's unlocked
                        nextCourseProgress.isLocked = false;
                        nextCourseProgress.unlockDate = new Date();
                        nextCourseProgress.lastAccessed = new Date();
                    }
                }

                // Handle next section's first course if current section is completed
                const nonPremiumCourses = currentSection.courses.filter(c => !c.isPremium);
                const allNonPremiumCompleted = nonPremiumCourses.every(c => {
                    const progress = user.courseProgress.find(p => p.courseId.toString() === c._id.toString());
                    return progress && progress.completed;
                });

                if (allNonPremiumCompleted) {
                    // Find next section
                    const nextSection = await Section.findOne({ order: currentSection.order + 1 }).populate('courses');
                    if (nextSection && nextSection.courses.length > 0) {
                        const nextSectionFirstCourse = nextSection.courses[0];
                        const nextSectionFirstCourseProgress = user.courseProgress.find(
                            p => p.courseId.toString() === nextSectionFirstCourse._id.toString()
                        );

                        if (!nextSectionFirstCourseProgress) {
                            // Add next section's first course, unlocked
                            user.courseProgress.push({
                                courseId: nextSectionFirstCourse._id,
                                isLocked: false,
                                progress: 0,
                                completed: false,
                                lastAccessed: new Date(),
                                unlockDate: new Date()
                            });
                        } else {
                            // If it exists, ensure it's unlocked
                            nextSectionFirstCourseProgress.isLocked = false;
                            nextSectionFirstCourseProgress.unlockDate = new Date();
                            nextSectionFirstCourseProgress.lastAccessed = new Date();
                        }
                    }
                }
            }

            // Check for Quiz Master quest completion if success rate is 80% or higher
            if (progress >= 80) {
                try {
                    const quizMasterQuest = await Quest.findOne({ 
                        questId: "67e6bc2ffd5e2d4e82c809e1",
                        language: "TİD"
                    });

                    if (quizMasterQuest) {
                        // Check if user already has this quest
                        const existingQuest = user.quests.find(q => q.questId.toString() === quizMasterQuest._id.toString());
                        
                        if (!existingQuest) {
                            user.quests.push({
                                questId: quizMasterQuest._id,
                                status: "Completed",
                                dateAssigned: new Date(),
                                dateCompleted: new Date(),
                                collected: false
                            });

                            // Create a notification for the quest completion
                            await createNotification('quest', 'Quest Completed!', `You've completed the "${quizMasterQuest.title}" quest!`, userId);
                        }
                    }
                } catch (error) {
                    console.error('Error checking Quiz Master quest:', error);
                    // Don't fail the course completion if quest check fails
                }
            }
        }

        // Update progress regardless of completion status
        courseProgress.progress = progress;
        courseProgress.completed = completed;
        courseProgress.isLocked = false; // Ensure completed course is always unlocked
        courseProgress.lastAccessed = new Date();

        // Save user with all updates at once
        await user.save();

        // Check if we need to show quest completion popup
        const questCompletionData = progress >= 80 ? {
            showQuestCompletion: true,
            questTitle: "Quiz Master",
            questDescription: "Score 80% or higher in any course.",
            rewardPoints: 100
        } : null;

        res.status(200).json({ 
            message: `Course '${course.name}' completed!`, 
            course,
            isPassed,
            progress: courseProgress,
            streakMessage,
            shouldShowNotification,
            questCompletionData
        });
    } catch (err) {
        console.error('Error completing course:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create a new course
router.post('/', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a course
router.delete('/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get courses with user-specific lock status
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get both user and all courses in parallel
        const [user, allCourses] = await Promise.all([
            User.findById(userId),
            Course.find().populate('exercises').populate('dictionary')
        ]);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Map courses with user-specific status
        const coursesWithStatus = allCourses.map((course, index) => {
            // Find user's progress for this course
            const userProgress = user.courseProgress.find(
                progress => progress.courseId.toString() === course._id.toString()
            );

            // Determine if course should be unlocked
            const isFirstCourse = index === 0;
            const previousCourse = allCourses[index - 1];
            const previousCourseProgress = previousCourse ? 
                user.courseProgress.find(p => p.courseId.toString() === previousCourse._id.toString()) : null;
            const previousCourseCompleted = previousCourseProgress ? previousCourseProgress.completed : false;

            // Course is unlocked if:
            // 1. It's the first course, OR
            // 2. The previous course is completed, OR
            // 3. It's a premium course, OR
            // 4. It's explicitly marked as unlocked in user progress
            const shouldBeUnlocked = isFirstCourse || 
                                   previousCourseCompleted || 
                                   course.isPremium || 
                                   (userProgress && !userProgress.isLocked);

            // If there's user progress, use its lock status if it's unlocked
            // Otherwise, use the calculated lock status
            const isLocked = userProgress ? 
                (userProgress.isLocked && !shouldBeUnlocked) : 
                !shouldBeUnlocked;

            // Only include dictionary if course is unlocked
            const courseData = {
                ...course.toObject(),
                isLocked,
                progress: userProgress ? userProgress.progress : 0,
                completed: userProgress ? userProgress.completed : false,
                lastAccessed: userProgress ? userProgress.lastAccessed : null
            };

            if (isLocked) {
                delete courseData.dictionary;
            }

            return courseData;
        });

        res.status(200).json(coursesWithStatus);
    } catch (err) {
        console.error('Error getting user courses:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update user's course progress
router.post('/user/:userId/progress', async (req, res) => {
    try {
        const { userId } = req.params;
        const { courseId, progress, completed } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const allCourses = await Course.find().sort({ createdAt: 1 });
        const currentCourseIndex = allCourses.findIndex(c => c._id.toString() === courseId);

        // Find or create course progress entry
        let courseProgress = user.courseProgress.find(p => p.courseId.toString() === courseId);
        if (!courseProgress) {
            // Determine if course should be unlocked
            const isFirstCourse = currentCourseIndex === 0;
            const previousCourse = allCourses[currentCourseIndex - 1];
            const previousCourseProgress = previousCourse ? 
                user.courseProgress.find(p => p.courseId.toString() === previousCourse._id.toString()) : null;
            const previousCourseCompleted = previousCourseProgress ? previousCourseProgress.completed : false;

            // Course is unlocked if:
            // 1. It's the first course, OR
            // 2. The previous course is completed
            const isLocked = !(isFirstCourse || previousCourseCompleted);

            user.courseProgress.push({
                courseId: courseId,
                isLocked: isLocked,
                progress: 0,
                completed: false,
                lastAccessed: new Date()
            });
            courseProgress = user.courseProgress[user.courseProgress.length - 1];
        }

        // Update progress
        courseProgress.progress = progress;
        courseProgress.completed = completed;
        courseProgress.lastAccessed = new Date();

        await user.save();
        res.status(200).json({ message: 'Progress updated successfully', user });
    } catch (err) {
        console.error('Error updating course progress:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;

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
                isLocked: true,
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
            
            if (currentCourseIndex !== -1 && currentCourseIndex < allCourses.length - 1) {
                // Get the next course
                const nextCourse = allCourses[currentCourseIndex + 1];
                
                // Check if the next course is already in user's progress
                const nextCourseProgress = user.courseProgress.find(p => p.courseId.toString() === nextCourse._id.toString());
                
                if (!nextCourseProgress) {
                    // Add the next course to user's progress if it doesn't exist
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
        }

        // Update progress regardless of completion status
        courseProgress.progress = progress;
        courseProgress.completed = completed;
        courseProgress.lastAccessed = new Date();

        // Save user with all updates at once
        await user.save();

        res.status(200).json({ 
            message: `Course '${course.name}' completed!`, 
            course,
            isPassed,
            progress: courseProgress,
            streakMessage,
            shouldShowNotification
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
            Course.find().populate('exercises')
        ]);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Map courses with user-specific status
        const coursesWithStatus = allCourses.map(course => {
            // Find user's progress for this course
            const userProgress = user.courseProgress.find(
                progress => progress.courseId.toString() === course._id.toString()
            );

            // If there's user progress, use its lock status
            // If no progress entry exists, check if it's the first course
            const isFirstCourse = course._id.toString() === allCourses[0]._id.toString();
            const isLocked = userProgress ? userProgress.isLocked : !isFirstCourse;

            return {
                ...course.toObject(),
                isLocked,
                progress: userProgress ? userProgress.progress : 0,
                completed: userProgress ? userProgress.completed : false,
                lastAccessed: userProgress ? userProgress.lastAccessed : null
            };
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

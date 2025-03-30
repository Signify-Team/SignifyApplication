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

const router = express.Router();

// rate limiter 
const courseLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
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
        const course = await Course.findById(req.params.id).populate('exercises');
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
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json({ message: `Course '${course.name}' completed!`, course });
    } catch (err) {
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

        console.log('User courseProgress:', JSON.stringify(user.courseProgress, null, 2));
        
        // Map courses with user-specific status
        const coursesWithStatus = allCourses.map(course => {
            // Find user's progress for this course
            const userProgress = user.courseProgress.find(
                progress => progress.courseId === course._id.toString()
            );
            
            console.log(`\nProcessing course ${course.name} (${course._id}):`);
            console.log('User progress found:', userProgress);
            
            // Check if this is the first course in its section
            const isFirstInSection = !allCourses.find(c => 
                c.language === course.language && 
                c.sectionId === course.sectionId && 
                c._id.toString() < course._id.toString()
            );

            // Determine lock status:
            // 1. If user has progress entry, use that status
            // 2. If no progress entry but it's first in section, unlock it
            // 3. Otherwise, lock it
            let isLocked = true;
            if (userProgress) {
                isLocked = userProgress.isLocked;
                console.log('Using user progress lock status:', isLocked);
            } else if (isFirstInSection) {
                isLocked = false;
                console.log('First course in section - unlocking');
                // Create progress entry for first course in section
                user.courseProgress.push({
                    courseId: course._id.toString(),
                    isLocked: false,
                    progress: 0,
                    completed: false,
                    lastAccessed: new Date(),
                    unlockDate: new Date()
                });
            } else {
                console.log('No user progress and not first in section - keeping locked');
            }

            const result = {
                ...course.toObject(),
                isLocked,
                progress: userProgress ? userProgress.progress : 0,
                completed: userProgress ? userProgress.completed : false,
                lastAccessed: userProgress ? userProgress.lastAccessed : null
            };

            console.log('Final course status:', {
                courseId: course._id,
                name: course.name,
                sectionId: course.sectionId,
                isLocked: result.isLocked,
                hasUserProgress: !!userProgress
            });

            return result;
        });

        // Save user if we added any new course progress entries
        await user.save();

        // Sort courses by language, level, and courseId
        coursesWithStatus.sort((a, b) => {
            if (a.language !== b.language) return a.language.localeCompare(b.language);
            if (a.sectionId !== b.sectionId) return a.sectionId.localeCompare(b.sectionId);
            return a._id.toString().localeCompare(b._id.toString());
        });

        res.status(200).json(coursesWithStatus);
    } catch (err) {
        console.error('Error in /user/:userId route:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update user's course progress
router.post('/user/:userId/progress', async (req, res) => {
    try {
        const { userId } = req.params;
        const { courseId, progress, completed } = req.body;
        
        console.log('Updating progress for:', { userId, courseId, progress, completed });
        
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Find course by MongoDB _id
        const course = await Course.findById(courseId);
        console.log('Found course:', course);
        
        if (!course) {
            console.log('Course not found with _id:', courseId);
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find or create course progress entry using MongoDB _id
        let courseProgress = user.courseProgress.find(p => p.courseId === courseId);
        if (!courseProgress) {
            console.log('Creating new course progress entry');
            // Check if this is the first course in its section
            const isFirstInSection = !(await Course.findOne({ 
                language: course.language,
                sectionId: course.sectionId,
                _id: { $lt: course._id }
            }));

            user.courseProgress.push({
                courseId: courseId,
                isLocked: !isFirstInSection,
                progress: 0,
                completed: false,
                lastAccessed: new Date(),
                unlockDate: new Date()
            });
            courseProgress = user.courseProgress[user.courseProgress.length - 1];
        }

        // Update progress
        courseProgress.progress = progress;
        courseProgress.completed = completed;
        courseProgress.lastAccessed = new Date();

        // If course is completed, unlock the next course in the same section
        if (completed) {
            const nextCourse = await Course.findOne({ 
                language: course.language,
                sectionId: course.sectionId,
                _id: { $gt: course._id }
            }).sort({ _id: 1 });
            
            if (nextCourse) {
                let nextProgress = user.courseProgress.find(p => p.courseId === nextCourse._id.toString());
                if (nextProgress) {
                    nextProgress.isLocked = false;
                } else {
                    user.courseProgress.push({
                        courseId: nextCourse._id.toString(),
                        isLocked: false,
                        progress: 0,
                        completed: false,
                        lastAccessed: new Date(),
                        unlockDate: new Date()
                    });
                }
            } else {
                // If no next course in current section, try to unlock first course of next section
                const nextSection = await Course.findOne({
                    language: course.language,
                    sectionId: { $gt: course.sectionId }
                }).sort({ sectionId: 1, _id: 1 });

                if (nextSection) {
                    let nextSectionProgress = user.courseProgress.find(p => p.courseId === nextSection._id.toString());
                    if (nextSectionProgress) {
                        nextSectionProgress.isLocked = false;
                    } else {
                        user.courseProgress.push({
                            courseId: nextSection._id.toString(),
                            isLocked: false,
                            progress: 0,
                            completed: false,
                            lastAccessed: new Date(),
                            unlockDate: new Date()
                        });
                    }
                }
            }
        }

        await user.save();
        res.status(200).json({ message: 'Progress updated successfully', user });
    } catch (err) {
        console.error('Error updating course progress:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;

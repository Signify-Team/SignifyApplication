/**
 * @file sectionRoutes.js
 * @description This file handles the section routes.
 *
 * @datecreated 20.02.2025
 * @lastmodified 20.02.2025
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import Section from '../models/SectionDB.js';
import mongoose from 'mongoose';

const router = express.Router();

// Rate limiter
const sectionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests. Please try again later.' },
    statusCode: 429,
});

router.use(sectionLimiter);

// Get sections by language
router.get('/language/:language', async (req, res) => {
    try {
        const { language } = req.params;
        
        // Validate language
        if (!['ASL', 'TID'].includes(language)) {
            return res.status(400).json({ error: 'Language must be either ASL or TID' });
        }
        
        const sections = await Section.find({ language })
            .sort({ sectionNumber: 1 })
            .populate('courses', 'courseId name description level totalLessons isPremium isLocked');
        res.json(sections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific section by ID
router.get('/:id', async (req, res) => {
    try {
        const section = await Section.findById(req.params.id)
            .populate('courses', 'courseId name description level totalLessons');
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json(section);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Add a course to an existing section
router.put('/:id/addCourse', async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const section = await Section.findById(req.params.id);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        if (section.courses.includes(courseId)) {
            return res.status(400).json({ error: 'Course already added to this section' });
        }

        section.courses.push(courseId);
        await section.save();
        res.json({ message: 'Course added successfully', section });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new section
router.post('/', async (req, res) => {
    try {
        const { sectionId, name, description, sectionNumber, courses, language } = req.body;

        // Validate required fields
        if (!sectionId || !name || !language) {
            return res.status(400).json({ error: 'Section ID, name, and language are required' });
        }

        // Validate language
        if (!['ASL', 'TID'].includes(language)) {
            return res.status(400).json({ error: 'Language must be either ASL or TID' });
        }

        // Check if section with same ID already exists
        const existingSection = await Section.findOne({ sectionId });
        if (existingSection) {
            return res.status(400).json({ error: 'Section with this ID already exists' });
        }

        // Validate course references if provided
        if (courses && courses.length > 0) {
            // Check if all course IDs are valid MongoDB ObjectIds
            if (!courses.every(courseId => mongoose.Types.ObjectId.isValid(courseId))) {
                return res.status(400).json({ error: 'Invalid course ID format' });
            }

            // Check if all courses exist and match the section language
            const Course = mongoose.model('Course');
            const existingCourses = await Course.find({ _id: { $in: courses } });
            if (existingCourses.length !== courses.length) {
                return res.status(400).json({ error: 'One or more courses not found' });
            }

            // Verify all courses have matching language
            const mismatchedCourses = existingCourses.filter(course => course.language !== language);
            if (mismatchedCourses.length > 0) {
                return res.status(400).json({ error: 'All courses must have the same language as the section' });
            }
        }

        // Create new section
        const newSection = new Section({
            sectionId,
            name,
            description,
            language,
            sectionNumber: sectionNumber || 0,
            courses: courses || []
        });

        await newSection.save();
        
        // Populate the courses before sending response
        const populatedSection = await Section.findById(newSection._id)
            .populate('courses', 'courseId name description level totalLessons language');
            
        res.status(201).json(populatedSection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
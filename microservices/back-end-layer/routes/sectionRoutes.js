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

// Get all sections with their courses
router.get('/', async (req, res) => {
    try {
        const sections = await Section.find()
            .sort({ sectionNumber: 1 })
            .populate('courses', 'courseId name description level totalLessons');
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
        const { sectionId, name, description, sectionNumber, courses } = req.body;

        // Validate required fields
        if (!sectionId || !name) {
            return res.status(400).json({ error: 'Section ID and name are required' });
        }
        // Validate sectionId
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({ error: 'Invalid Section ID' });
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

            // Check if all courses exist
            const Course = mongoose.model('Course');
            const existingCourses = await Course.find({ _id: { $in: courses } });
            if (existingCourses.length !== courses.length) {
                return res.status(400).json({ error: 'One or more courses not found' });
            }
        }

        // Create new section
        const newSection = new Section({
            sectionId,
            name,
            description,
            sectionNumber: sectionNumber || 0,
            courses: courses || []
        });

        await newSection.save();
        
        // Populate the courses before sending response
        const populatedSection = await Section.findById(newSection._id)
            .populate('courses', 'courseId name description level totalLessons');
            
        res.status(201).json(populatedSection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
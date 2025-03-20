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
            .sort({ order: 1 })
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

export default router;
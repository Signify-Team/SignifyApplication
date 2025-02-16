/**
 * @file courseRoutes.js
 * @description This file handles the course routes.
 *
 * @datecreated 16.02.2025
 * @lastmodified 16.02.2025
 */

const express = require('express');
const router = express.Router();
const Course = require('../models/CourseDB');


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

module.exports = router;
/**
 * @file CourseDB.js
 * @description This file defines the Course model for MongoDB.
 *
 * @datecreated 13.12.2024
 * @lastmodified 13.12.2024
 */

const mongoose = require('mongoose');

// Course Schema
const CourseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true }, // Unique identifier for the course
    name: { type: String, required: true }, // Course name
    description: { type: String }, // Course description
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }], // List of exercises in the course
    dictionary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word' }], // Words associated with the course
    totalLessons: { type: Number, default: 0 }, // Total number of lessons
});

module.exports = mongoose.model('Course', CourseSchema);

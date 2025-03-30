/**
 * @file SectionDB.js
 * @description This file defines the Section model for MongoDB.
 *
 * @datecreated 20.02.2025
 * @lastmodified 20.02.2025
 */

import mongoose from 'mongoose';

// Section Schema
const SectionSchema = new mongoose.Schema({
    sectionId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    language: { type: String, enum: ['ASL', 'TID'], required: true }, // Language of the section
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    sectionNumber: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Ccompound index for language + sectionNumber to allow same section numbers across languages
SectionSchema.index({ language: 1, sectionNumber: 1 }, { unique: true });

// Index on language field for faster queries
SectionSchema.index({ language: 1 });

// Update the `updatedAt` field before saving
SectionSchema.pre('save', async function(next) {
    this.updatedAt = Date.now();

    // Validate course languages if courses are being modified
    if (this.isModified('courses')) {
        const Course = mongoose.model('Course');
        const courses = await Course.find({ _id: { $in: this.courses } });
        
        for (const course of courses) {
            if (course.language !== this.language) {
                throw new Error('All courses in a section must have the same language as the section');
            }
        }
    }
    next();
});

export default mongoose.model('Section', SectionSchema);
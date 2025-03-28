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
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    sectionNumber: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the `updatedAt` field before saving
SectionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Section', SectionSchema);
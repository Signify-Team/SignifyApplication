/**
 * @file User.js
 * @description This file defines the User model for MongoDB.
 *
 * @datecreated 04.12.2024
 * @lastmodified 06.12.2024
 */

const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'},
});

module.exports = mongoose.model('User', UserSchema);

/**
 * @file wordRoutes.test.js
 * @description Tests for wordRoutes API endpoints.
 *
 * @datecreated 16.02.2025
 * @lastmodified 16.02.2025
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const Word = require('../../models/WordDB');
const wordRoutes = require('../../routes/wordRoutes'); 

let app, mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    app = express();
    app.use(express.json());
    app.use('/api/word', wordRoutes);
    process.env.NODE_ENV = 'test';  // Ensure we're in test environment

});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Word.deleteMany(); // Clear the database after each test
});

// Test creating a new word (POST /)
describe('POST /api/word - Create a new word', () => {
    test('Should return 400 if videoUrl is not a valid URL', async () => {
        const wordData = {
            wordId: 'unique124',
            name: 'invalid URL word',
            videoUrl: 'not-a-valid-url',
            description: 'A word with an invalid videoUrl.'
        };

        const response = await request(app).post('/api/word').send(wordData);

        expect(response.statusCode).toBe(400); // Expect 400 status for invalid input
        expect(response.body.errors[0].msg).toBe('Invalid URL format'); // Check URL format validation error
    });

    test('Should return 400 if name is missing', async () => {
        const wordData = {
            wordId: 'unique125',
            videoUrl: 'https://example.com/video',
            description: 'A word with no name.'
        };

        const response = await request(app).post('/api/word').send(wordData);

        expect(response.statusCode).toBe(400); // Expect 400 due to missing name
        expect(response.body.errors).toHaveLength(1); // Expect one validation error
        expect(response.body.errors[0].msg).toBe('name is required'); // Check that the missing field error is for 'name'
    });

    test('Should return 400 if wordId is not a string', async () => {
        const wordData = {
            wordId: 12345, // Invalid wordId type (should be a string)
            name: 'invalid wordId type',
            videoUrl: 'https://example.com/video',
            description: 'A word with invalid wordId type.'
        };

        const response = await request(app).post('/api/word').send(wordData);

        expect(response.statusCode).toBe(400); // Expect 400 due to invalid wordId type
        expect(response.body.errors[0].msg).toBe('wordId must be a string'); // Check for wordId validation error
    });

    test('Should allow creation without description field', async () => {
        const wordData = {
            wordId: 'unique126',
            name: 'word without description',
            videoUrl: 'https://example.com/video'
        };

        const response = await request(app).post('/api/word').send(wordData);

        expect(response.statusCode).toBe(201); // Expect 201 (Created)
        expect(response.body).toHaveProperty('_id'); // Ensure the created word has an _id
        expect(response.body.name).toBe(wordData.name); // Check name is correct
        expect(response.body.videoUrl).toBe(wordData.videoUrl); // Check videoUrl is correct
        expect(response.body.description).toBeUndefined(); // Ensure description is undefined (optional field)
    });

    test('Should handle rate-limiting correctly', async () => {
        // First valid request
        const wordData = {
            wordId: 'unique127',
            name: 'rate-limited word',
            videoUrl: 'https://example.com/video',
            description: 'A word that will test rate-limiting.'
        };

        for (let i = 0; i < 101; i++) {
            const response = await request(app).post('/api/word').send(wordData);
    
            // The 101st request should return a 429 error (Too Many Requests)
            if (i === 100) {
                expect(response.statusCode).toBe(429);
                expect(response.body.error).toBe('Too many requests. Please try again later.');
            }
        }
    });
});

describe('DELETE /api/word/:id', () => {
    let wordId;

    beforeAll(async () => {
        // Create a word to delete later
        const wordData = {
            wordId: 'unique123',
            name: 'Test Word',
            videoUrl: 'https://example.com/video',
            description: 'Test description',
        };
        const word = await request(app).post('/api/word').send(wordData);

        console.log('Create response:', word.body);
        responseID = word.body._id; 
        console.log('Created wordId:', responseID);
    });

    test('Should delete the word successfully if it exists', async () => {
        const response = await request(app).delete(`/api/word/${responseID}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Word deleted successfully');

        // Verify the word has been deleted
        const checkResponse = await request(app).get(`/api/word/${responseID}`);
        expect(checkResponse.statusCode).toBe(404); // It should not be found anymore
    });

    test('Should return 400 if ID format is invalid', async () => {
        const response = await request(app).delete('/api/word/invalidid');
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid ID format');
    });

    test('Should return 404 if word is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Generate a non-existent ObjectId
        const response = await request(app).delete(`/api/word/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Word not found');
    });
});

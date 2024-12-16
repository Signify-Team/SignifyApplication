const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const User = require('../../models/UserDB');
const userRoutes = require('../../routes/userRoutes'); 

let app, mongoServer;

beforeAll(async () => {
    // Start an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Set up the Express app with the routes
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany(); // Clear the database after each test
});

describe('User Routes Tests', () => {
    test('POST /register - Register a new user', async () => {
        const response = await request(app).post('/api/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.user).toHaveProperty('_id');
    });

    test('POST /register - Do not allow duplicate email registration', async () => {
        await request(app).post('/api/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const response = await request(app).post('/api/users/register').send({
            username: 'testuser2',
            email: 'testuser@example.com',
            password: 'password456',
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Email is already registered');
    });

    test('POST /login - Successful login', async () => {
        await request(app).post('/api/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const response = await request(app).post('/api/users/login').send({
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Login successful');
    });

    test('POST /login - Invalid login credentials', async () => {
        await request(app).post('/api/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const response = await request(app).post('/api/users/login').send({
            email: 'testuser@example.com',
            password: 'wrongpassword',
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });

    test('GET /profile - Fetch user profile', async () => {
        const registerResponse = await request(app).post('/api/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const response = await request(app).get('/api/users/profile').query({
            userId: registerResponse.body.user._id,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('username', 'testuser');
    });

    test('PUT /update - Update user preferences', async () => {
        const registerResponse = await request(app).post('/api/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const response = await request(app).put('/api/users/update').send({
            userId: registerResponse.body.user._id,
            languagePreference: 'Spanish',
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.user).toHaveProperty('languagePreference', 'Spanish');
    });

    test('GET /test - Confirm the test route works', async () => {
        const response = await request(app).get('/api/users/test');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('User route is working!');
    });
});
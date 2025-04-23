/**
 * @file server.js
 * @description Main server file.
 *
 * @datecreated 02.12.2024
 * @lastmodified 06.12.2024
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import wordRoutes from './routes/wordRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import questRoutes from './routes/questRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Add headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Connect to MongoDB
connectDB();

// Default route
app.get('/', (req, res) => {
    console.log('GET /', { body: req.body });
    res.send('Backend is running!');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/word', wordRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/sections', sectionRoutes);

// Start the server
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
export default app;

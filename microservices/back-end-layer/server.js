/**
 * @file server.js
 * @description Main server file.
 *
 * @datecreated 02.12.2024
 * @lastmodified 06.12.2024
 */

import express from 'express'; // can no longer use require so changed all to import .. from ..
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

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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

// Start the server
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
export default app;

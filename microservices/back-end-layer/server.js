/**
 * @file server.js
 * @description Main server file.
 *
 * @datecreated 02.12.2024
 * @lastmodified 06.12.2024
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();


// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Default route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

const exerciseRoutes = require('./routes/exerciseRoutes')
app.use('/api/exercises', exerciseRoutes)

const wordRoutes = require('./routes/wordRoutes')
app.use('/api/word', wordRoutes)

const achievementRoutes = require('./routes/achievementRoutes')
app.use('/api/achievements', achievementRoutes)

const badgeRoutes = require('./routes/badgeRoutes')
app.use('/api/badges', badgeRoutes)

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

const questRoutes = require('./routes/questRoutes');
app.use('/api/quests', questRoutes);

module.exports = app;

// Start the server
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  }

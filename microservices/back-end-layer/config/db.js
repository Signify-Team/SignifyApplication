/**
 * @file db.js
 * @description Main database connection file.
 *
 * @datecreated 02.12.2024
 * @lastmodified 06.12.2024
 */

const mongoose = require('mongoose'); // MongoDB ORM

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // new URL string parser
            useUnifiedTopology: true, // new Server Discover and Monitoring engine
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // failure
    }
};

module.exports = connectDB;

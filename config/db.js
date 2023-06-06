// /config/db.js

const mongoose = require('mongoose');
const config = require('config');

/**
 * Establishes a connection to MongoDB using the provided configuration.
 * If the connection is successful, it logs a success message.
 * If an error occurs during the connection, it logs the error and exits the process.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true
        });
        console.log('MongoDB is Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Options for robust connection
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mini-event-platform', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4 // Force IPv4 if IPv6 is causing issues
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('Retrying connection in 5 seconds...');
        // Retry connection instead of exiting
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;

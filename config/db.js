/**
 * MongoDB Atlas Connection Config for Riyad Store API
 */

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI || mongoURI.includes('username:password')) {
    console.log('ℹ️ MONGODB_URI not configured in .env. Running Riyad Store API in memory-fallback mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️ API falling back to internal high-performance store mode.');
    return false;
  }
};

const getDBStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    connectionState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'Disconnected'
  };
};

module.exports = {
  connectDB,
  getDBStatus,
};

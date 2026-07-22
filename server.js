/**
 * Server Entry Point for Riyad Store API
 * Boots MongoDB connection and listens on configured PORT
 */

require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

async function startServer() {
  // Connect to MongoDB Atlas (or initialize fallback mode)
  await connectDB();

  const server = app.listen(PORT, HOST, () => {
    console.log(`
🚀 ===================================================
   Riyad Store API - Server Online!
   Port: ${PORT}
   Env: ${process.env.NODE_ENV || 'development'}
   Endpoints:
   - GET  http://localhost:${PORT}/api/store/list
   - GET  http://localhost:${PORT}/api/store/search?q=
   - GET  http://localhost:${PORT}/api/store/info/:id
   - GET  http://localhost:${PORT}/api/store/raw/:id
   - POST http://localhost:${PORT}/api/store/upload
   - PUT  http://localhost:${PORT}/api/store/update/:id
   - DELETE http://localhost:${PORT}/api/store/delete/:id
   - POST http://localhost:${PORT}/api/store/like/:id
   - POST http://localhost:${PORT}/api/store/download/:id
=================================================== 🚀
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated.');
    });
  });
}

startServer();

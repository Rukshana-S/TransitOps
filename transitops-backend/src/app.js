import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import { initDatabase } from './config/initDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for dev/hackathon simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger
app.use(morgan('dev'));

// Mount API router
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Start server after database initialization
const startServer = async () => {
  try {
    // Run schema migrations and seeds if not already initialized
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 TransitOps Server is running on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error.message);
    process.exit(1);
  }
};

startServer();

import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import caseRoutes from './routes/caseRoutes';
import { initNotificationJob } from './services/notificationService';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);


// Database Connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    initNotificationJob();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Legal System API is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
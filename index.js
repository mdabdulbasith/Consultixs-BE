import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import verifyToken from './middleware/verifyToken.js'; // ✅ renamed to match the file name you shared

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Public route: login
app.use('/api/login', authRoutes);

app.use('/api/contact', contactRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import syncToZohoRoute from './routes/syncToZoho.js';
app.use(syncToZohoRoute);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(syncToZohoRoute);

// Routes
app.use('/api/login', authRoutes);       // public
app.use('/api/contact', contactRoutes);  // selectively protected inside contact.js

// Connect to MongoDB and start the server
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

// Add this route in your Express backend
app.get("/oauth/callback", (req, res) => {
  const { code } = req.query;

  if (code) {
    console.log("✅ Zoho Authorization Code received:", code);
    res.send("Authorization code received successfully. Check your backend logs.");
  } else {
    res.send("Authorization code not found.");
  }
});


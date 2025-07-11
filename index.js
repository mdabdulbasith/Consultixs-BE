import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import syncToZohoRoute from './routes/syncToZoho.js';
import chatbotRoutes from './routes/chatbot.js';

dotenv.config();

const app = express();

// ✅ Proper CORS setup for Vercel frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://consultixs-ui.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Middleware
app.use(express.json());
app.use(syncToZohoRoute);

// Routes
app.use('/api/login', authRoutes);       // public
app.use('/api/contact', contactRoutes);  // selectively protected inside contact.js
app.use('/api/chat', chatbotRoutes);

// MongoDB connection
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

// OAuth Route
app.get("/oauth/callback", (req, res) => {
  const { code } = req.query;

  if (code) {
    console.log("✅ Zoho Authorization Code received:", code);
    res.send("Authorization code received successfully. Check your backend logs.");
  } else {
    res.send("Authorization code not found.");
  }
});

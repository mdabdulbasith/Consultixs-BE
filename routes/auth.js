import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'consultixs-secret';

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);

  try {
    const admin = await Admin.findOne({ username });
    console.log('Admin from DB:', admin);

    if (!admin) {
      return res.status(401).json({ error: 'No admin found with that username' });
    }

    if (admin.password !== password) {
      console.log('Password mismatch. Expected:', admin.password, 'Received:', password);
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful. Token:', token);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;

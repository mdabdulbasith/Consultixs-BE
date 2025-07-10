import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'consultixs-secret';

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

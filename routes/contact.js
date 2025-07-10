import express from 'express';
import Contact from '../models/Contact.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Public: submit contact form (no auth)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact saved' });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

// Protected: get all contacts (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});


// contact.js
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});


export default router;

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Contact from '../models/Contact.js';
import verifyToken from '../middleware/verifyToken.js';
import { getAccessToken } from '../utils/zohoAuth.js'; // 🔁 auto-refresh logic

dotenv.config();

const router = express.Router();

// 🔓 Public: Submit contact form and sync to Zoho in background
router.post('/', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    // 1. Save to MongoDB
    const newContact = new Contact({ name, email, message, phone });
    await newContact.save();

    // ✅ Immediately respond to frontend
    res.status(201).json({ message: 'Contact saved' });

    // 2. Background sync to Zoho
    const accessToken = await getAccessToken();
    const payload = {
      data: [
        {
          Company: "Consultixs",
          Last_Name: name || "Unknown",
          Email: email,
          Phone: phone,
          Description: message || "",
          Lead_Source: "Website Form"
        }
      ]
    };

    axios.post('https://www.zohoapis.in/crm/v2/Leads', payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => console.log('✅ Synced to Zoho:', response.data))
      .catch(error => console.error('❌ Zoho Sync Failed:', error.response?.data || error.message));

  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

// 🔒 Admin: View all contacts
router.get('/', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// 🔒 Admin: Delete a contact
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

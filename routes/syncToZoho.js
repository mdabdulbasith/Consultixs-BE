import express from 'express';
import axios from 'axios';
import Contact from '../models/Contact.js'; // adjust path if needed

const router = express.Router();

const ZOHO_ACCESS_TOKEN = 'your_actual_access_token_here';

router.get('/sync-to-zoho', async (req, res) => {
  try {
    const contacts = await Contact.find();

    for (const contact of contacts) {
      const payload = {
        data: [
          {
            Company: "Consultixs",
            Last_Name: contact.name || "Unknown",
            Email: contact.email,
            Phone: contact.phone,
            Description: contact.message || "",
            Lead_Source: "MongoDB Sync"
          }
        ]
      };

      const response = await axios.post(
        'https://www.zohoapis.in/crm/v2/Leads',
        payload,
        {
          headers: {
            Authorization: `Bearer ${ZOHO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Synced: ${contact.email}`);
    }

    res.json({ success: true, message: 'Contacts synced to Zoho CRM' });
  } catch (error) {
    console.error('❌ Error syncing:', error.response?.data || error.message);
    res.status(500).json({ error: 'Sync failed' });
  }
});

export default router;

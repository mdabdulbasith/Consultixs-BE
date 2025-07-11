const express = require('express');
const router = express.Router();
const axios = require('axios');
const Contact = require('../models/Contact'); // adjust this path if needed

const ZOHO_ACCESS_TOKEN = 'your_access_token_here'; // paste your token or use dotenv

router.get('/sync-to-zoho', async (req, res) => {
  try {
    const contacts = await Contact.find(); // all contact form entries

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
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Sent lead: ${contact.email}`);
    }

    res.json({ success: true, message: 'All contacts synced to Zoho CRM successfully' });
  } catch (err) {
    console.error('❌ Zoho sync failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to sync leads' });
  }
});

module.exports = router;

import express from 'express';
import axios from 'axios';
import Contact from '../models/Contact.js';
import { getAccessToken } from '../utils/zohoAuth.js'; // 🔁 NEW: auto-refresh logic

const router = express.Router();

router.get('/sync-to-zoho', async (req, res) => {
    try {
        const contacts = await Contact.find();

        if (contacts.length === 0) {
            return res.json({ success: false, message: 'No contacts found in database' });
        }

        const accessToken = await getAccessToken(); // 🔁 Auto-refresh if needed

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
                        Authorization: `Bearer ${accessToken}`, // 🔁 Updated
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(`✅ Synced: ${contact.email}`, response.data);
        }

        res.json({ success: true, message: 'Contacts synced to Zoho CRM' });
    } catch (error) {
        const errMsg = error.response?.data || error.message;
        console.error('❌ Zoho Sync Error:', errMsg);
        res.status(500).json({ error: errMsg });
    }
});

export default router;

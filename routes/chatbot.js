import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const router = express.Router();

// Initialize OpenAI SDK
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Load from .env
});

router.post('/', async (req, res) => {
    const userMessage = req.body.message;

    const systemPrompt = `
You are a helpful assistant for Consultixs, a company that offers AI consulting, web & mobile development, cloud solutions, digital marketing, and more. Answer questions clearly and helpfully based on this context. COnsultixs office is in India, Silicon valley and orange county.
`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // or gpt-3.5-turbo if needed
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
        });

        const reply = completion.choices[0].message.content.trim();
        res.json({ reply });
    } catch (err) {
        console.error('OpenAI Error:', err);
        res.status(500).json({ error: 'Failed to fetch reply from GPT' });
    }
});

export default router;

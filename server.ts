import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Load menu items helper
function getMenu(): any[] {
  try {
    const menuPath = path.join(process.cwd(), 'menu.json');
    if (fs.existsSync(menuPath)) {
      const data = fs.readFileSync(menuPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read menu.json:', err);
  }
  return [];
}

// API Routes
app.get('/api/menu', (_req, res) => {
  const menu = getMenu();
  res.json(menu);
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    const menu = getMenu();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Intelligent fallback when GEMINI_API_KEY is not set
      const lower = message.toLowerCase();
      let matched = menu.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(lower);
        const descMatch = item.description.toLowerCase().includes(lower);
        const tagMatch = item.tags.some((t: string) => lower.includes(t.toLowerCase()));
        return nameMatch || descMatch || tagMatch;
      });

      if (lower.includes('dairy-free') || lower.includes('dairy free') || lower.includes('vegan')) {
        matched = menu.filter(item => item.tags.includes('dairy-free') || item.tags.includes('vegan') || !item.allergens.includes('dairy'));
      } else if (lower.includes('cold') || lower.includes('iced')) {
        matched = menu.filter(item => item.tags.includes('cold'));
      } else if (lower.includes('sweet')) {
        matched = menu.filter(item => item.tags.includes('sweet'));
      } else if (lower.includes('strong') || lower.includes('espresso') || lower.includes('coffee')) {
        matched = menu.filter(item => item.tags.includes('strong'));
      } else if (lower.includes('pastry') || lower.includes('bakery') || lower.includes('food')) {
        matched = menu.filter(item => item.tags.includes('bakery'));
      }

      if (matched.length > 0) {
        const itemNames = matched.map(i => `**${i.name}** ($${i.price.toFixed(2)}) - ${i.description}`).join('\n- ');
        return res.json({
          reply: `Welcome to ☕ Coffee Shop! Based on your request, here are great options from our menu:\n\n- ${itemNames}\n\n*(Note: Add your GEMINI_API_KEY in environment variables to unlock dynamic AI conversation.)*`,
          suggestedItems: matched
        });
      }

      return res.json({
        reply: "Welcome to ☕ Coffee Shop! I'm your AI Barista. Would you prefer a hot coffee, a refreshing cold brew, or a bakery item today? Let me know your preferences!",
        suggestedItems: []
      });
    }

    // Initialize Gemini AI SDK
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are a friendly barista at ☕ Coffee Shop.
Your job is to recommend drinks and pastries to customers based on their preferences.

Rules you MUST follow:
1. You must recommend items ONLY from the menu provided below.
2. Do NOT recommend or suggest any item that is not present in the menu.
3. If a user's preference is vague or unclear, ask exactly ONE friendly clarifying question to narrow down what they want (e.g., cold or hot, sweet or strong, coffee or pastry).
4. Be warm and welcoming, but remain professional.
5. Ground your recommendations in the actual tags, descriptions, and allergens listed in the menu (e.g., if a user is dairy-free, recommend ONLY items tagged 'dairy-free' or with no dairy allergens).

CURRENT MENU:
${JSON.stringify(menu, null, 2)}`;

    const formattedContents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role && item.text) {
          formattedContents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }]
          });
        }
      }
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const responseText = response.text || "I'm happy to help you pick a delicious drink or pastry from our menu!";

    const recommended = menu.filter(item =>
      responseText.toLowerCase().includes(item.name.toLowerCase())
    );

    res.json({
      reply: responseText,
      suggestedItems: recommended
    });

  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Error processing request' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`☕ AI Barista Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

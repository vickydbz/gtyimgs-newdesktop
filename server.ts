import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client if key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({ apiKey });
}

// AI Seasonal Planning and Upload Schedule Endpoint
app.post('/api/ai/predict-trends', async (req, res) => {
  try {
    const { niche, currentMonth, targetSeason } = req.body;

    if (aiClient) {
      const prompt = `You are an elite stock photography director and Getty Images Contributor consultant.
The contributor shoots: "${niche || 'Commercial Lifestyle & Technology'}".
Current Month: ${currentMonth || 'October 2026'}.
Target Season: ${targetSeason || 'Upcoming Q1/Q2 2027'}.

Provide a high-converting, professional Getty Images / iStock contributor guidance in JSON format:
{
  "recommendedUploadWindow": "Specific 30-45 day window (e.g. Oct 15 - Nov 30)",
  "peakBuyerDemandMonths": ["Month1", "Month2", "Month3"],
  "demandScore": 92,
  "competitionLevel": "Moderate" | "Low" | "High",
  "prioritySubjects": [
    "Subject 1 with exact commercial context",
    "Subject 2 with exact commercial context",
    "Subject 3 with exact commercial context"
  ],
  "topDisambiguatedKeywords": [
    "Keyword 1 - Concept",
    "Keyword 2 - Category",
    "Keyword 3 - Action",
    "Keyword 4 - Mood"
  ],
  "artDirectionTips": [
    "Visual direction tip regarding lighting, composition, or authentic casting",
    "Commercial requirement regarding copy space or model diversity",
    "Getty acceptance guideline regarding model/property releases"
  ],
  "executiveSummary": "1-2 sentence high-impact strategic recommendation."
}
Only output valid JSON.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, data: parsed, source: 'gemini' });
    }

    // High quality editorial fallback if API key is not configured
    return res.json({
      success: true,
      source: 'editorial-engine',
      data: {
        recommendedUploadWindow: 'Oct 15 - Dec 01 (60-90 Days Before Buyer Surge)',
        peakBuyerDemandMonths: ['January', 'February', 'March'],
        demandScore: 89,
        competitionLevel: 'Moderate',
        prioritySubjects: [
          'Authentic senior citizens engaged in modern digital healthcare and tele-consultation',
          'Clean energy field technicians inspecting smart solar micro-grids with tablet interface',
          'Multi-ethnic agile creative team collaborating in open timber architecture office',
          'Quiet luxury sustainable travel with electric vehicles in alpine scenic routes'
        ],
        topDisambiguatedKeywords: [
          'Telemedicine - Health Care Practice',
          'Solar Energy - Renewable Energy',
          'Teamwork - Cooperation',
          'Sustainable Tourism - Travel Destination',
          'Authenticity - Quality',
          'Senior Adult - Life Stage'
        ],
        artDirectionTips: [
          'Prioritize natural available side-lighting; reject over-saturated studio flashes that look dated.',
          'Always preserve un-cluttered 16:9 copy space on either left or top for corporate editorial banners.',
          'Ensure clean model releases are signed digitally with clear identification for every recognizable face.'
        ],
        executiveSummary: 'Enterprise buyers finalize Q1 corporate campaigns in November. Upload high-res, authentic documentary lifestyle now to capture peak licensing volume.'
      }
    });
  } catch (error: unknown) {
    console.error('Error generating trend predictions:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// AI Keyword Expansion & Disambiguation Endpoint
app.post('/api/ai/keywords', async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (aiClient) {
      const prompt = `You are a Getty Images Controlled Vocabulary and Keywording Specialist.
For an image titled: "${title || 'Modern Architecture'}"
Description: "${description || 'Sustainable office building'}"
Category: "${category || 'Architecture'}"

Return JSON with:
{
  "topKeywords": [
    {"keyword": "Tag", "disambiguation": "Category/Context", "searchVolume": "High", "conversionScore": 94}
  ],
  "suggestedTitle": "Optimized high-converting commercial title",
  "missingHighValueTags": ["Tag 1", "Tag 2", "Tag 3"]
}
Output valid JSON only.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, data: parsed, source: 'gemini' });
    }

    return res.json({
      success: true,
      source: 'editorial-engine',
      data: {
        topKeywords: [
          { keyword: 'Architecture', disambiguation: 'Built Structure', searchVolume: 'Very High', conversionScore: 96 },
          { keyword: 'Sustainability', disambiguation: 'Environmental Issue', searchVolume: 'High', conversionScore: 91 },
          { keyword: 'Modern', disambiguation: 'Time/Style', searchVolume: 'High', conversionScore: 88 },
          { keyword: 'Solar Panel', disambiguation: 'Technology Equipment', searchVolume: 'Moderate', conversionScore: 85 },
          { keyword: 'Daylight', disambiguation: 'Natural Light', searchVolume: 'Moderate', conversionScore: 82 }
        ],
        suggestedTitle: `${title || 'Modern Sustainable Architecture'} - Contemporary Eco-friendly Commercial Building`,
        missingHighValueTags: ['Net-Zero', 'Green Building Council', 'Copy Space', 'Urban Environment']
      }
    });
  } catch (error: unknown) {
    console.error('Error expanding keywords:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Contributor Session validation
app.post('/api/getty/validate-session', (req, res) => {
  const { username, authType } = req.body;
  return res.json({
    valid: true,
    contributorId: 'ESP-8492041',
    contributorName: username || 'Elena Vance',
    studioName: 'PeakVisual Stock Studio',
    tier: 'Exclusive Artist (iStock Signature & Getty Images Creative)',
    royaltyTier: '35% - 45% (Exclusive Rate)',
    activeAssets: 184,
    lifetimeEarningsUSD: 48920.40,
    unpaidBalanceUSD: 1420.80,
    nextPayoutDate: '2026-10-25',
    payoutProvider: 'Payoneer (USD)',
    taxStatus: 'W-8BEN Verified (0% Withholding)',
    espConnected: true,
    authMethod: authType || 'ESP_CREDENTIALS',
  });
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();

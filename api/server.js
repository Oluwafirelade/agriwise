import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.VITE_HUGGINGFACE_API_KEY;
const HF_API_URL = "https://api-inference.huggingface.co/models";
const AGRICULTURAL_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

// System prompts for different languages
function getSystemPrompt(language) {
  const prompts = {
    en: "You are an experienced agricultural advisor helping Nigerian farmers. Provide practical, actionable farming advice based on the farmer's question. Keep responses concise (2-3 sentences) and focus on solutions.",
    ha: "Ka kasua mai kwarewa ga manoma Nijeriya. Ba da shawarwari da ke da amfani kan bukatun manoma. Jika amsa da karfi kuma miyi mayar da hankali wa mafita.",
    yo: "O jẹ olupin ogbin ati ero ewe ti o rotininu ara awọn olofin Nigeria. Fún ọ pẹlú ìmọ̀ ti ó ta lọ́wọ́ àti àbájáde tí ó ṣiṣẹ́.",
    ig: "Ị bụ ụmụ okike ndị ọrụ ugbo na-ahụ mma na ndị ọrụ ugbo nọ na Naịjịrịa. Nyere ihe ọmụma dị mfe na ihe o kwesiri ịme."
  };
  return prompts[language] || prompts.en;
}

// Fallback responses
function getFallbackResponse(userQuery, language) {
  const queryLower = userQuery.toLowerCase();
  
  const responses = {
    en: {
      yellowing: "Yellowing leaves usually indicate nutrient deficiency (Nitrogen) or improper watering. Apply balanced fertilizer and ensure proper drainage.",
      disease: "For plant diseases, identify the symptoms first. Remove affected parts, apply fungicide if needed, improve air circulation, and practice crop rotation.",
      pest: "For pest control, use organic methods: neem oil spray, companion planting, or handpicking. Chemical pesticides should be a last resort.",
      watering: "Water deeply but less frequently to encourage deep root growth. Water in the morning to reduce disease. Check soil moisture before watering.",
      fertilizer: "Use balanced NPK fertilizer (10-10-10) for general crops. Adjust based on crop type: more Nitrogen for leafy crops, more Phosphorus for flowering.",
      planting: "Prepare soil with compost, ensure good drainage, plant at recommended depth and spacing, and keep soil moist for germination.",
      default: "For detailed advice, please describe the issue more specifically including crop type, symptoms, and current farming practices."
    }
  };

  const langResponses = responses[language] || responses.en;
  
  for (const [key, message] of Object.entries(langResponses)) {
    if (queryLower.includes(key)) {
      return message;
    }
  }
  
  return langResponses.default;
}

// API endpoint to get agricultural advice
app.post('/api/agricultural-advice', async (req, res) => {
  try {
    const { query, language } = req.body;

    if (!query || !language) {
      return res.status(400).json({ error: "Missing query or language" });
    }

    if (!HF_API_KEY) {
      console.error("Missing HF_API_KEY");
      return res.status(500).json({ 
        error: "API key not configured",
        response: getFallbackResponse(query, language)
      });
    }

    // Prepare the prompt
    const systemPrompt = getSystemPrompt(language);
    const prompt = `${systemPrompt}\n\nFarmer's Question: ${query}\n\nAgriculturalAdvisor:`;

    console.log(`Processing request: ${query.substring(0, 50)}...`);

    // Call Hugging Face API
    const response = await fetch(
      `${HF_API_URL}/${AGRICULTURAL_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
          wait_for_model: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("HF API Error:", errorData);
      
      // Return fallback response on API error
      return res.json({
        response: getFallbackResponse(query, language),
        fromFallback: true,
        error: errorData.error || response.statusText
      });
    }

    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error("Invalid response format:", data);
      return res.json({
        response: getFallbackResponse(query, language),
        fromFallback: true,
        error: "Invalid API response"
      });
    }

    // Extract and clean response
    let responseText = data[0].generated_text;
    
    // Remove the prompt from the response
    if (responseText.includes("AgriculturalAdvisor:")) {
      responseText = responseText.split("AgriculturalAdvisor:")[1].trim();
    }

    // Clean up artifacts
    responseText = responseText.replace(/\n\n+/g, "\n").trim();

    if (!responseText) {
      return res.json({
        response: getFallbackResponse(query, language),
        fromFallback: true
      });
    }

    res.json({ response: responseText });

  } catch (error) {
    console.error("Server Error:", error.message);
    const { query, language } = req.body;
    res.status(500).json({
      error: error.message,
      response: getFallbackResponse(query || "", language || "en"),
      fromFallback: true
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Agricultural API Server running on http://localhost:${PORT}`);
  console.log(`📌 API Key configured: ${HF_API_KEY ? '✓' : '✗'}`);
  console.log(`🌾 Model: ${AGRICULTURAL_MODEL}`);
});

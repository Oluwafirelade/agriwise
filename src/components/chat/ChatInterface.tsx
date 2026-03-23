const API_BASE_URL = "https://mrcahrles00-agriwise-backend.hf.space";

// Simple language detection based on common words

function detectLanguage(text: string): string {
  const lower = text.toLowerCase().trim();

  // Pidgin checked FIRST — must score higher than Yoruba to avoid confusion
  const pidginWords = [
    "dey", "don", "abeg", "wahala", "wetin", "sabi", "oga",
    "dem", "wey", "naim", "comot", "chop", "carry", "belle",
    "go fit", "no be", "na im", "how far", "e don"
  ];

  // Hausa unique words
  const hausaWords = [
    "ina", "yaushe", "yadda", "wane", "lokaci", "noma",
    "masara", "rogo", "kwari", "amfanin", "gona", "zuba",
    "taki", "dasa", "nuna", "karancin"
  ];

  // Yoruba unique words  
  const yorubaWords = [
    "ewe", "oko", "jẹ", "ṣe", "fún", "àti", "tí", "nígbà",
    "bawo", "kíni", "ogbin", "irugbin", "kokoro", "ilẹ",
    "agbado", "ẹfọ", "ọgbin"
  ];

  // Igbo unique words
  const igboWords = [
    "kedụ", "gịnị", "ọ bụ", "nke", "maka", "ugbo",
    "akwụkwọ", "ọka", "ihe", "ọrịa", "ahụhụ", "ala",
    "akpụ", "ji", "nri"
  ];

  // Score each language — multi-word phrases count double
  const scoreText = (words: string[]) =>
    words.reduce((acc, w) => acc + (lower.includes(w) ? (w.includes(" ") ? 2 : 1) : 0), 0);

  const scores = {
    pcm: scoreText(pidginWords),
    ha: scoreText(hausaWords),
    yo: scoreText(yorubaWords),
    ig: scoreText(igboWords),
  };

  const max = Math.max(...Object.values(scores));

  // Need at least 1 match to switch from English
  if (max >= 1) {
    return Object.keys(scores).find(
      k => scores[k as keyof typeof scores] === max
    ) || "en";
  }

  return "en";
}

export async function getAgriculturalAdvice(
  userQuery: string,
  language: string
): Promise<string> {
  // Auto-detect language if not explicitly set or if English is selected
  // but the text looks like another language
  
  const effectiveLang = detectedLang !== "en" ? detectedLang : language;

  try {
    const response = await fetch(`${API_BASE_URL}/api/agricultural-advice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userQuery,
        language: effectiveLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.response) {
      return data.response;
    }

    if (data.error) {
      throw new Error(data.error);
    }

    throw new Error("No response from API");
  } catch (error) {
    console.error("Agricultural Advice Error:", error);
    return getFallbackResponse(userQuery, effectiveLang);
  }
}

function getFallbackResponse(userQuery: string, language: string): string {
  const queryLower = userQuery.toLowerCase();

  const responses: Record<string, Record<string, string>> = {
    en: {
      yellowing: "Yellowing leaves usually indicate nutrient deficiency (Nitrogen) or improper watering. Apply balanced fertilizer and ensure proper drainage.",
      disease: "For plant diseases, identify the symptoms first. Remove affected parts, apply fungicide if needed, improve air circulation, and practice crop rotation.",
      pest: "For pest control, use organic methods: neem oil spray, companion planting, or handpicking.",
      default: "For detailed advice, please describe the issue more specifically including crop type, symptoms, and current farming practices.",
    },
    ha: {
      yellowing: "Rawaya ganye yakan nuna karancin abubuwan gida (Nitrogen). Zuba taki mai daidaitattun abubuwa.",
      default: "Don cikakken shawara, bayyana matsalar da kyau ciki har da nau'in amfanin gona da alamomi.",
    },
    yo: {
      yellowing: "Ewé tó di pupa jẹ ami ti aipe ounje (Nitrogen). Lo ajile tó ni iwontunwonsi.",
      default: "Fún ọ pẹlù ìmọ̀ tí ó tọ́, ẹ jọwọ ṣàpèjúwe ìṣòro náà ní ẹ̀tọ́.",
    },
    ig: {
      yellowing: "Akwụkwọ na-acha odo odo na-egosi enweghị nri. Tinye takin na hụ na mmiri ezi.",
      default: "Maka ozi zuru oke, kọọ nsogbu ahụ nke ọma gụnyere ụdị ihe ọkụkụ.",
    },
    pcm: {
      yellowing: "Wen leaves don turn yellow, e mean say di plant no get enough nitrogen. Apply fertilizer well well.",
      default: "Abeg describe di problem well well make we fit help you better.",
    },
  };

  const langResponses = responses[language] || responses.en;

  for (const [key, message] of Object.entries(langResponses)) {
    if (queryLower.includes(key)) {
      return message;
    }
  }

  return langResponses.default || responses.en.default;
}
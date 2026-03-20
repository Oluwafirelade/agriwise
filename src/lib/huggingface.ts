/**
 * Hugging Face API Service (via Backend Proxy)
 * Uses Node.js backend to call Hugging Face API
 * This solves CORS issues and keeps API key secure
 */
const API_BASE_URL = "https://mrcahrles00-agriwise-backend.hf.space";

export async function getAgriculturalAdvice(
  userQuery: string, 
  language: string
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agricultural-advice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: userQuery,
        language: language, // We still send this as a "hint"
      }),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    return data.response || "No response received.";
  } catch (error) {
    console.error("Agricultural Advice Error:", error);
    return "Sorry, I am having trouble connecting to the advisor. Please try again shortly.";
  }
}


/**
 * Fallback response when API fails
 */
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
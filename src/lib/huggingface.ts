/**
 * Hugging Face API Service (via Backend Proxy)
 * Uses Node.js backend to call Hugging Face API
 * This solves CORS issues and keeps API key secure
 */

const API_BASE_URL = "http://localhost:3001";

/**
 * Get agricultural advice from backend server
 */
export async function getAgriculturalAdvice(
  userQuery: string,
  language: string
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agricultural-advice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userQuery,
        language: language,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Return AI response or fallback
    if (data.response) {
      return data.response;
    }
    
    if (data.error) {
      throw new Error(data.error);
    }

    throw new Error("No response from API");
  } catch (error) {
    console.error("Agricultural Advice Error:", error);
    // Return fallback response
    return getFallbackResponse(userQuery, language);
  }
}


/**
 * Fallback response when API fails (keyword-based simple matching)
 */
function getFallbackResponse(userQuery: string, language: string): string {
  const queryLower = userQuery.toLowerCase();

  const responses: Record<string, Record<string, string>> = {
    en: {
      yellowing: "Yellowing leaves usually indicate nutrient deficiency (Nitrogen) or improper watering. Apply balanced fertilizer and ensure proper drainage.",
      disease: "For plant diseases, identify the symptoms first. Common solutions: Remove affected parts, apply fungicide, improve air circulation, and practice crop rotation.",
      pest: "For pest control, use organic methods when possible: neem oil spray, companion planting, or handpicking. Chemical pesticides should be a last resort.",
      watering: "Water deeply but less frequently to encourage deep root growth. Morning watering is best to reduce disease. Check soil moisture before watering.",
      fertilizer: "Use balanced NPK fertilizer (10-10-10) for general crops. Adjust based on crop type: more Nitrogen for leafy crops, more Phosphorus for flowering.",
      planting: "Prepare soil with compost, ensure good drainage, plant at recommended depth and spacing, and keep soil moist for germination.",
      default: "For detailed advice on your farming question, please describe the issue more specifically including crop type, symptoms, and current farming practices.",
    },
    ha: {
      yellowing: "Rawaya ganye yakan nuna karancin abubuwan gida (Nitrogen) ko ba aiki dishi. Zuba taki mai daidaituwa kuma tabbatar da kyakkyawan fikitarwa.",
      disease: "Don cutarren ganye, sannu da alamun aiki. Mafita: Cire waje marubuta, zuba mace, sa'a iskar kai, da musanya habaye.",
      default: "Don cikakken shawara akan bukatar noma, ka bayyana matsala kuma inganta nau'i na shuke, alamun aiki, da ayyuka na noma.",
    },
    yo: {
      yellowing: "Ewé tó di pupa jẹ́ ami ti aipe ounjẹ (Nitrogen) tabi omi ti ò̀ṣe lọ́ìlọ́. Lo ajile ti o ni iwọntunwọnsi àti rí dájú isọ daradara.",
      disease: "Nípasẹ̀ àìmọ̀ ọ̀ran ìsìn, ṣe àyẹ̀wò awọn aami. Iranlọ́wọ́: Mú ẹ̀kọ́ ìsìn, lo oogun, ṣe jìjìn afẹfẹ, àti ṣèdúpẹ́.",
      default: "Fún ìmọ̀ ni pẹlúpẹlú lórí ibeere noma rẹ, ṣalaye iṣoro àti ìrò irugbin, awọn aami, àti iṣẹ noma.",
    },
    ig: {
      yellowing: "Akwụkwọ akpụ na-acha odo odo na-egosi enweghị nri ma ọ bụ mmiri ezi. Tinye takin ma hụ na mmiri na-asọpụ nke ọma.",
      disease: "Maka ọrịa ihe ọkụkụ, mata ihe mgbaàmà nke ọma. Ihe ọ kwesiri ịme: Ewepụ akpụ ọrịa, tinyere ọgwụ, gbaa ikuku, na mezie ugbo.",
      default: "Maka iminye nke ziri ezi gbasara ajụjụ ugbo gị, kọwaa nsogbu na ụdị ihe ọkụkụ, ihe mgbaàmà, na ihe ị na-eme.",
    },
  };

  // Check for keywords in query
  for (const [key, message] of Object.entries(
    responses[language] || responses.en
  )) {
    if (queryLower.includes(key)) {
      return message;
    }
  }

  // Return default response if no keywords match
  return responses[language]?.default || responses.en.default;
}


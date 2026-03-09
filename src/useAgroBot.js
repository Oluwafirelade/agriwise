// hooks/useAgroBot.js
// Drop this file into your React+Vite project src/hooks/
// Usage: import useAgroBot from './hooks/useAgroBot'

import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function useAgroBot() {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // ── TEXT CHAT ──────────────────────────────────────────
  const sendMessage = async (message, language = "english", voiceResponse = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language,
          voice_response: voiceResponse,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }

      const data = await res.json();
      // data = { answer, detected_language, audio_url }

      return {
        answer: data.answer,
        language: data.detected_language,
        audioUrl: data.audio_url ? `${API_BASE}${data.audio_url}` : null,
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── VOICE CHAT ─────────────────────────────────────────
  const sendVoice = async (audioBlob, language = "english", voiceResponse = false) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", language);
      formData.append("voice_response", voiceResponse);

      const res = await fetch(
        `${API_BASE}/voice?language=${language}&voice_response=${voiceResponse}`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Voice processing error");
      }

      const data = await res.json();
      // data = { transcription, answer, detected_language, audio_url }

      return {
        transcription: data.transcription,
        answer: data.answer,
        language: data.detected_language,
        audioUrl: data.audio_url ? `${API_BASE}${data.audio_url}` : null,
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, sendVoice, loading, error };
}

"""
Nigerian AgroBot — FastAPI Backend
Connects to your React+Vite frontend via REST API

Endpoints:
  POST /chat       — text input → translated answer
  POST /voice      — audio file → transcribe → answer → TTS
  GET  /health     — health check

Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from transformers import pipeline
from deep_translator import GoogleTranslator
from gtts import gTTS
import whisper
import tempfile
import shutil
import os

app = FastAPI(title="Nigerian AgroBot API")

# ─────────────────────────────────────────────
# CORS — allows your React frontend to call this
# ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# LOAD MODELS (once at startup)
# ─────────────────────────────────────────────
print("Loading AgriQBot model...")
agri_pipe = pipeline("text2text-generation", model="mrSoul7766/AgriQBot")
print("AgriQBot loaded ✓")

print("Loading Whisper STT...")
whisper_model = whisper.load_model("tiny")
print("Whisper loaded ✓")

# ─────────────────────────────────────────────
# LANGUAGE CONFIG
# ─────────────────────────────────────────────
LANGUAGES = {
    "english":         {"code": "en", "tts": "en"},
    "hausa":           {"code": "ha", "tts": "ha"},
    "yoruba":          {"code": "yo", "tts": "yo"},
    "igbo":            {"code": "ig", "tts": "ig"},
    "nigerian pidgin": {"code": "en", "tts": "en"},
}

PIDGIN_SUFFIX = " (Reply in Nigerian Pidgin English using words like abeg, na, dem, wahala, shey.)"

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
def translate_to_english(text: str, lang_code: str) -> str:
    if lang_code == "en":
        return text
    try:
        return GoogleTranslator(source=lang_code, target="en").translate(text)
    except:
        return text

def translate_from_english(text: str, lang_code: str) -> str:
    if lang_code == "en":
        return text
    try:
        return GoogleTranslator(source="en", target=lang_code).translate(text)
    except:
        return text

def ask_agribot(question: str, is_pidgin: bool = False) -> str:
    prompt = f"Q: {question}"
    if is_pidgin:
        prompt += PIDGIN_SUFFIX
    try:
        result = agri_pipe(prompt, max_length=256)
        return result[0]["generated_text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model error: {e}")

def make_tts(text: str, tts_code: str) -> str:
    """Returns path to generated MP3 file."""
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    gTTS(text=text, lang=tts_code, slow=False).save(tmp.name)
    return tmp.name

# ─────────────────────────────────────────────
# REQUEST SCHEMAS
# ─────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    language: str = "english"   # english | hausa | yoruba | igbo | nigerian pidgin
    voice_response: bool = False

class ChatResponse(BaseModel):
    answer: str
    detected_language: str
    audio_url: str | None = None  # set if voice_response=True

# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "model": "mrSoul7766/AgriQBot"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    lang_key = req.language.lower()
    lang_cfg = LANGUAGES.get(lang_key, LANGUAGES["english"])
    lang_code = lang_cfg["code"]
    tts_code  = lang_cfg["tts"]
    is_pidgin = (lang_key == "nigerian pidgin")

    # 1. Translate input → English
    english_q = translate_to_english(req.message, lang_code)

    # 2. Get AgriQBot answer
    english_ans = ask_agribot(english_q, is_pidgin=is_pidgin)

    # 3. Translate answer → user language
    final_ans = translate_from_english(english_ans, lang_code)

    # 4. Optional TTS
    audio_url = None
    if req.voice_response:
        audio_path = make_tts(final_ans, tts_code)
        audio_url = f"/audio/{os.path.basename(audio_path)}"
        # store path for serving
        app.state.audio_files = getattr(app.state, "audio_files", {})
        app.state.audio_files[os.path.basename(audio_path)] = audio_path

    return ChatResponse(
        answer=final_ans,
        detected_language=req.language,
        audio_url=audio_url
    )


@app.post("/voice")
async def voice_chat(
    audio: UploadFile = File(...),
    language: str = "english",
    voice_response: bool = False
):
    """Accepts audio file, transcribes with Whisper, runs through chat pipeline."""

    # Save uploaded audio to temp file
    suffix = os.path.splitext(audio.filename)[-1] or ".webm"
    tmp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    with open(tmp_audio.name, "wb") as f:
        shutil.copyfileobj(audio.file, f)

    # Transcribe
    try:
        result = whisper_model.transcribe(tmp_audio.name)
        transcription = result["text"].strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {e}")
    finally:
        os.unlink(tmp_audio.name)

    if not transcription:
        raise HTTPException(status_code=400, detail="Could not transcribe audio.")

    # Run through text pipeline
    from pydantic import BaseModel as BM
    class _Req(BM):
        message: str
        language: str
        voice_response: bool

    response = chat(_Req(message=transcription, language=language, voice_response=voice_response))
    return {
        "transcription": transcription,
        "answer": response.answer,
        "detected_language": response.detected_language,
        "audio_url": response.audio_url,
    }


@app.get("/audio/{filename}")
def serve_audio(filename: str):
    """Serve generated TTS audio files."""
    audio_files = getattr(app.state, "audio_files", {})
    path = audio_files.get(filename)
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Audio not found")
    return FileResponse(path, media_type="audio/mpeg")

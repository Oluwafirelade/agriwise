# Hugging Face AI Integration Setup Guide

## ✅ Implementation Complete

Your AgriAdvisor app now uses **Hugging Face API** for dynamic, agriculture-focused AI responses. This replaces the hardcoded mock responses with real AI-powered advice.

---

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Hugging Face API Key
1. Go to [Hugging Face](https://huggingface.co)
2. Sign up or log in
3. Click your profile → Settings → [Access Tokens](https://huggingface.co/settings/tokens)
4. Click "New token"
5. Name: `agriwise` (or any name)
6. Permission: `read`
7. Copy the token

### Step 2: Add API Key to Project
1. Create a `.env.local` file in the project root (if it doesn't exist):
   ```bash
   touch .env.local
   ```

2. Add this line to `.env.local`:
   ```
   VITE_HUGGINGFACE_API_KEY=your_token_here
   ```
   Replace `your_token_here` with your actual API key from Step 1

3. **Important**: Never commit `.env.local` to Git (it's in `.gitignore`)

### Step 3: Restart Dev Server
```bash
npm run dev
```

---

## ✨ Features Implemented

### 1. **Dynamic AI Responses**
- ✅ Different response for each unique question
- ✅ Context-aware agricultural advice
- ✅ Uses Hugging Face Inference API

### 2. **Multilingual Support**
- ✅ English (en-US)
- ✅ Hausa (ha-NG)
- ✅ Yoruba (yo-NG)
- ✅ Igbo (ig-NG)

### 3. **Voice to Text**
- ✅ Press mic button to speak
- ✅ Real-time transcript display
- ✅ Automatic text input population
- ✅ Language-specific speech recognition

### 4. **Error Handling**
- ✅ API errors display in chat
- ✅ Fallback keyword-based responses when API fails
- ✅ Microphone permission handling
- ✅ Network error messages

---

## 📁 Files Modified/Created

### New Files:
- `src/lib/huggingface.ts` - API service with fallback responses
- `.env.example` - Environment variables template

### Modified Files:
- `src/components/ChatInterface.tsx` - Integrated Hugging Face API + Voice Recognition

---

## 🔄 How It Works

```
User Types/Speaks
     ↓
ChatInterface captures input
     ↓
Sends to getAgriculturalAdvice()
     ↓
Calls Hugging Face API with:
- User question
- Language-specific system prompt
- Agricultural context
     ↓
Returns dynamic AI response
     ↓
Displays in chat (or fallback if API fails)
```

---

## 🛠️ Fallback System

If Hugging Face API is unavailable, the app uses smart keyword matching:
- "yellowing" → Returns nutrient deficiency advice
- "disease" → Returns disease control advice
- "pest" → Returns pest management advice
- "watering" → Returns irrigation advice
- "fertilizer" → Returns fertilizer recommendations
- "planting" → Returns planting best practices

This ensures users always get relevant responses, even without API.

---

## 📊 API Costs

**Free Tier:**
- 30,000 API calls/month
- ≈ 1,000 messages/day
- Perfect for MVP/testing

**Paid Tier:**
- Pay-as-you-go after free limit
- ~$0.0001 per call (very cheap)

---

## 🐛 Troubleshooting

### Issue: "API key not configured"
**Solution:** 
- Make sure `.env.local` exists
- Verify `VITE_HUGGINGFACE_API_KEY=your_key` is added
- Restart dev server

### Issue: "Model is loading. Please try again"
**Solution:** 
- The first request can take 30 seconds
- Model is loading on first use
- Subsequent requests are instant

### Issue: Voice not working
**Solution:**
- Allow microphone permission when browser asks
- Check that you're using Chrome, Firefox, or Edge
- Safari may have limited support

### Issue: Same response repeatedly
**Solution:**
- This is the fallback system working
- API might be down or key is invalid
- Check browser console for error messages

---

## 🚀 Next Steps (Optional)

### Upgrade to Better Models:
Replace `facebook/opt-350m` with:
- `mistralai/Mistral-7B-Instruct-v0.1` - Better quality
- `meta-llama/Llama-2-7b-chat-hf` - Very good responses
- `google/flan-t5-large` - Fast and reliable

Edit `src/lib/huggingface.ts` line 12:
```typescript
const AGRICULTURAL_MODEL = "mistralai/Mistral-7B-Instruct-v0.1";
```

### Add Database:
Save conversations to Firebase, Supabase, or PostgreSQL

### Add User Authentication:
Track user history and preferences

### Optimize Response Time:
Cache frequently asked questions

---

## 📞 Support

- **Hugging Face Docs**: https://huggingface.co/docs/api-inference
- **API Status**: https://status.huggingface.co
- **Community Forum**: https://discuss.huggingface.co

---

## ✅ Verification Checklist

- [ ] Created `.env.local` file
- [ ] Added `VITE_HUGGINGFACE_API_KEY` with your API key
- [ ] Restarted dev server
- [ ] Tested with a farming question
- [ ] Got a different response for different questions
- [ ] Tested voice input with mic button
- [ ] Switched languages and verified multilingual support

---

**You're all set!** Your AgriAdvisor now has intelligent, dynamic AI responses! 🎉

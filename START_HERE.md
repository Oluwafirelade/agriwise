# Solution 3 - Quick Start 🚀

## ⚡ Get Started in 1 Minute

### Run This Command:
```bash
npm run dev:full
```

That's it! Both backend and frontend will start automatically.

---

## ✅ Verify It's Working

1. Open `http://localhost:5173`
2. Ask a farming question
3. Get a **different AI response** 🎉

---

## 📋 What You'll See

**In your terminal:**
```
✅ Agricultural API Server running on http://localhost:3001
📌 API Key configured: ✓
🌾 Model: google/flan-t5-base

vite v5.4.19 starting dev server...

VITE v5.4.19  ready in 234 ms
```

---

## 🧪 Quick Test Examples

Try these questions:

1. **"My cassava leaves are turning yellow"**
   → Get disease/nutrient advice

2. **"Best fertilizer for plantain"**
   → Get fertilizer recommendations

3. **"When should I plant maize?"**
   → Get planting schedule

Each should get **different responses**! ✨

---

## 🛑 If Something Goes Wrong

**Problem:** "fetch failed" or "Cannot connect"
**Solution:** 
```bash
# Kill any process on port 3001
# macOS/Linux:
lsof -ti:3001 | xargs kill -9

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Then try again:
npm run dev:full
```

---

## 📞 Commands Reference

```bash
npm run server      # Run backend only
npm run dev         # Run frontend only  
npm run dev:full    # Run both (RECOMMENDED)
npm run build       # Build for production
```

---

## 🎯 You're Done! 

Your AgriAdvisor now has intelligent, dynamic AI responses with a secure backend proxy! 🌾

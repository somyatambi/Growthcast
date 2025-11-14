# GrowthCast Deployment Guide

## Frontend Deployment (Vercel)

### Steps:
1. **Push your code to GitHub** ✅ (Already done!)

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your `Growthcast` repository
   - Configure:
     - Framework Preset: **Vite**
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_URL` = `your-backend-url` (add after backend deployment)
   - Click **Deploy**

3. **After Backend Deployment:**
   - Go to Vercel Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com`
   - Redeploy

---

## Backend Deployment (Render)

### Steps:
1. **Go to [render.com](https://render.com)**
   - Sign in with GitHub

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your `Growthcast` repository
   - Configure:
     - Name: `growthcast-backend`
     - Root Directory: `server`
     - Environment: **Node**
     - Build Command: `npm install`
     - Start Command: `node index.js`
     - Instance Type: **Free**

3. **Add Environment Variables:**
   ```
   MONGODB_URI = mongodb+srv://admin:iamtheadmin@growthcast.jgj8dac.mongodb.net/
   JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
   NODE_ENV = production
   PORT = 10000
   CLIENT_URL = https://your-vercel-app.vercel.app
   ```

4. **Click "Create Web Service"**

5. **Get Backend URL:**
   - Copy the URL (e.g., `https://growthcast-backend.onrender.com`)
   - Update Vercel environment variable `VITE_API_URL`

---

## Alternative Options:

### **Option 2: Full Stack on Render**
- Deploy both frontend and backend on Render
- Use Render Static Site for frontend
- Use Render Web Service for backend

### **Option 3: Railway (Easy Full Stack)**
- Go to [railway.app](https://railway.app)
- Connect GitHub repository
- Auto-detects both frontend and backend
- Add environment variables
- Deploy

### **Option 4: Heroku (Paid)**
- Traditional platform
- More expensive but reliable
- Good for production apps

---

## Important: Update CORS After Deployment

After getting your frontend URL, update `server/index.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

---

## MongoDB Atlas Setup

Make sure MongoDB Atlas allows connections:
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Network Access → Add IP Address
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Confirm

---

## Quick Deploy Commands (Vercel CLI):

```powershell
# Login to Vercel
vercel login

# Deploy frontend
vercel --prod

# Follow prompts and it will give you the URL
```

---

## Post-Deployment Checklist:

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables set in both Vercel and Render
- [ ] CORS updated with production URLs
- [ ] Test signup/login flow
- [ ] Test Excel cleaning feature
- [ ] Test predictive analysis feature

---

## Monitoring:

- **Vercel:** Check Analytics in dashboard
- **Render:** Check Logs in dashboard
- **MongoDB:** Check Atlas monitoring

Need help with any specific step? Let me know!

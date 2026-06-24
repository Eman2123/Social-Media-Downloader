# VideoSave — Social Media Video Downloader

Free video downloader supporting YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit and more.

## Project Structure

```
video-downloader/
├── frontend/          # Next.js 14 + Tailwind CSS
└── backend/           # Python FastAPI + yt-dlp
```

---

## Backend Setup (Python + FastAPI + yt-dlp)

### Local Development

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

API will run at: `http://localhost:8000`

### Deploy on Render (Free)

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy!

---

## Frontend Setup (Next.js 14)

### Local Development

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run dev server
npm run dev
```

App will run at: `http://localhost:3000`

### Deploy on Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set Root Directory: `frontend`
4. Add Environment Variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.onrender.com`
5. Deploy!

---

## Supported Platforms

| Platform | Status |
|----------|--------|
| YouTube | ✅ |
| TikTok | ✅ |
| Instagram | ✅ |
| Facebook | ✅ |
| Twitter/X | ✅ |
| Reddit | ✅ |
| Pinterest | ✅ |
| Vimeo | ✅ |
| Dailymotion | ✅ |
| Twitch | ✅ |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | API status |
| POST | `/api/info` | Get video info + download links |
| GET | `/api/supported-platforms` | List supported platforms |

### POST /api/info

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "success": true,
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 245,
  "platform": "YouTube",
  "formats": [
    {
      "label": "1080p",
      "ext": "mp4",
      "type": "video",
      "url": "https://...",
      "filesize": 52428800
    }
  ]
}
```

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, yt-dlp
- **Hosting:** Vercel (frontend) + Render (backend)
- **Cost:** 100% Free

## Future Upgrades (Vultr Server)

When moving to Vultr:
1. Deploy backend on Vultr with `uvicorn`
2. Set up Nginx reverse proxy
3. Update `NEXT_PUBLIC_API_URL` in Vercel to Vultr IP
4. Add SSL with Let's Encrypt

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import yt_dlp
import httpx

app = FastAPI(title="Video Downloader API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPPORTED_PLATFORMS = [
    "youtube.com", "youtu.be", "tiktok.com", "instagram.com",
    "facebook.com", "fb.watch", "twitter.com", "x.com",
    "reddit.com", "pinterest.com", "dailymotion.com", "vimeo.com", "twitch.tv",
]

class VideoRequest(BaseModel):
    url: str

def detect_platform(url: str) -> str:
    url_lower = url.lower()
    if "youtube.com" in url_lower or "youtu.be" in url_lower: return "YouTube"
    elif "tiktok.com" in url_lower: return "TikTok"
    elif "instagram.com" in url_lower: return "Instagram"
    elif "facebook.com" in url_lower or "fb.watch" in url_lower: return "Facebook"
    elif "twitter.com" in url_lower or "x.com" in url_lower: return "Twitter/X"
    elif "reddit.com" in url_lower: return "Reddit"
    elif "pinterest.com" in url_lower: return "Pinterest"
    elif "dailymotion.com" in url_lower: return "Dailymotion"
    elif "vimeo.com" in url_lower: return "Vimeo"
    elif "twitch.tv" in url_lower: return "Twitch"
    return "Unknown"

def is_supported(url: str) -> bool:
    return any(platform in url.lower() for platform in SUPPORTED_PLATFORMS)

@app.get("/")
async def root():
    return {"message": "Video Downloader API is running!", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/info")
async def get_video_info(request: VideoRequest):
    url = request.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    if not is_supported(url):
        raise HTTPException(status_code=400, detail="Platform not supported")

    ydl_opts = {"quiet": True, "no_warnings": True, "skip_download": True}

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        formats = []
        seen = set()
        for f in info.get("formats", []):
            ext = f.get("ext", "")
            vcodec = f.get("vcodec", "none")
            height = f.get("height")
            url_link = f.get("url", "")
            if not url_link or url_link.startswith("manifest"): continue
            if vcodec != "none" and height and ext in ["mp4", "webm"]:
                label = f"{height}p"
                if label not in seen:
                    seen.add(label)
                    formats.append({"format_id": f.get("format_id",""), "label": label, "ext": ext, "type": "video", "filesize": f.get("filesize") or f.get("filesize_approx")})

        formats.sort(key=lambda x: int(x["label"].replace("p","")) if x["label"].replace("p","").isdigit() else 0, reverse=True)

        audio_formats = [f for f in info.get("formats",[]) if f.get("vcodec")=="none" and f.get("acodec")!="none" and f.get("url")]
        if audio_formats:
            best_audio = audio_formats[-1]
            formats.append({"format_id": best_audio.get("format_id",""), "label": "MP3 Audio", "ext": "mp3", "type": "audio", "filesize": best_audio.get("filesize") or best_audio.get("filesize_approx")})

        if not formats:
            formats.append({"format_id": "best", "label": "Best Quality", "ext": info.get("ext","mp4"), "type": "video", "filesize": None})

        return {
            "success": True,
            "title": info.get("title", "Unknown Title"),
            "thumbnail": info.get("thumbnail", ""),
            "duration": info.get("duration", 0) or 0,
            "platform": detect_platform(url),
            "formats": formats[:6],
        }
    except yt_dlp.utils.DownloadError as e:
        error_msg = str(e)
        if "private" in error_msg.lower(): raise HTTPException(status_code=403, detail="This video is private")
        elif "unavailable" in error_msg.lower(): raise HTTPException(status_code=404, detail="Video not found")
        else: raise HTTPException(status_code=400, detail=f"Could not fetch video: {error_msg[:200]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)[:200]}")

@app.post("/api/download")
async def download_video(request: VideoRequest):
    url = request.url.strip()
    if not is_supported(url):
        raise HTTPException(status_code=400, detail="Platform not supported")

    ydl_opts = {"quiet": True, "format": "best[ext=mp4]/best", "skip_download": True}

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        stream_url = info.get("url") or info["formats"][-1]["url"]
        title = info.get("title", "video").replace("/", "_")[:100]

        async def stream():
            async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
                async with client.stream("GET", stream_url) as r:
                    async for chunk in r.aiter_bytes(65536):
                        yield chunk

        return StreamingResponse(
            stream(),
            media_type="video/mp4",
            headers={"Content-Disposition": f'attachment; filename="{title}.mp4"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)[:200])

@app.get("/api/supported-platforms")
async def get_supported_platforms():
    return {"platforms": [
        {"name": "YouTube", "icon": "youtube", "url": "youtube.com"},
        {"name": "TikTok", "icon": "tiktok", "url": "tiktok.com"},
        {"name": "Instagram", "icon": "instagram", "url": "instagram.com"},
        {"name": "Facebook", "icon": "facebook", "url": "facebook.com"},
        {"name": "Twitter/X", "icon": "twitter", "url": "twitter.com"},
        {"name": "Reddit", "icon": "reddit", "url": "reddit.com"},
        {"name": "Pinterest", "icon": "pinterest", "url": "pinterest.com"},
        {"name": "Vimeo", "icon": "vimeo", "url": "vimeo.com"},
        {"name": "Dailymotion", "icon": "dailymotion", "url": "dailymotion.com"},
        {"name": "Twitch", "icon": "twitch", "url": "twitch.tv"},
    ]}

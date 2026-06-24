"use client";

import { useState } from "react";
import {
  Download, Link2, CheckCircle, AlertCircle, Loader2,
  Music, Video, Youtube, Instagram, Facebook, Twitter,
  Globe, Play, Clipboard, MonitorPlay, Twitch, MessageCircle
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PLATFORMS = [
  { name: "YouTube",     Icon: Youtube,       bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200" },
  { name: "TikTok",      Icon: Music,          bg: "bg-gray-900",   text: "text-white",      border: "border-gray-700" },
  { name: "Instagram",   Icon: Instagram,      bg: "bg-pink-50",    text: "text-pink-600",   border: "border-pink-200" },
  { name: "Facebook",    Icon: Facebook,       bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200" },
  { name: "Twitter / X", Icon: Twitter,        bg: "bg-sky-50",     text: "text-sky-600",    border: "border-sky-200" },
  { name: "Reddit",      Icon: MessageCircle,  bg: "bg-orange-50",  text: "text-orange-600", border: "border-orange-200" },
  { name: "Pinterest",   Icon: Globe,          bg: "bg-red-50",     text: "text-red-500",    border: "border-red-200" },
  { name: "Vimeo",       Icon: Play,           bg: "bg-cyan-50",    text: "text-cyan-600",   border: "border-cyan-200" },
  { name: "Dailymotion", Icon: MonitorPlay,    bg: "bg-blue-50",    text: "text-blue-500",   border: "border-blue-200" },
  { name: "Twitch",      Icon: Twitch,         bg: "bg-purple-50",  text: "text-purple-600", border: "border-purple-200" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Copy the URL",    desc: "Open any video on a supported platform and copy the link from your browser.", Icon: Clipboard },
  { step: "2", title: "Paste & fetch",   desc: "Paste the URL in the box above and click the Get Video button.",             Icon: Link2 },
  { step: "3", title: "Pick & download", desc: "Choose your preferred quality or audio-only format and download instantly.", Icon: Download },
];

const FAQ = [
  { q: "Is this free?",                       a: "Yes, completely free. No signup, no subscription, no hidden charges." },
  { q: "Which platforms are supported?",      a: "YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, Pinterest, Vimeo, Dailymotion, Twitch and many more." },
  { q: "What quality options are available?", a: "Depends on the source video. Usually 360p, 480p, 720p and 1080p are available. Audio-only (MP3) is also supported." },
  { q: "Is it legal to download videos?",    a: "Only download videos you have permission to use. Please respect copyright laws and each platform's terms of service." },
];

function formatDuration(s: number) {
  if (!s) return "";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${m}:${String(sec).padStart(2,"0")}`;
}
function formatSize(b: number | null) {
  if (!b) return "";
  return b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;
}

interface Format { format_id:string; label:string; ext:string; type:string; url:string; filesize:number|null; }
interface VideoData { title:string; thumbnail:string; duration:number; platform:string; formats:Format[]; }

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="9" fill="#2563eb"/>
        <polygon points="13,10 13,26 27,18" fill="white"/>
        <rect x="19" y="24" width="10" height="2.5" rx="1.25" fill="#93c5fd"/>
        <rect x="15" y="28" width="14" height="2.5" rx="1.25" fill="#bfdbfe"/>
      </svg>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-gray-900">Video</span><span className="text-blue-600">Save</span>
      </span>
    </div>
  );
}

export default function Home() {
  const [url, setUrl]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  const handleFetch = async () => {
    if (!url.trim()) { setError("Please enter a video URL"); return; }
    setLoading(true); setError(""); setVideoData(null);
    try {
      const res  = await fetch(`${API_URL}/api/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch video info");
      setVideoData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#platforms"    className="hover:text-blue-600 transition-colors">Platforms</a>
            <a href="#faq"          className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Download Videos<br /><span className="text-blue-600">From Any Platform</span>
          </h1>
          <p className="text-lg text-gray-500">YouTube, TikTok, Instagram, Facebook &amp; 10+ more — Free. No signup.</p>
        </div>

        {/* Input */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url" value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                placeholder="Paste video URL here..."
                className="input-url pl-11"
              />
            </div>
            <button onClick={handleFetch} disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 min-w-[140px]">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin"/>Fetching...</> : <><Download className="w-4 h-4"/>Get Video</>}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-start gap-3 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5"/><span>{error}</span>
            </div>
          )}
        </div>

        {/* Result */}
        {videoData && (
          <div className="card mb-8">
            <div className="flex gap-4 mb-5">
              {videoData.thumbnail && (
                <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img src={videoData.thumbnail} alt={videoData.title} className="w-full h-full object-cover"/>
                  {videoData.duration > 0 && (
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {formatDuration(videoData.duration)}
                    </span>
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="inline-block text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mb-2">
                  {videoData.platform}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-3">{videoData.title}</h3>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Choose quality &amp; download</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {videoData.formats.map((fmt, i) => (
                  <button key={i} onClick={() => window.open(fmt.url, "_blank")}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm group">
                    {fmt.type === "audio"
                      ? <Music className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0"/>
                      : <Video className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0"/>
                    }
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 group-hover:text-blue-700">{fmt.label}</p>
                      {fmt.filesize && <p className="text-xs text-gray-400">{formatSize(fmt.filesize)}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500"/>Video info fetched successfully
            </div>
          </div>
        )}

        {/* How it works */}
        <div id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map(({ step, title, desc, Icon }) => (
              <div key={step} className="card text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-blue-600"/>
                </div>
                <div className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-2">{step}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div id="platforms" className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Supported platforms</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PLATFORMS.map(({ name, Icon, bg, text, border }) => (
              <div key={name} className={`${bg} ${border} border rounded-xl px-3 py-3 text-center`}>
                <Icon className={`w-6 h-6 mx-auto mb-1.5 ${text}`}/>
                <p className={`text-xs font-semibold ${text}`}>{name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Logo />
          </div>
          <p className="text-sm text-gray-400 mt-2">Free video downloader — For personal use only. Respect copyright laws.</p>
          <p className="text-xs text-gray-300 mt-1">&copy; {new Date().getFullYear()} VideoSave</p>
        </div>
      </footer>
    </div>
  );
}
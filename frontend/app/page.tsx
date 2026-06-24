"use client";

import { useState } from "react";
import { Download, Link, CheckCircle, AlertCircle, Loader2, Music, Video } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PLATFORMS = [
  { name: "YouTube", color: "bg-red-100 text-red-600", emoji: "▶️" },
  { name: "TikTok", color: "bg-gray-900 text-white", emoji: "🎵" },
  { name: "Instagram", color: "bg-pink-100 text-pink-600", emoji: "📸" },
  { name: "Facebook", color: "bg-blue-100 text-blue-700", emoji: "👥" },
  { name: "Twitter/X", color: "bg-gray-100 text-gray-800", emoji: "🐦" },
  { name: "Reddit", color: "bg-orange-100 text-orange-600", emoji: "🤖" },
  { name: "Pinterest", color: "bg-red-100 text-red-500", emoji: "📌" },
  { name: "Vimeo", color: "bg-cyan-100 text-cyan-600", emoji: "🎬" },
  { name: "Dailymotion", color: "bg-blue-100 text-blue-500", emoji: "📹" },
  { name: "Twitch", color: "bg-purple-100 text-purple-600", emoji: "🎮" },
];

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Format {
  format_id: string;
  label: string;
  ext: string;
  type: string;
  filesize: number | null;
}

interface VideoData {
  title: string;
  thumbnail: string;
  duration: number;
  platform: string;
  formats: Format[];
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  const handleFetch = async () => {
    if (!url.trim()) { setError("Please enter a video URL"); return; }
    setLoading(true); setError(""); setVideoData(null);
    try {
      const res = await fetch(`${API_URL}/api/info`, {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetch();
  };

  const handleDownload = async (format: Format) => {
    setDownloading(format.label);
    try {
      const res = await fetch(`${API_URL}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `video.${format.ext}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err: any) {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VideoSave</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#platforms" className="hover:text-blue-600 transition-colors">Platforms</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Download Videos<br />
            <span className="text-blue-600">From Any Platform</span>
          </h1>
          <p className="text-lg text-gray-500">YouTube, TikTok, Instagram, Facebook & 10+ more. Free. No signup.</p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url" value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste video URL here..."
                className="input-url pl-11"
              />
            </div>
            <button onClick={handleFetch} disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 min-w-[140px]">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Fetching...</> : <><Download className="w-4 h-4" />Get Video</>}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-start gap-3 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {videoData && (
          <div className="card mb-8">
            <div className="flex gap-4 mb-5">
              {videoData.thumbnail && (
                <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img src={videoData.thumbnail} alt={videoData.title} className="w-full h-full object-cover" />
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
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Choose Quality & Download</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {videoData.formats.map((format, idx) => (
                  <button key={idx} onClick={() => handleDownload(format)}
                    disabled={downloading !== null}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm group disabled:opacity-60">
                    {downloading === format.label
                      ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      : format.type === "audio"
                        ? <Music className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        : <Video className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    }
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 group-hover:text-blue-700">{format.label}</p>
                      {format.filesize && <p className="text-xs text-gray-400">{formatFileSize(format.filesize)}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Video info fetched successfully
            </div>
          </div>
        )}

        <div id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Copy URL", desc: "Copy the video link from any supported platform", icon: "🔗" },
              { step: "2", title: "Paste & Fetch", desc: "Paste the URL above and click Get Video button", icon: "📋" },
              { step: "3", title: "Download", desc: "Choose your quality and download the video instantly", icon: "⬇️" },
            ].map((item) => (
              <div key={item.step} className="card text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-2">{item.step}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="platforms" className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Supported Platforms</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PLATFORMS.map((p) => (
              <div key={p.name} className={`${p.color} rounded-xl px-3 py-3 text-center text-sm font-medium`}>
                <div className="text-2xl mb-1">{p.emoji}</div>
                {p.name}
              </div>
            ))}
          </div>
        </div>

        <div id="faq" className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Is this free?", a: "Yes, completely free. No signup, no subscription, no hidden charges." },
              { q: "Which platforms are supported?", a: "YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, Pinterest, Vimeo, Dailymotion, Twitch and many more." },
              { q: "What video qualities are available?", a: "It depends on the original video. Usually 360p, 480p, 720p, 1080p are available. Audio-only (MP3) is also supported." },
              { q: "Is it legal to download videos?", a: "Only download videos you have permission to download. Please respect copyright laws and the terms of service of each platform." },
            ].map((item, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-400">
          <p className="mb-2"><span className="font-semibold text-gray-700">VideoSave</span> — Free video downloader for everyone</p>
          <p>© {new Date().getFullYear()} VideoSave. For personal use only. Respect copyright laws.</p>
        </div>
      </footer>
    </div>
  );
}

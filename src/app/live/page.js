"use client";

import { useEffect, useState } from "react";
import * as Player from "@livepeer/react/player";
import { PauseIcon, PlayIcon } from "@livepeer/react/assets";
import { supabase } from "@/lib/supabaseClient";

export default function LivePage() {
  const [streams, setStreams] = useState([]);
  const [newPlaybackId, setNewPlaybackId] = useState("");
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  function isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);
  }

  function getYouTubeEmbedUrl(url) {
    try {
      const u = new URL(url);
      let videoId = "";
      if (u.hostname.includes("youtu.be")) {
        videoId = u.pathname.replace("/", "");
      } else if (u.hostname.includes("youtube.com")) {
        if (u.pathname.startsWith("/watch") || u.pathname.startsWith("/live")) {
          videoId = u.searchParams.get("v") || "";
        } else if (u.pathname.startsWith("/embed/")) {
          videoId = u.pathname.split("/embed/")[1];
        }
      }
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0`;
    } catch {
      return null;
    }
  }

  async function addStream() {
    const id = newPlaybackId.trim();
    if (!id) return;
    const exists = streams.some((s) => s.playbackId === id);
    if (exists) return;
    try {
      // Accept YouTube URLs without Livepeer validation
      const isYouTube = isYouTubeUrl(id);
      if (!isYouTube) {
        const res = await fetch(`/api/livepeer/validate?id=${encodeURIComponent(id)}`, { cache: "no-store" });
        const json = await res.json();
        if (!json?.ok) {
          setErrorModal({ open: true, message: "Stream is not reachable. Please check the Playback ID or URL." });
          return;
        }
      }
      setStreams((prev) => [{ playbackId: id }, ...prev]);
      try {
        const source = isYouTube ? 'youtube' : (/^https?:\/\//i.test(id) ? 'hls' : 'livepeer');
        const { error } = await supabase.from('streams').insert({ playback_id: id, source });
        if (error) {
          console.warn('Supabase insert error:', error.message);
          // Optionally show user feedback about database save failure
        }
      } catch (error) {
        console.warn('Database operation failed:', error.message);
      }
      setNewPlaybackId("");
    } catch {
      setErrorModal({ open: true, message: "Validation failed. Try again." });
    }
  }



  function getSrcFor(id) {
    const trimmed = id.trim();
    const isUrl = /^https?:\/\//i.test(trimmed);
    // HLS/PlaybackId only (YouTube handled in render)
    const src = isUrl ? trimmed : `https://livepeercdn.com/hls/${trimmed}/index.m3u8`;
    console.log("11111111111:",src);
    return [
      { src, type: "application/x-mpegURL" },
    ];
  }

  const demoInfoMap = {
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8": {
      title: "MUX Demo (x36xhzz)",
      source: "mux.dev",
    },
    "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8": {
      title: "Sintel Trailer (Akamai)",
      source: "akamaihd.net",
    },
    "f5eese9wwl88k4g8": {
      title: "Livepeer Docs Example",
      source: "livepeercdn.com",
    },
  };

  function getDemoInfo(id) {
    return demoInfoMap[id];
  }



  // Load from Supabase (public). Fallback to demo if empty.
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('streams')
          .select('playback_id')
          .order('created_at', { ascending: false })
          .limit(60);
        if (!error && Array.isArray(data) && data.length > 0) {
          setStreams(data.map(d => ({ playbackId: d.playback_id })));
          return;
        }
      } catch {}
      setStreams([{ playbackId: "f5eese9wwl88k4g8" }]);
    })();
  }, []);

  // metrics polling state
  const [metrics, setMetrics] = useState({}); // { [playbackId]: { viewers, bitrate, resolution, latency } }
  const [ytMeta, setYtMeta] = useState({}); // { [url]: { title, author_name } }
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    let timer;
    async function fetchAll() {
      await Promise.all(
        streams.map(async ({ playbackId }) => {
          try {
            // only query metrics if it's a plain playbackId (not a full URL)
            if (/^https?:\/\//i.test(playbackId)) return;
            const res = await fetch(`/api/livepeer/metrics?playbackId=${encodeURIComponent(playbackId)}`, { cache: "no-store" });
            if (!res.ok) return;
            const json = await res.json();
            const d = json?.data || {};
            const summary = {
              viewers: d.viewers ?? d.currentViewers ?? "—",
              bitrate: d.bitrate ?? d.bitrateKbps ?? "—",
              resolution: d.resolution ?? "—",
              latency: d.latency ?? "—",
            };
            setMetrics((prev) => ({ ...prev, [playbackId]: summary }));
          } catch {}
        })
      );
    }
    fetchAll();
    timer = setInterval(fetchAll, 10000);
    return () => clearInterval(timer);
  }, [streams]);

  // YouTube metadata fetch
  useEffect(() => {
    async function fetchYt() {
      await Promise.all(
        streams.map(async ({ playbackId }) => {
          if (!/^https?:\/\//i.test(playbackId)) return;
          if (!/(youtube\.com|youtu\.be)\//i.test(playbackId)) return;
          try {
            const url = playbackId.startsWith("http") ? playbackId : `https://${playbackId}`;
            const res = await fetch(`/api/youtube/oembed?url=${encodeURIComponent(url)}`, { cache: "no-store" });
            if (!res.ok) return;
            const json = await res.json();
            setYtMeta((prev) => ({ ...prev, [playbackId]: json }));
          } catch {}
        })
      );
    }
    fetchYt();
  }, [streams]);

  return (
    <>
    <style jsx>{`
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(10px) translateX(-10px); }
        75% { transform: translateY(-10px) translateX(5px); }
      }
      
      @keyframes shootingStar {
        0% { transform: translateX(-100px) translateY(0px) rotate(-45deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateX(calc(100vw + 100px)) translateY(200px) rotate(-45deg); opacity: 0; }
      }
      
      @keyframes nebulaFloat {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -20px) scale(1.1); }
        66% { transform: translate(-20px, 30px) scale(0.9); }
        100% { transform: translate(10px, 10px) scale(1); }
      }
      
      @keyframes nebulaPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      
      @keyframes diceRoll {
        0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
        25% { transform: translateX(50px) translateY(-30px) rotate(90deg); }
        50% { transform: translateX(-30px) translateY(-50px) rotate(180deg); }
        75% { transform: translateX(-50px) translateY(30px) rotate(270deg); }
        100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
      }
      
      @keyframes diceFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-40px); }
      }
      
      @keyframes beamScan {
        0%, 100% { transform: translateX(-140%); }
        50% { transform: translateX(140%); }
      }
      
      .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
      }
      
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    <div className="min-h-screen pt-36 md:pt-44 pb-16 px-4 md:px-10 lg:px-24 xl:px-36 relative overflow-hidden">
      {/* Dynamic Space Casino Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Deep blue space gradient */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 20% 25% at 25% 15%, #00A3FF 0%, transparent 50%),
              radial-gradient(ellipse 30% 35% at 75% 85%, #0066FF 0%, transparent 50%),
              radial-gradient(ellipse 25% 30% at 50% 50%, #3A86FF 0%, transparent 40%),
              linear-gradient(135deg, #000814 0%, #001D3D 30%, #003566 60%, #000814 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0, 163, 255, 0.03) 2px,
                rgba(0, 163, 255, 0.03) 4px
              )
            `
          }}
        />
        
        {/* Animated stars */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(120)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                background: `radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,163,255,0.8) 50%, transparent 100%)`,
                animation: `twinkle ${1 + Math.random() * 3}s infinite ${Math.random() * 2}s, float ${8 + Math.random() * 12}s infinite ease-in-out ${Math.random() * 5}s`,
                boxShadow: `0 0 ${10 + Math.random() * 20}px rgba(0, 163, 255, 0.9), 0 0 ${5 + Math.random() * 15}px rgba(58, 134, 255, 0.6)`,
                opacity: 0.6 + Math.random() * 0.4
              }}
            />
          ))}
        </div>
        
        {/* Shooting stars */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animation: `shootingStar ${3 + Math.random() * 4}s infinite linear ${Math.random() * 8}s`,
              }}
            >
              <div
                className="w-1 h-1 bg-white rounded-full"
                style={{
                  boxShadow: `0 0 10px 5px rgba(0, 163, 255, 0.8), 0 0 20px 10px rgba(0, 163, 255, 0.4)`,
                  background: 'linear-gradient(90deg, white, transparent)',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Floating nebula clouds */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={`nebula-${i}`}
              className="absolute rounded-full opacity-40"
              style={{
                width: `${300 + Math.random() * 500}px`,
                height: `${300 + Math.random() * 500}px`,
                left: `${-20 + Math.random() * 140}%`,
                top: `${-20 + Math.random() * 140}%`,
                background: `
                  radial-gradient(circle at 30% 30%, ${['#0066FF', '#00A3FF', '#3A86FF', '#0077B6', '#023E8A', '#48CAE4'][i % 6]}60 0%, transparent 40%),
                  radial-gradient(circle at 70% 70%, ${['#00A3FF', '#3A86FF', '#0066FF', '#0077B6', '#90E0EF', '#00B4D8'][i % 6]}40 0%, transparent 60%)
                `,
                filter: `blur(${20 + Math.random() * 40}px)`,
                animation: `nebulaFloat ${15 + Math.random() * 20}s infinite alternate ease-in-out ${Math.random() * 10}s, nebulaPulse ${8 + Math.random() * 6}s infinite ease-in-out ${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        
        {/* Casino dice with blue glow */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={`dice-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `diceRoll ${8 + Math.random() * 12}s infinite ease-in-out ${Math.random() * 8}s, diceFloat ${6 + Math.random() * 8}s infinite ease-in-out ${Math.random() * 4}s`,
              }}
            >
              <div
                className="rounded-sm"
                style={{
                  width: `${15 + Math.random() * 20}px`,
                  height: `${15 + Math.random() * 20}px`,
                  background: `linear-gradient(135deg, rgba(0, 163, 255, 0.4) 0%, rgba(0, 102, 255, 0.2) 50%, rgba(58, 134, 255, 0.1) 100%)`,
                  transform: `scale(${0.6 + Math.random() * 1.2}) rotate(${Math.random() * 360}deg)`,
                  boxShadow: `0 0 ${15 + Math.random() * 25}px rgba(0, 163, 255, 0.7), 0 0 ${5 + Math.random() * 10}px rgba(255,255,255,0.3)`,
                  border: `1px solid rgba(0, 163, 255, ${0.3 + Math.random() * 0.5})`,
                }}
              >
                {/* Dice dots */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {[...Array([1, 4, 3, 6, 2, 5][i % 6])].map((_, j) => (
                    <div
                      key={j}
                      className="absolute rounded-full"
                      style={{
                        width: `${2 + Math.random() * 2}px`,
                        height: `${2 + Math.random() * 2}px`,
                        background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(0,163,255,0.6) 100%)`,
                        top: `${[50, 25, 25, 25, 40, 25][Math.floor(j / [1, 2, 3, 2, 1, 2][i % 6])]}%`,
                        left: `${[50, 25, 25, 25, 50, 25][j % [1, 2, 3, 2, 1, 2][i % 6]]}%`,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 4px rgba(255,255,255,0.6)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Energy beams */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {[...Array(6)].map((_, i) => {
            const randomRotate = -5 + (i * 2);
            const randomDuration = 4 + (i * 0.5);
            const randomDelay = i * 0.8;
            return (
              <div
                key={`beam-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-[#00A3FF]/60 to-transparent"
                style={{
                  left: `${-20}%`,
                  top: `${10 + i * 15}%`,
                  width: '140%',
                  transform: `rotate(${randomRotate}deg)`,
                  animation: `beamScan ${randomDuration}s infinite ease-in-out ${randomDelay}s`,
                  boxShadow: `0 0 8px 2px rgba(0, 163, 255, 0.4)`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="relative z-10">
        <div className="bg-black/40 backdrop-blur-md border border-[#00A3FF]/30 rounded-2xl p-4 md:p-6 shadow-2xl mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-white bg-gradient-to-r from-[#00A3FF] to-[#0066FF] bg-clip-text text-transparent">Live Streams</h1>
            <button
              onClick={() => setGuideOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#00A3FF]/20 to-[#0066FF]/20 hover:from-[#00A3FF]/30 hover:to-[#0066FF]/30 text-white/90 text-sm border border-[#00A3FF]/30 transition-all duration-300 hover:scale-105"
            >How to Stream</button>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">Add a stream (Playback ID, HLS URL, or YouTube URL)</label>
              <input
                value={newPlaybackId}
                onChange={(e) => setNewPlaybackId(e.target.value)}
                placeholder="e.g. f5eese9wwl88k4g8 or https://...m3u8 or https://youtu.be/..."
                className="w-full px-4 py-2.5 rounded-full bg-black/60 border border-[#00A3FF]/30 text-white placeholder-white/30 focus:outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/30 backdrop-blur-sm transition-all"
              />
            </div>
            <button
              onClick={addStream}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#00A3FF] to-[#0066FF] text-white font-medium hover:from-[#0066FF] hover:to-[#00A3FF] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#00A3FF]/30 border border-[#00A3FF]/50"
            >
              Add Stream
            </button>
          </div>
        </div>

        {/* Grid of streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {streams.length === 0 && (
            <div className="col-span-full text-white/60 text-sm text-center py-12 bg-black/40 backdrop-blur-md rounded-2xl border border-[#00A3FF]/20">
              <div className="text-4xl mb-4">🎰</div>
              No streams yet. Add one with a Playback ID or YouTube URL.
            </div>
          )}

          {streams.map(({ playbackId }, idx) => (
            <div key={playbackId} className={`bg-black/50 backdrop-blur-lg border border-[#00A3FF]/40 rounded-2xl p-4 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-[#00A3FF]/60 hover:bg-black/60 fade-in-up`} style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative flex h-2.5 w-2.5 mr-0.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#00A3FF] opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A3FF]"></span>
                  </span>
                  <div className="text-white/90 text-xs md:text-sm truncate font-medium" title={playbackId}>
                    {/(youtube\.com|youtu\.be)\//i.test(playbackId) ? "YouTube Live" : "Livepeer Live"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(playbackId)}
                    className="px-3 py-1 rounded-full bg-[#00A3FF]/20 hover:bg-[#00A3FF]/30 text-white/90 text-xs border border-[#00A3FF]/30 transition-all duration-300"
                  >Copy</button>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden ring-1 ring-[#00A3FF]/30 bg-gradient-to-b from-black/80 to-black/60">
                {(() => {
                  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(playbackId)) {
                    const embed = getYouTubeEmbedUrl(playbackId.startsWith("http") ? playbackId : `https://${playbackId}`);
                    if (embed) {
                      return (
                        <div className="w-full aspect-video">
                          <iframe
                            src={embed}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            title="YouTube Live"
                          />
                        </div>
                      );
                    }
                  }
                  return (
                    // <Player.Root src="{getSrcFor(playbackId)}">
                    <Player.Root src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8">
                      <Player.Container className="w-full aspect-video">
                        <Player.Video title="Live stream" />
                        <Player.Controls className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
                          <Player.PlayPauseTrigger className="w-8 h-8 bg-[#00A3FF]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#00A3FF]/30 hover:bg-[#00A3FF]/30 transition-all">
                            <Player.PlayingIndicator asChild matcher={false}>
                              <PlayIcon />
                            </Player.PlayingIndicator>
                            <Player.PlayingIndicator asChild>
                              <PauseIcon />
                            </Player.PlayingIndicator>
                          </Player.PlayPauseTrigger>
                        </Player.Controls>
                      </Player.Container>
                    </Player.Root>
                  );
                })()}
              </div>

              <div className="mt-3 flex items-center justify-between text-white/70 text-xs">
                <a
                  href={/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(playbackId)
                    ? (playbackId.startsWith("http") ? playbackId : `https://${playbackId}`)
                    : `https://livepeercdn.com/hls/${playbackId}/index.m3u8`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00A3FF] hover:text-[#00A3FF]/80 transition-colors duration-300"
                >Open HLS</a>
                <div className="text-white/50">
                  {(() => {
                    const m = metrics[playbackId];
                    const viewers = m?.viewers ?? "—";
                    const bitrate = m?.bitrate ? `${m.bitrate} kbps` : "—";
                    return `👥 ${viewers} • 📊 ${bitrate}`;
                  })()}
                </div>
              </div>
              {(() => {
                const meta = getDemoInfo(playbackId);
                const yt = ytMeta[playbackId];
                if (!meta && !yt) return null;
                return (
                  <div className="mt-2 text-white/45 text-[11px] leading-snug">
                    {meta && (
                      <>
                        <div>Demo: {meta.title}</div>
                        <div>Source: {meta.source}</div>
                      </>
                    )}
                    {yt && (
                      <>
                        <div>🎬 {yt.title}</div>
                        <div>📺 {yt.author_name}</div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
    {errorModal.open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setErrorModal({ open: false, message: "" })} />
        <div className="relative bg-black/80 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-white text-lg font-semibold">Stream Error</h3>
          </div>
          <p className="text-white/80 text-sm mb-6 leading-relaxed">{errorModal.message}</p>
          <div className="flex justify-end">
            <button
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00A3FF] to-[#0066FF] text-white font-medium hover:from-[#0066FF] hover:to-[#00A3FF] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#00A3FF]/30"
              onClick={() => setErrorModal({ open: false, message: "" })}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    {guideOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setGuideOpen(false)} />
        <div className="relative w-[96%] max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-[#00A3FF]/30">
          <div className="bg-gradient-to-r from-[#00A3FF] to-[#0066FF] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-xl md:text-2xl font-display font-semibold">🎰 How to Stream</h3>
              <button
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white/90 text-sm transition-all duration-300 hover:scale-105"
                onClick={() => setGuideOpen(false)}
              >Close</button>
            </div>
          </div>
          <div className="bg-black/80 backdrop-blur-md text-white/90 p-6 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-[#00A3FF]/30 bg-[#00A3FF]/10 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  <h4 className="text-white font-medium">Option 1 — Livepeer</h4>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-white/80 text-sm">
                  <li>Create an API key and a stream in Livepeer Studio. <a href="https://docs.livepeer.org/developers/quick-start" className="underline" target="_blank" rel="noreferrer">Docs</a></li>
                  <li>Configure OBS with Ingest URL + Stream Key and start streaming.</li>
                  <li>Copy the Playback ID from the stream.</li>
                  <li>Paste the Playback ID into the input above and click <span className="text-white">Add</span>.</li>
                </ol>
              </div>
              <div className="rounded-xl border border-[#00A3FF]/30 bg-[#00A3FF]/10 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-400"></span>
                  <h4 className="text-white font-medium">Option 2 — YouTube Live</h4>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-white/80 text-sm">
                  <li>Go live from YouTube Studio.</li>
                  <li>Copy the live URL (watch/share, e.g. https://youtu.be/...).</li>
                  <li>Paste the URL into the input above and click <span className="text-white">Add</span>.</li>
                </ol>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-[#00A3FF]/30 bg-[#00A3FF]/10 p-4 text-xs text-white/70 backdrop-blur-sm">
              💡 <span className="font-medium">Tip:</span> You can add multiple streams. Livepeer cards show metrics; YouTube cards show title and channel.
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}



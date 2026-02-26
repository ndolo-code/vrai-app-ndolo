"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from "lucide-react"

type Props = {
  src: string
  title?: string
  portrait?: boolean
}

const QUALITY_LABELS = ["Auto", "360p", "480p", "720p"] as const

function applyCloudinaryTransform(url: string, quality: string): string {
  if (quality === "Auto") return url
  const heightMap: Record<string, string> = { "360p": "h_360", "480p": "h_480", "720p": "h_720" }
  const h = heightMap[quality]
  if (!h) return url
  // Insert Cloudinary transformation before /v<timestamp>
  return url.replace(/\/upload\//, `/upload/${h},c_scale/`)
}

export function ProtectedVideo({ src, title, portrait = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showQuality, setShowQuality] = useState(false)
  const [quality, setQuality] = useState<string>("Auto")
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Prevent right-click / long-press context menu
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const block = (e: Event) => { e.preventDefault(); e.stopPropagation() }
    el.addEventListener("contextmenu", block, true)
    // Block long-press on mobile (touchstart held)
    let longPress: ReturnType<typeof setTimeout> | null = null
    const onTouchStart = () => { longPress = setTimeout(() => {}, 500) }
    const onTouchEnd = () => { if (longPress) clearTimeout(longPress) }
    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener("contextmenu", block, true)
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    if (playing) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [playing])

  useEffect(() => {
    if (!playing) setShowControls(true)
    else showControlsTemporarily()
  }, [playing, showControlsTemporarily])

  // Fullscreen change detection
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const handleVolumeChange = (val: number) => {
    const v = videoRef.current
    if (!v) return
    v.volume = val
    setVolume(val)
    setMuted(val === 0)
    v.muted = val === 0
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    v.currentTime = pct * duration
  }

  const toggleFullscreen = async () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.()
    } else {
      await document.exitFullscreen?.()
    }
  }

  const handleQualityChange = (q: string) => {
    const v = videoRef.current
    if (!v) return
    const time = v.currentTime
    const wasPlaying = !v.paused
    setQuality(q)
    setShowQuality(false)
    // Reload with new quality
    v.src = applyCloudinaryTransform(src, q)
    v.currentTime = time
    if (wasPlaying) v.play()
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden bg-black group select-none"
      onMouseMove={showControlsTemporarily}
      onTouchStart={showControlsTemporarily}
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
    >
      {/* Invisible overlay to block direct video interaction */}
      <div
        className="absolute inset-0 z-10"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onContextMenu={(e) => e.preventDefault()}
      />

      <video
        ref={videoRef}
        className={`w-full bg-black pointer-events-none ${portrait ? "aspect-[9/16]" : "aspect-video"}`}
        style={portrait ? { objectFit: "cover" } : undefined}
        playsInline
        preload="metadata"
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        onTimeUpdate={() => {
          const v = videoRef.current
          if (!v) return
          setCurrentTime(v.currentTime)
          setProgress(v.duration ? v.currentTime / v.duration : 0)
        }}
        onLoadedMetadata={() => {
          const v = videoRef.current
          if (v) setDuration(v.duration)
        }}
        onEnded={() => setPlaying(false)}
      >
        <source src={applyCloudinaryTransform(src, quality)} type="video/mp4" />
      </video>

      {/* Title overlay */}
      {title && showControls && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent px-3 py-2 pointer-events-none">
          <p className="text-white text-[13px] font-medium truncate">{title}</p>
        </div>
      )}

      {/* Play button center overlay when paused */}
      {!playing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress bar */}
        <div className="px-3 pt-3">
          <div
            className="h-1 bg-white/20 rounded-full cursor-pointer group/prog relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-[#f8cf41] rounded-full relative"
              style={{ width: `${progress * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#f8cf41] opacity-0 group-hover/prog:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2">
          {/* Play/Pause */}
          <button onClick={togglePlay} className="text-white hover:text-[#f8cf41] transition-colors" aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="w-5 h-5" fill="white" /> : <Play className="w-5 h-5" fill="white" />}
          </button>

          {/* Time */}
          <span className="text-white text-[12px] tabular-nums min-w-[70px]">{fmt(currentTime)} / {fmt(duration)}</span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-1">
            <button onClick={toggleMute} className="text-white hover:text-[#f8cf41] transition-colors" aria-label={muted ? "Unmute" : "Mute"}>
              {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 accent-[#f8cf41] cursor-pointer"
              aria-label="Volume"
            />
          </div>

          {/* Quality selector */}
          <div className="relative">
            <button
              onClick={() => setShowQuality(!showQuality)}
              className="text-white hover:text-[#f8cf41] transition-colors"
              aria-label="Quality"
            >
              <Settings className="w-4 h-4" />
            </button>
            {showQuality && (
              <div className="absolute bottom-8 right-0 bg-black/90 backdrop-blur-sm rounded-lg py-1 min-w-[80px] shadow-lg">
                {QUALITY_LABELS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQualityChange(q)}
                    className={`w-full px-3 py-1.5 text-left text-[12px] hover:bg-white/10 transition-colors ${
                      quality === q ? "text-[#f8cf41] font-semibold" : "text-white"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white hover:text-[#f8cf41] transition-colors" aria-label="Fullscreen">
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

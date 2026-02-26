"use client"

import { useState } from "react"
import { X, ChevronRight, Video } from "lucide-react"
import { ProtectedVideo } from "./protected-video"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"

type VideoItem = {
  title: string
  titleEn: string
  url: string
}

/**
 * Floating "Watch videos" button + fullscreen drawer for mobile.
 * portrait: use 9:16 aspect ratio (exams/mathematicians TikTok style)
 */
export function VideoDrawerTrigger({
  videos,
  portrait = false,
}: {
  videos: VideoItem[]
  portrait?: boolean
}) {
  const [open, setOpen] = useState(false)
  const lang = useAppStore(s => s.language)
  const isEn = lang === "en"

  if (videos.length === 0) return null

  return (
    <>
      {/* Floating button - visible on mobile only, at the top of the content */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 w-full bg-[var(--ndolo-green)] text-white rounded-xl px-4 py-3 shadow-lg active:scale-[0.98] transition-transform"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Video className="w-4 h-4" />
        </div>
        <span className="flex-1 text-left text-[15px] font-semibold">
          {isEn ? "Watch videos" : "Voir en video"}
          <span className="text-white/60 text-[13px] font-normal ml-1">
            ({videos.length} {videos.length > 1 ? "videos" : "video"})
          </span>
        </span>
        <ChevronRight className="w-5 h-5 text-white/60" />
      </button>

      {/* Fullscreen drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-end lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="w-full bg-[var(--ndolo-green)] rounded-t-2xl max-h-[92dvh] flex flex-col animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#f8cf41]" />
                <h3 className="text-[17px] font-bold text-white">
                  {isEn ? "Video explanations" : "Explications en video"}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                aria-label={t("forum.close", lang)}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Video list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
              {videos.map((v, i) => (
                <div key={i}>
                  <p className="text-[14px] font-semibold text-white/80 mb-2">
                    {isEn ? v.titleEn : v.title}
                  </p>
                  <ProtectedVideo
                    src={v.url}
                    title={isEn ? v.titleEn : v.title}
                    portrait={portrait}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import { FileText, Video, Lightbulb } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { CLASSES } from "@/lib/data"
import { getExamVideos, getMathematicianVideos } from "@/lib/exam-videos"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProtectedVideo } from "./protected-video"
import { t } from "@/lib/i18n"

function TabBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 text-[15px] font-semibold transition-all duration-200 ${
        active
          ? "text-[#f8cf41] border-b-2 border-[#f8cf41]"
          : "text-white/60 hover:text-white border-b-2 border-transparent"
      }`}
    >
      {children}
    </button>
  )
}

function EmbeddedVideo({ title }: { title: string }) {
  const lang = useAppStore(s => s.language)
  return (
    <div className="bg-white/5 rounded-xl overflow-hidden">
      <div className="aspect-video bg-white/10 flex items-center justify-center">
        <p className="text-[14px] text-white/50 text-center px-2">{title} - {t("z4.videoSoon", lang)}</p>
      </div>
    </div>
  )
}

function VideoList({ count = 3, prefix = "Video" }: { count?: number; prefix?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <EmbeddedVideo key={i} title={`${prefix} ${i + 1}`} />
      ))}
    </div>
  )
}

function ChapterComplement({ classId, chapterIndex }: { classId: string; chapterIndex: number }) {
  const classInfo = CLASSES.find(c => c.id === classId)
  const lang = useAppStore(s => s.language)
  const [tab, setTab] = useState<"resume" | "videos">("resume")

  if (!classInfo) return null
  const chapter = classInfo.chapters[chapterIndex]

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-white/10">
        <TabBtn active={tab === "resume"} onClick={() => setTab("resume")}>
          <span className="flex items-center justify-center gap-1"><FileText className="w-4 h-4" />{t("z4.resume", lang)}</span>
        </TabBtn>
        <TabBtn active={tab === "videos"} onClick={() => setTab("videos")}>
          <span className="flex items-center justify-center gap-1"><Video className="w-4 h-4" />{t("z4.videos", lang)}</span>
        </TabBtn>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3">
          {tab === "resume" && (
            <div>
              <h3 className="text-[15px] font-bold text-white mb-2">{t("z4.resumeOf", lang)} {chapter}</h3>
              <p className="text-[15px] text-white/70 leading-relaxed">
                {t("z4.resumeSoon", lang)}
              </p>
              <div className="mt-3 flex flex-col gap-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-2 bg-white/10 rounded" style={{ width: `${85 - i * 15}%` }} />
                ))}
              </div>
            </div>
          )}
          {tab === "videos" && <VideoList prefix={chapter} />}
        </div>
      </ScrollArea>
    </div>
  )
}

function ExamComplement({ classId, year }: { classId: string; year: number }) {
  const classInfo = CLASSES.find(c => c.id === classId)
  const lang = useAppStore(s => s.language)
  const isEn = lang === "en"
  if (!classInfo) return null

  const videos = getExamVideos(classId, year)

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/10">
        <h3 className="text-[15px] font-bold text-white">{t("z4.subjectInVideo", lang)}</h3>
        <p className="text-[13px] text-white/50 mt-0.5">{classInfo.examLabel} {year}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 flex flex-col gap-3">
          {videos.length > 0 ? (
            videos.map((v, i) => (
              <div key={i}>
                <p className="text-[13px] font-semibold text-white/80 mb-1.5">{isEn ? v.titleEn : v.title}</p>
                <ProtectedVideo src={v.url} title={isEn ? v.titleEn : v.title} portrait />
              </div>
            ))
          ) : (
            <VideoList prefix={`${classInfo.examLabel} ${year}`} />
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function RevisionComplement() {
  const lang = useAppStore(s => s.language)
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/10">
        <h3 className="text-[15px] font-bold text-white flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-[#f8cf41]" />
          {t("z4.tipsTitle", lang)}
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3">
          <p className="text-[15px] text-white/70 leading-relaxed">
            {t("z4.tipsSoon", lang)}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {[t("z4.tip1", lang), t("z4.tip2", lang), t("z4.tip3", lang)].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-[15px] text-white/60">
                <span className="w-5 h-5 rounded-full bg-[#f8cf41]/20 flex items-center justify-center text-[12px] font-bold text-[#f8cf41] flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function MathematicianComplement({ name }: { name: string }) {
  const lang = useAppStore(s => s.language)
  const isEn = lang === "en"
  const videos = getMathematicianVideos(name)
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/10">
        <h3 className="text-[15px] font-bold text-white">{name}</h3>
        <p className="text-[13px] text-white/50 mt-0.5">{isEn ? "Biography video" : "Biographie en video"}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 flex flex-col gap-3">
          {videos.length > 0 ? (
            videos.map((v, i) => (
              <div key={i}>
                <p className="text-[13px] font-semibold text-white/80 mb-1.5">{isEn ? v.titleEn : v.title}</p>
                <ProtectedVideo src={v.url} title={isEn ? v.titleEn : v.title} portrait />
              </div>
            ))
          ) : (
            <p className="text-[15px] text-white/70 leading-relaxed">
              {t("z4.selectMathematician", lang)}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export function Zone4Panel() {
  const {
    activeTab, selectedClassId, language,
    selectedChapterId, selectedExamYear, selectedRevisionChapterId,
    zone2Section, selectedMathematician,
  } = useAppStore()
  const lang = language

  const content = (() => {
    if (activeTab === "classe" || activeTab === "tous") {
      if (zone2Section === "programme" && selectedChapterId !== null) {
        return <ChapterComplement classId={selectedClassId} chapterIndex={selectedChapterId} />
      }
      if (zone2Section === "sujets" && selectedExamYear !== null) {
        return <ExamComplement classId={selectedClassId} year={selectedExamYear} />
      }
      if (zone2Section === "revision" && selectedRevisionChapterId !== null) {
        return <RevisionComplement />
      }
    }
    if (activeTab === "mathematiciens" && selectedMathematician) {
      return <MathematicianComplement name={selectedMathematician} />
    }
    return null
  })()

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Lightbulb className="w-8 h-8 text-[#f8cf41]/50 mb-2" />
        <p className="text-[15px] text-white/50">{t("z4.selectElement", lang)}</p>
      </div>
    )
  }

  return <div className="h-full bg-[var(--ndolo-green)] text-white">{content}</div>
}

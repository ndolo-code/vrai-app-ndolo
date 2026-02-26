"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Star, ChevronDown, ChevronRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { CLASSES, getExamYears, getEvaluations } from "@/lib/data"
import type { FavoriteItem } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { t } from "@/lib/i18n"
import { autoTranslate } from "@/lib/auto-translate"

function FavStar({ item }: { item: FavoriteItem }) {
  const { favorites, addFavorite, removeFavorite, language } = useAppStore()
  const isFav = favorites.some(f => f.label === item.label)
  return (
    <button onClick={(e) => { e.stopPropagation(); isFav ? removeFavorite(item.label) : addFavorite(item) }}
      className="flex-shrink-0 hover:scale-110 transition-transform" aria-label={isFav ? t("z2.removeFavorite", language) : t("z2.addFavorite", language)}>
      <Star className={`w-4 h-4 ${isFav ? "fill-[#f8cf41] text-[#f8cf41]" : "text-white/30"}`} />
    </button>
  )
}

export function Zone2Panel() {
  const {
    activeTab, language,
    selectedChapterId, setSelectedChapterId,
    selectedExamYear, setSelectedExamYear,
    selectedRevisionChapterId, setSelectedRevisionChapterId,
    selectedEvaluationId, setSelectedEvaluationId,
    setLastVisited, setZone2Open,
  } = useAppStore()

  const lang = language
  const isEn = lang === "en"
  const at = (s: string) => isEn ? autoTranslate(s) : s
  const [search, setSearch] = useState("")
  const [openAccordion, setOpenAccordion] = useState<string | null>("programme")

  const classInfo = useMemo(() => CLASSES.find(c => c.id === "3e"), [])

  const filteredChapters = useMemo(() => {
    if (!classInfo) return []
    return classInfo.chapters.map((ch, i) => ({ name: ch, index: i })).filter(ch => ch.name.toLowerCase().includes(search.toLowerCase()))
  }, [classInfo, search])

  const filteredExamYears = useMemo(() => {
    if (!classInfo) return []
    return getExamYears(classInfo).filter(y => y.toString().includes(search))
  }, [classInfo, search])

  const evaluations = useMemo(() => {
    if (!classInfo) return []
    return getEvaluations("3e").filter(e => e.label.toLowerCase().includes(search.toLowerCase()))
  }, [classInfo, search])

  const closeMobile = () => setZone2Open(false)

  useEffect(() => {
    if (activeTab === "classe" && classInfo && selectedChapterId === null && !selectedEvaluationId && selectedExamYear === null && selectedRevisionChapterId === null) {
      setSelectedChapterId(0)
    }
  }, [activeTab, classInfo, selectedChapterId, selectedEvaluationId, selectedExamYear, selectedRevisionChapterId, setSelectedChapterId])


  if (activeTab === "classe" && classInfo) {
    const isExam = classInfo.type === "exam"
    return (
      <div className="flex flex-col h-full bg-[var(--ndolo-green)] text-white">
        <div className="p-3 border-b border-white/10">
          <h2 className="font-display font-bold text-[16px] mb-2">{t("z2.classOf", lang)} {classInfo.label}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("z2.search", lang)}
              className="pl-9 h-10 text-[15px] bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#f8cf41]" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {!isExam ? (
              <div className="flex flex-col gap-1">
                <AccordionSection title={t("z2.programme", lang)} isOpen={openAccordion === "programme"} onToggle={() => setOpenAccordion(openAccordion === "programme" ? null : "programme")}>
                  {filteredChapters.map((ch) => (
                    <button key={ch.index} onClick={() => { setSelectedChapterId(ch.index); setLastVisited("3e", ch.name); closeMobile() }}
                      className={`w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-[15px] transition-all ${
                        selectedChapterId === ch.index ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                      }`}>
                      <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[12px] font-bold flex-shrink-0">{ch.index + 1}</span>
                      <span className="flex-1 text-left leading-snug break-words">{at(ch.name)}</span>
                      <FavStar item={{ type: "chapter", classId: "3e", chapterIndex: ch.index, label: `3e-ch-${ch.name}` }} />
                    </button>
                  ))}
                </AccordionSection>
                <AccordionSection title={t("z2.evaluations", lang)} isOpen={openAccordion === "evaluations"} onToggle={() => setOpenAccordion(openAccordion === "evaluations" ? null : "evaluations")}>
                  {evaluations.map((ev) => (
                    <button key={ev.id} onClick={() => { setSelectedEvaluationId(ev.id); closeMobile() }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[15px] transition-all break-words leading-snug ${
                        selectedEvaluationId === ev.id ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                      }`}>{at(ev.label)}</button>
                  ))}
                </AccordionSection>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <AccordionSection title={t("z2.programme", lang)} isOpen={openAccordion === "programme"} onToggle={() => setOpenAccordion(openAccordion === "programme" ? null : "programme")}>
                  {filteredChapters.map((ch) => (
                    <button key={ch.index} onClick={() => { setSelectedChapterId(ch.index); setLastVisited("3e", ch.name); closeMobile() }}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[15px] transition-all ${
                        selectedChapterId === ch.index ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                      }`}>
                      <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[11px] font-bold flex-shrink-0">{ch.index + 1}</span>
                      <span className="flex-1 text-left leading-snug break-words">{at(ch.name)}</span>
                      <FavStar item={{ type: "chapter", classId: "3e", chapterIndex: ch.index, label: `3e-ch-${ch.name}` }} />
                    </button>
                  ))}
                </AccordionSection>
                <AccordionSection title={`${t("z2.subjects", lang)} ${classInfo.examLabel}`} isOpen={openAccordion === "sujets"} onToggle={() => setOpenAccordion(openAccordion === "sujets" ? null : "sujets")}>
                  {filteredExamYears.map((year) => (
                    <button key={year} onClick={() => { setSelectedExamYear(year); closeMobile() }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[15px] transition-all ${
                        selectedExamYear === year ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                      }`}>
                      <span>{classInfo.examLabel} {year}</span>
                      <FavStar item={{ type: "exam", classId: "3e", examYear: year, label: `3e-exam-${year}` }} />
                    </button>
                  ))}
                </AccordionSection>
                <AccordionSection title={t("z2.revisionByChapter", lang)} isOpen={openAccordion === "revision"} onToggle={() => setOpenAccordion(openAccordion === "revision" ? null : "revision")}>
                  {filteredChapters.map((ch) => (
                    <button key={ch.index} onClick={() => { setSelectedRevisionChapterId(ch.index); closeMobile() }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[15px] transition-all break-words leading-snug ${
                        selectedRevisionChapterId === ch.index ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                      }`}>{at(ch.name)}</button>
                  ))}
                </AccordionSection>
                <AccordionSection title={t("z2.evaluations", lang)} isOpen={openAccordion === "evaluations"} onToggle={() => setOpenAccordion(openAccordion === "evaluations" ? null : "evaluations")}>
                  {evaluations.map((ev) => (
                    <button key={ev.id} onClick={() => { setSelectedEvaluationId(ev.id); closeMobile() }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[15px] transition-all break-words leading-snug ${
                        selectedEvaluationId === ev.id ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                      }`}>{ev.label}</button>
                  ))}
                </AccordionSection>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return null

}

type AccordionProps = {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function AccordionSection({ title, isOpen, onToggle, children }: AccordionProps) {
  return (
    <div className="rounded-lg bg-white/5 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[15px] font-semibold text-white hover:bg-white/10 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen ? <div className="p-1 flex flex-col gap-1">{children}</div> : null}
    </div>
  )
}

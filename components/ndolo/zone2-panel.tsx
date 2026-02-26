"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Star, ChevronDown, ChevronRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { CLASSES, getExamYears, MATHEMATICIANS, STUDY_ADVICE_ITEMS, QUIZ_CATEGORIES, getEvaluations, isExamClass } from "@/lib/data"
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
    activeTab, selectedClassId, language,
    selectedChapterId, setSelectedChapterId,
    selectedExamYear, setSelectedExamYear,
    selectedRevisionChapterId, setSelectedRevisionChapterId,
    selectedMathematician, setSelectedMathematician,
    selectedAdviceItem, setSelectedAdviceItem,
    selectedQuizId, setSelectedQuizId,
    selectedEvaluationId, setSelectedEvaluationId,
    setLastVisited, setZone2Open,
  } = useAppStore()

  const lang = language
  const isEn = lang === "en"
  const at = (s: string) => isEn ? autoTranslate(s) : s
  const [search, setSearch] = useState("")
  const [openAccordion, setOpenAccordion] = useState<string | null>("programme")

  const classInfo = useMemo(() => CLASSES.find(c => c.id === selectedClassId), [selectedClassId])

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
    return getEvaluations(selectedClassId).filter(e => e.label.toLowerCase().includes(search.toLowerCase()))
  }, [classInfo, selectedClassId, search])

  const closeMobile = () => setZone2Open(false)

  useEffect(() => {
    if (activeTab === "classe" && classInfo && selectedChapterId === null && !selectedEvaluationId && selectedExamYear === null && selectedRevisionChapterId === null) {
      setSelectedChapterId(0)
    }
  }, [activeTab, classInfo, selectedChapterId, selectedEvaluationId, selectedExamYear, selectedRevisionChapterId, setSelectedChapterId])

  useEffect(() => {
    if (activeTab === "mathematiciens" && !selectedMathematician && MATHEMATICIANS.length > 0) {
      setSelectedMathematician(MATHEMATICIANS[0])
    }
  }, [activeTab, selectedMathematician, setSelectedMathematician])

  useEffect(() => {
    if (activeTab === "conseils" && !selectedAdviceItem && STUDY_ADVICE_ITEMS.length > 0) {
      setSelectedAdviceItem(STUDY_ADVICE_ITEMS[0].id)
    }
  }, [activeTab, selectedAdviceItem, setSelectedAdviceItem])

  useEffect(() => {
    if (activeTab === "quiz" && !selectedQuizId && QUIZ_CATEGORIES.length > 0) {
      setSelectedQuizId(QUIZ_CATEGORIES[0].id)
    }
  }, [activeTab, selectedQuizId, setSelectedQuizId])

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
                    <button key={ch.index} onClick={() => { setSelectedChapterId(ch.index); setLastVisited(selectedClassId, ch.name); closeMobile() }}
                      className={`w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-[15px] transition-all ${
                        selectedChapterId === ch.index ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                      }`}>
                      <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[12px] font-bold flex-shrink-0">{ch.index + 1}</span>
                      <span className="flex-1 text-left leading-snug break-words">{at(ch.name)}</span>
                      <FavStar item={{ type: "chapter", classId: selectedClassId, chapterIndex: ch.index, label: `${selectedClassId}-ch-${ch.name}` }} />
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
                    <button key={ch.index} onClick={() => { setSelectedChapterId(ch.index); setLastVisited(selectedClassId, ch.name); closeMobile() }}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[15px] transition-all ${
                        selectedChapterId === ch.index ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                      }`}>
                      <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[11px] font-bold flex-shrink-0">{ch.index + 1}</span>
                      <span className="flex-1 text-left leading-snug break-words">{at(ch.name)}</span>
                      <FavStar item={{ type: "chapter", classId: selectedClassId, chapterIndex: ch.index, label: `${selectedClassId}-ch-${ch.name}` }} />
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
                      <FavStar item={{ type: "exam", classId: selectedClassId, examYear: year, label: `${selectedClassId}-exam-${year}` }} />
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

  if (activeTab === "mathematiciens") {
    const filtered = MATHEMATICIANS.filter(m => m.toLowerCase().includes(search.toLowerCase()))
    const grouped: Record<string, string[]> = {}
    filtered.forEach(m => { const l = m.charAt(0).toUpperCase(); if (!grouped[l]) grouped[l] = []; grouped[l].push(m) })
    const letters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "fr"))
    return (
      <div className="flex flex-col h-full bg-[var(--ndolo-green)] text-white">
        <div className="p-3 border-b border-white/10">
          <h2 className="font-display font-bold text-[16px] mb-2">{t("nav.mathematiciens", lang)}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("z2.search", lang)}
              className="pl-9 h-10 text-[15px] bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#f8cf41]" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {letters.map(letter => (
              <div key={letter}>
                <p className="text-[12px] uppercase tracking-wider text-[#f8cf41] px-2 pt-2 pb-1 font-bold">{letter}</p>
                {grouped[letter].map((name) => (
                  <button key={name} onClick={() => { setSelectedMathematician(name); closeMobile() }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[15px] transition-all leading-snug ${
                      selectedMathematician === name ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                    }`}>
                    <span className="break-words flex-1 text-left">{name}</span>
                    <FavStar item={{ type: "mathematician", label: name }} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  if (activeTab === "conseils") {
    return (
      <div className="flex flex-col h-full bg-[var(--ndolo-green)] text-white">
        <div className="p-3 border-b border-white/10">
          <h2 className="font-display font-bold text-[16px]">{t("z2.studyTips", lang)}</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 flex flex-col gap-1">
            {STUDY_ADVICE_ITEMS.map((item) => (
              <button key={item.id} onClick={() => { setSelectedAdviceItem(item.id); closeMobile() }}
                className={`w-full flex items-center justify-between text-left px-3 py-3 rounded-lg text-[15px] font-medium transition-all ${
                  selectedAdviceItem === item.id ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                }`}>
                <span>{at(item.label)}</span>
                <FavStar item={{ type: "advice", label: item.id }} />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  if (activeTab === "quiz") {
    return (
      <div className="flex flex-col h-full bg-[var(--ndolo-green)] text-white">
        <div className="p-3 border-b border-white/10"><h2 className="font-display font-bold text-[16px]">{t("z2.quizGame", lang)}</h2></div>
        <ScrollArea className="flex-1">
          <div className="p-2 flex flex-col gap-1">
            {QUIZ_CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => { setSelectedQuizId(cat.id); closeMobile() }}
                className={`w-full flex items-center justify-between text-left px-3 py-3 rounded-lg transition-all ${
                  selectedQuizId === cat.id ? "bg-[#f8cf41] text-[var(--ndolo-green)]" : "text-white/90 hover:bg-[#e98c00] hover:text-white"
                }`}>
                <div>
                  <span className={`text-[15px] font-medium block ${selectedQuizId === cat.id ? "font-semibold" : ""}`}>{at(cat.label)}</span>
                  <span className={`text-[13px] ${selectedQuizId === cat.id ? "text-[var(--ndolo-green)]/70" : "text-white/50"}`}>{at(cat.description)}</span>
                </div>
                <FavStar item={{ type: "quiz", label: cat.id }} />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  if (activeTab === "tous") {
    const allChapters = CLASSES.filter(c => c.id === "3e").flatMap(c => c.chapters.map((ch, i) => ({ classId: c.id, classLabel: c.label, name: ch, index: i })))
      .filter(ch => ch.name.toLowerCase().includes(search.toLowerCase()))
    return (
      <div className="flex flex-col h-full bg-[var(--ndolo-green)] text-white">
        <div className="p-3 border-b border-white/10">
          <h2 className="font-display font-bold text-[16px] mb-2">{t("z2.allCourses", lang)}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("z2.searchChapter", lang)}
              className="pl-9 h-10 text-[15px] bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#f8cf41]" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {allChapters.map((ch, i) => (
              <button key={`${ch.classId}-${i}`} onClick={() => {
                useAppStore.getState().setSelectedClassId(ch.classId)
                useAppStore.getState().setActiveTab("classe")
                setSelectedChapterId(ch.index)
                closeMobile()
              }}
                className="w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-[15px] text-white/90 hover:bg-[#e98c00] hover:text-white transition-all">
                <span className="bg-white/10 px-2 py-0.5 rounded-md text-[12px] font-bold flex-shrink-0">{ch.classLabel}</span>
                <span className="flex-1 text-left leading-snug break-words">{at(ch.name)}</span>
                <FavStar item={{ type: "course", classId: ch.classId, chapterIndex: ch.index, label: `${ch.classId}-ch-${ch.name}` }} />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return null
}

function AccordionSection({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg text-[15px] font-semibold text-white/90 hover:bg-[#e98c00] hover:text-white transition-all">
        <span>{title}</span>
        {isOpen ? <ChevronDown className="w-5 h-5 text-[#f8cf41]" /> : <ChevronRight className="w-5 h-5 text-[#f8cf41]" />}
      </button>
      {isOpen && <div className="pl-1 flex flex-col gap-0.5">{children}</div>}
    </div>
  )
}

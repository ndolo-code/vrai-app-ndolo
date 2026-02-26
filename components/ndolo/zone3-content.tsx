"use client"

import { useState, useMemo } from "react"
import { BookOpen, HelpCircle, PenTool, CheckCircle, FileText, Trophy, RotateCcw, UserRound } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { CLASSES, QUIZ_CATEGORIES, STUDY_METHODS, INSPIRATIONAL_QUOTES, PRACTICAL_TIPS, generateChapterQuiz, MATHEMATICIANS_DATA, getEvaluations } from "@/lib/data"
  import { BAC_D_EXAMS } from "@/lib/bac-d-data"
  import { PROBATOIRE_A_EXAMS } from "@/lib/probatoire-a-data"
  import { getLocalBepcSubject, getLocalBepcCorrection } from "@/lib/bepc-local-data"
  import { getExamVideos, getMathematicianVideos } from "@/lib/exam-videos"
  import { VideoDrawerTrigger } from "./video-drawer"
  import { getEvaluationSections, getEvaluationSubjectCount } from "@/lib/evaluation-data"
  import type { ExamSection } from "@/lib/bac-d-data"
import type { QuizQuestion } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { LatexText } from "./latex-renderer"
import { t } from "@/lib/i18n"
import { useAutoText } from "./auto-text"
import { autoTranslate, translateBio } from "@/lib/auto-translate"

function useAt() {
  const lang = useAppStore(s => s.language)
  return { at: (s: string) => lang === "en" ? autoTranslate(s) : s, lang, isEn: lang === "en" }
}

function ContentPlaceholder({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  const lang = useAppStore(s => s.language)
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4"><Icon className="w-5 h-5 text-[var(--ndolo-green)]" /><h3 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px]">{title}</h3></div>
      <div className="bg-muted rounded-xl p-6">
        <p className="text-[20px] md:text-[21px] text-neutral-600 dark:text-neutral-300 leading-relaxed">{t("z3.contentSoon", lang)}</p>
        <div className="mt-4 flex flex-col gap-2">{[1,2,3].map(i => (<div key={i} className="h-3 bg-muted-foreground/10 rounded animate-pulse" style={{ width: `${90-i*15}%` }} />))}</div>
      </div>
    </div>
  )
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-2.5 text-[19px] font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
      active ? "border-[#f8cf41] text-[var(--ndolo-green)] bg-[#f8cf41]/10" : "border-transparent text-muted-foreground hover:text-foreground hover:border-[#e98c00]"
    }`}>{children}</button>
  )
}

// ===================== ALL-AT-ONCE QUIZ =====================
function AllAtOnceQuiz({ questions, title }: { questions: QuizQuestion[]; title: string }) {
  const { at, lang } = useAt()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    if (!submitted) return 0
    return questions.reduce((s, q, i) => s + (answers[i] === q.correctIndex ? 1 : 0), 0)
  }, [submitted, answers, questions])

  const handleSelect = (qi: number, oi: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qi]: oi }))
  }

  const allAnswered = Object.keys(answers).length === questions.length
  const handleSubmit = () => { if (allAnswered) setSubmitted(true) }
  const handleRestart = () => { setAnswers({}); setSubmitted(false) }

  if (submitted) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="p-4 md:p-6 overflow-y-auto">
        <div className="flex flex-col items-center py-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#f8cf41]/20 flex items-center justify-center mb-3"><Trophy className="w-8 h-8 text-[#f8cf41]" /></div>
          <h3 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-1">{title}</h3>
          <p className="text-[32px] font-bold text-[var(--ndolo-green)] my-1">{score}/{questions.length}</p>
          <p className="text-[19px] text-muted-foreground mb-2">{pct >= 80 ? t("z3.excellent", lang) : pct >= 50 ? t("z3.notBad", lang) : t("z3.reviewLessons", lang)}</p>
          <div className="w-full max-w-xs bg-muted rounded-full h-2.5 mb-4"><div className="h-2.5 rounded-full bg-[var(--ndolo-green)]" style={{ width: `${pct}%` }} /></div>
          <button onClick={handleRestart} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ndolo-green)] text-white text-[19px] font-semibold hover:bg-[#e98c00] transition-colors"><RotateCcw className="w-4 h-4" />{t("z3.restart", lang)}</button>
        </div>
        <div className="flex flex-col gap-6">
          {questions.map((q, qi) => {
            const isCorrect = answers[qi] === q.correctIndex
            return (
              <div key={qi} className={`rounded-xl p-4 border-2 ${isCorrect ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/10" : "border-red-500/50 bg-red-50 dark:bg-red-900/10"}`}>
                <p className="text-[19px] font-semibold text-foreground mb-2"><LatexText text={`${qi+1}. ${at(q.question)}`} className="inline" /></p>
                <div className="flex flex-col gap-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={`px-3 py-1.5 rounded-lg text-[19px] ${
                      oi === q.correctIndex ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold" :
                      oi === answers[qi] ? "bg-red-500/20 text-red-700 dark:text-red-400" : "text-muted-foreground"
                    }`}><LatexText text={`${String.fromCharCode(65+oi)}. ${at(opt)}`} /></div>
                  ))}
                </div>
                <p className="text-[18px] text-muted-foreground mt-2 italic"><LatexText text={at(q.explanation)} /></p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 overflow-y-auto">
      <h3 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-1">{title}</h3>
      <p className="text-[20px] md:text-[21px] text-neutral-600 dark:text-neutral-300 mb-4">{t("z3.answerAll", lang)}</p>
      <div className="flex flex-col gap-5">
        {questions.map((q, qi) => (
          <div key={qi} className="bg-muted rounded-xl p-4">
            <p className="text-[19px] font-semibold text-foreground mb-3"><LatexText text={`${qi+1}. ${at(q.question)}`} className="inline" /></p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => handleSelect(qi, oi)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-[19px] font-medium transition-all border-2 ${
                    answers[qi] === oi ? "border-[#f8cf41] bg-[#f8cf41]/15 text-foreground" : "border-transparent bg-background text-foreground hover:border-[#e98c00]"
                  }`}><LatexText text={`${String.fromCharCode(65+oi)}. ${at(opt)}`} /></button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center pb-4">
        <button onClick={handleSubmit} disabled={!allAnswered}
          className={`px-8 py-3 rounded-xl text-[20px] font-bold transition-colors ${
            allAnswered ? "bg-[var(--ndolo-green)] text-white hover:bg-[#e98c00]" : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}>{t("z3.validateAnswers", lang)} ({Object.keys(answers).length}/{questions.length})</button>
      </div>
    </div>
  )
}

// ===================== CHAPTER CONTENT =====================
function ChapterContent({ classId, chapterIndex }: { classId: string; chapterIndex: number }) {
  const { at, lang } = useAt()
  const classInfo = CLASSES.find(c => c.id === classId)
  const [tab, setTab] = useState<"lecons"|"quiz"|"exercices"|"corrections">("lecons")
  const [lessonTab, setLessonTab] = useState(0)
  if (!classInfo) return null
  const chapter = classInfo.chapters[chapterIndex]
  const chapterDisplay = at(chapter)
  const chapterQuiz = useMemo(() => generateChapterQuiz(chapter, classId), [chapter, classId])

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="border-b border-border px-4 pt-3 flex-shrink-0">
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-2 break-words">{chapterDisplay}</h2>
        <div className="flex gap-0 overflow-x-auto">
          {([["lecons",t("z3.lessons", lang),BookOpen],["quiz",t("z3.quiz", lang),HelpCircle],["exercices",t("z3.exercises", lang),PenTool],["corrections",t("z3.corrections", lang),CheckCircle]] as [string, string, React.ElementType][]).map(([id,label,Icon]) => (
            <TabButton key={id} active={tab===id as typeof tab} onClick={() => setTab(id as typeof tab)}>
              <span className="flex items-center gap-1.5"><Icon className="w-4 h-4" />{label}</span>
            </TabButton>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {tab === "lecons" && (
          <div>
            <div className="flex gap-1 p-3 border-b border-border bg-muted/30">
              {[`${t("z3.lesson", lang)} 1`,`${t("z3.lesson", lang)} 2`,`${t("z3.lesson", lang)} 3`].map((l,i) => (
                <button key={i} onClick={() => setLessonTab(i)} className={`px-3 py-1.5 rounded-full text-[19px] font-medium transition-all ${
                  lessonTab === i ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "bg-background text-muted-foreground hover:bg-[#e98c00] hover:text-white"
                }`}>{l}</button>
              ))}
            </div>
            <ContentPlaceholder title={`${t("z3.lesson", lang)} ${lessonTab+1} - ${chapterDisplay}`} icon={BookOpen} />
          </div>
        )}
        {tab === "quiz" && <AllAtOnceQuiz questions={chapterQuiz} title={`${t("z3.quiz", lang)} - ${chapterDisplay}`} />}
        {tab === "exercices" && <ContentPlaceholder title={`${t("z3.exercises", lang)} - ${chapterDisplay}`} icon={PenTool} />}
        {tab === "corrections" && <ContentPlaceholder title={`${t("z3.corrections", lang)} - ${chapterDisplay}`} icon={CheckCircle} />}
      </div>
    </div>
  )
}

function ExamSectionsRenderer({ sections }: { sections: ExamSection[] }) {
  const { at, lang } = useAt()
  const isEn = lang === "en"
  const getText = (s: ExamSection) => {
    if (isEn && s.en) return s.en
    return s.text ? at(s.text) : ""
  }
  const getTitle = (s: ExamSection) => {
    if (isEn && s.en) return s.en
    return s.title ? at(s.title) : ""
  }
  // Group consecutive images together for inline/grid display
  const groupedSections: (ExamSection | { type: "image-group"; images: ExamSection[] })[] = []
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].type === "image") {
      const images: ExamSection[] = [sections[i]]
      while (i + 1 < sections.length && sections[i + 1].type === "image") {
        i++
        images.push(sections[i])
      }
      if (images.length > 1) {
        groupedSections.push({ type: "image-group", images })
      } else {
        groupedSections.push(images[0])
      }
    } else {
      groupedSections.push(sections[i])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {groupedSections.map((s, i) => {
        if ("images" in s) {
          const count = s.images.length
          if (count <= 3) {
            return (
              <div key={i} className="flex flex-col md:flex-row gap-3 my-3 px-1 justify-center items-center">
                {s.images.map((img, j) => (
                  <div key={j} className="flex-1 min-w-0 flex justify-center">
                    <img src={img.src} alt={img.text || ""} className="max-w-full h-auto rounded-lg border border-border" crossOrigin="anonymous" />
                  </div>
                ))}
              </div>
            )
          }
          return (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-3 px-1">
              {s.images.map((img, j) => (
                <div key={j} className="flex justify-center">
                  <img src={img.src} alt={img.text || ""} className="max-w-full h-auto rounded-lg border border-border" crossOrigin="anonymous" />
                </div>
              ))}
            </div>
          )
        }
        const sec = s as ExamSection
        if (sec.type === "main") return <div key={i} className="bg-[#FFE2E2] dark:bg-pink-900/20 rounded-lg px-4 py-3 text-center"><h2 className="text-[22px] font-bold text-black dark:text-white">{getTitle(sec)}</h2></div>
        if (sec.type === "section") return <div key={i} className="bg-[#FEF9E1] dark:bg-yellow-900/20 rounded-lg px-4 py-2 flex justify-between items-baseline mt-3"><span className="text-[20px] font-bold text-black dark:text-white">{getTitle(sec)}</span>{sec.pts && <span className="text-[20px] font-bold text-[var(--ndolo-green)]">{sec.pts}</span>}</div>
        if (sec.type === "subsection") return <div key={i} className="bg-[#FDE4BE] dark:bg-orange-900/20 rounded-lg px-4 py-2 flex justify-between items-baseline mt-2"><span className="text-[19px] font-bold text-black dark:text-white">{getTitle(sec)}</span>{sec.pts && <span className="text-[19px] font-bold text-[var(--ndolo-green)]">{sec.pts}</span>}</div>
        if (sec.type === "exercise") return <div key={i} className="bg-[#F3FCFF] dark:bg-cyan-900/20 rounded-lg px-4 py-2 flex justify-between items-baseline mt-2"><span className="text-[20px] font-semibold text-black dark:text-white">{getTitle(sec)}</span>{sec.pts && <span className="text-[20px] font-bold text-[var(--ndolo-green)]">{sec.pts}</span>}</div>
        if (sec.type === "text" && sec.text) return <p key={i} className="text-[20px] md:text-[21px] text-black dark:text-white leading-relaxed px-1"><LatexText text={getText(sec)} /></p>
        if (sec.type === "table" && sec.text) return <div key={i} className="overflow-x-auto max-w-full px-1 my-2"><LatexText text={isEn && sec.en ? sec.en : sec.text} /></div>
        if (sec.type === "image" && sec.src) return <div key={i} className="flex justify-center my-3 px-1"><img src={sec.src} alt={sec.text || ""} className="max-w-full h-auto rounded-lg border border-border" crossOrigin="anonymous" /></div>
        return null
      })}
    </div>
  )
}

function ExamContent({ classId, year }: { classId: string; year: number }) {
  const lang = useAppStore(s => s.language)
  const classInfo = CLASSES.find(c => c.id === classId)
  const [tab, setTab] = useState<"sujet"|"correction">("sujet")
  if (!classInfo) return null
  const bepcSections = classId === "3e" ? getLocalBepcSubject(year) : null
  const bepcCorrectionSections = classId === "3e" ? getLocalBepcCorrection(year) : null
  const isBacD = classId === "TleD" && BAC_D_EXAMS[year]
  const bacDSections = isBacD ? BAC_D_EXAMS[year] : null
  const isProbaA = classId === "1ereA" && PROBATOIRE_A_EXAMS[year]
  const probaASections = isProbaA ? PROBATOIRE_A_EXAMS[year] : null
  const examVideos = getExamVideos(classId, year)

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="border-b border-border px-4 pt-3 flex-shrink-0">
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-2">{classInfo.examLabel} {year}</h2>
        <div className="flex gap-0">
          <TabButton active={tab==="sujet"} onClick={() => setTab("sujet")}><span className="flex items-center gap-1.5"><FileText className="w-4 h-4" />{t("z3.subject", lang)}</span></TabButton>
          <TabButton active={tab==="correction"} onClick={() => setTab("correction")}><span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" />{t("z3.correction", lang)}</span></TabButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Mobile video access button */}
        {examVideos.length > 0 && (
          <div className="px-4 pt-3">
            <VideoDrawerTrigger videos={examVideos} portrait />
          </div>
        )}
        {tab === "sujet" && (
          bepcSections ? (
            <div className="p-4 md:p-6"><ExamSectionsRenderer sections={bepcSections} /></div>
          ) : bacDSections ? (
            <div className="p-4 md:p-6"><ExamSectionsRenderer sections={bacDSections} /></div>
          ) : probaASections ? (
            <div className="p-4 md:p-6"><ExamSectionsRenderer sections={probaASections} /></div>
          ) : <ContentPlaceholder title={`${classInfo.examLabel} ${year} - ${t("z3.subject", lang)}`} icon={FileText} />
        )}
        {tab === "correction" && (
          bepcCorrectionSections ? (
            <div className="p-4 md:p-6"><ExamSectionsRenderer sections={bepcCorrectionSections} /></div>
          ) : <ContentPlaceholder title={`${classInfo.examLabel} ${year} - ${t("z3.correction", lang)}`} icon={CheckCircle} />
        )}
      </div>
    </div>
  )
}

function RevisionContent({ classId, chapterIndex }: { classId: string; chapterIndex: number }) {
  const { at, lang } = useAt()
  const classInfo = CLASSES.find(c => c.id === classId)
  const [tab, setTab] = useState<"exercices"|"corrections">("exercices")
  if (!classInfo) return null
  const chapter = classInfo.chapters[chapterIndex]
  const chapterDisplay = at(chapter)
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="border-b border-border px-4 pt-3 flex-shrink-0">
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-2">{t("z3.revision", lang)}: {chapterDisplay}</h2>
        <div className="flex gap-0">
          <TabButton active={tab==="exercices"} onClick={() => setTab("exercices")}><span className="flex items-center gap-1.5"><PenTool className="w-4 h-4" />{t("z3.exercises", lang)}</span></TabButton>
          <TabButton active={tab==="corrections"} onClick={() => setTab("corrections")}><span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" />{t("z3.corrections", lang)}</span></TabButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {tab === "exercices" && <ContentPlaceholder title={`${t("z3.revisionExercises", lang)} - ${chapterDisplay}`} icon={PenTool} />}
        {tab === "corrections" && <ContentPlaceholder title={`${t("z3.corrections", lang)} - ${chapterDisplay}`} icon={CheckCircle} />}
      </div>
    </div>
  )
}

// ===================== MATHEMATICIAN CONTENT =====================
function MathematicianContent({ name }: { name: string }) {
  const lang = useAppStore(s => s.language)
  const isEn = lang === "en"
  const mathData = MATHEMATICIANS_DATA.find(m => m.name === name)
  const isFemale = mathData?.gender === "F"
  const frenchBio = mathData?.bio || t("z3.biographyUnavailable", lang)
  const bioText = isEn ? (translateBio(name) || frenchBio) : frenchBio
  const mathVideos = getMathematicianVideos(name)
  return (
    <div className="p-4 md:p-6 overflow-y-auto">
      <div className="flex flex-col items-center mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${isFemale ? "bg-pink-100 dark:bg-pink-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}>
          <UserRound className={`w-10 h-10 ${isFemale ? "text-pink-600 dark:text-pink-400" : "text-blue-600 dark:text-blue-400"}`} />
        </div>
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] text-balance text-center">{name}</h2>
        <span className={`text-[13px] font-medium px-2 py-0.5 rounded-full mt-1 ${isFemale ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
          {isFemale ? t("z3.mathematicianF", lang) : t("z3.mathematician", lang)}
        </span>
      </div>
      {/* Mobile video access button for mathematician */}
      {mathVideos.length > 0 && (
        <div className="mb-4">
          <VideoDrawerTrigger videos={mathVideos} portrait />
        </div>
      )}
      <div className="bg-muted rounded-xl p-4">
        <h3 className="font-semibold text-black dark:text-white text-[22px] md:text-[24px] mb-2">{t("z3.biography", lang)}</h3>
        <p className="text-[20px] md:text-[21px] text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
          <LatexText text={bioText} />
        </p>
      </div>
    </div>
  )
}

function AdviceContent({ itemId }: { itemId: string }) {
  const { at, lang } = useAt()
  if (itemId === "methods") {
    return (
      <div className="p-4 md:p-6 overflow-y-auto">
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-4">{t("z3.studyMethods", lang)}</h2>
        <div className="flex flex-col gap-3">
          {STUDY_METHODS.map((m,i) => (
            <div key={i} className="bg-muted rounded-xl p-4"><div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[var(--ndolo-green)] text-white flex items-center justify-center text-[18px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-[20px] md:text-[21px] text-neutral-800 dark:text-neutral-200 leading-relaxed">{at(m)}</p>
            </div></div>
          ))}
        </div>
      </div>
    )
  }
  if (itemId === "quotes") {
    return (
      <div className="p-4 md:p-6 overflow-y-auto">
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-4">{t("z3.inspirationalQuotes", lang)}</h2>
        <div className="flex flex-col gap-3">
          {INSPIRATIONAL_QUOTES.map((q,i) => {
            const translated = at(q)
            const [text,author] = translated.includes(" - ") ? translated.split(" - ") : [translated,""]
            return (
              <div key={i} className="bg-muted rounded-xl p-4 border-l-4 border-[#f8cf41]">
              <p className="text-[20px] md:text-[21px] text-neutral-800 dark:text-neutral-200 leading-relaxed italic">{`"${text}"`}</p>
              {author && <p className="text-[18px] text-neutral-500 dark:text-neutral-400 mt-2 font-medium">{"- "+author}</p>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  if (itemId === "tips") {
    return (
      <div className="p-4 md:p-6 overflow-y-auto">
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-4">{t("z3.practicalTips", lang)}</h2>
        <div className="flex flex-col gap-3">
          {PRACTICAL_TIPS.map((tItem,i) => (
            <div key={i} className="flex items-start gap-3 bg-muted rounded-xl p-4">
              <span className="w-7 h-7 rounded-full bg-[#f8cf41] text-[var(--ndolo-green)] flex items-center justify-center text-[18px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-[20px] md:text-[21px] text-neutral-800 dark:text-neutral-200 leading-relaxed">{at(tItem)}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return <ContentPlaceholder title={t("nav.shortConseils", lang)} icon={BookOpen} />
}

function QuizGameContent({ quizId }: { quizId: string }) {
  const { at } = useAt()
  const quiz = QUIZ_CATEGORIES.find(q => q.id === quizId)
  if (!quiz) return null
  return <AllAtOnceQuiz questions={quiz.questions} title={at(quiz.label)} />
}

function QuizLanding() {
  const { at, lang } = useAt()
  const setSelectedQuizId = useAppStore(s => s.setSelectedQuizId)
  return (
    <div className="p-4 md:p-6 overflow-y-auto">
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-1">{t("z2.quizGame", lang)}</h2>
        <p className="text-[20px] md:text-[21px] text-neutral-600 dark:text-neutral-300 mb-6">{t("z3.chooseCategory", lang)}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUIZ_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setSelectedQuizId(cat.id)}
            className="flex flex-col gap-1 p-4 rounded-xl bg-muted text-left hover:bg-[#e98c00] hover:text-white transition-all group">
              <span className="text-[21px] font-bold text-black dark:text-white group-hover:text-white">{at(cat.label)}</span>
              <span className="text-[19px] text-neutral-600 dark:text-neutral-300 group-hover:text-white/80">{at(cat.description)}</span>
            <span className="text-[13px] text-muted-foreground/60 group-hover:text-white/60 mt-1">{cat.questions.length} {t("z3.questions", lang)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function EvaluationContent({ classId, evaluationId }: { classId: string; evaluationId: string }) {
  const { at, lang } = useAt()
  const classInfo = CLASSES.find(c => c.id === classId)
  const evals = getEvaluations(classId)
  const evalItem = evals.find(e => e.id === evaluationId)
  const [activeSujet, setActiveSujet] = useState(0)
  const [subTab, setSubTab] = useState<"epreuve" | "correction">("epreuve")

  if (!classInfo || !evalItem) return null

  const subjectCount = getEvaluationSubjectCount(classId, evaluationId)
  const subjects = Array.from({ length: subjectCount }, (_, i) => `${t("z3.sujet", lang)} ${i + 1}`)
  const evalSections = getEvaluationSections(classId, evaluationId, activeSujet)

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="border-b border-border px-4 pt-3 flex-shrink-0">
        <h2 className="font-display font-bold text-black dark:text-white text-[22px] md:text-[24px] mb-2">{at(evalItem.label)}</h2>
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {subjects.map((label, i) => (
            <TabButton key={i} active={activeSujet === i} onClick={() => { setActiveSujet(i); setSubTab("epreuve") }}>
              {label}
            </TabButton>
          ))}
        </div>
      </div>
      <div className="border-b border-border px-4 flex-shrink-0">
        <div className="flex gap-0">
          <TabButton active={subTab === "epreuve"} onClick={() => setSubTab("epreuve")}>
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" />{t("z3.epreuve", lang)}</span>
          </TabButton>
          <TabButton active={subTab === "correction"} onClick={() => setSubTab("correction")}>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" />{t("z3.correction", lang)}</span>
          </TabButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {subTab === "epreuve" && (
          evalSections ? (
            <div className="p-4 md:p-6"><ExamSectionsRenderer sections={evalSections} /></div>
          ) : (
            <ContentPlaceholder title={`${evalItem.label} - ${subjects[activeSujet]} - ${t("z3.epreuve", lang)}`} icon={FileText} />
          )
        )}
        {subTab === "correction" && (
          <ContentPlaceholder title={`${evalItem.label} - ${subjects[activeSujet]} - ${t("z3.correction", lang)}`} icon={CheckCircle} />
        )}
      </div>
    </div>
  )
}

export function Zone3Content() {
  const { activeTab, selectedClassId, selectedChapterId, selectedExamYear, selectedRevisionChapterId, zone2Section, selectedMathematician, selectedAdviceItem, selectedQuizId, selectedEvaluationId, language } = useAppStore()
  const lang = language

  if (activeTab === "classe") {
  if (zone2Section === "programme" && selectedChapterId !== null) return <ChapterContent classId={selectedClassId} chapterIndex={selectedChapterId} />
  if (zone2Section === "sujets" && selectedExamYear !== null) return <ExamContent classId={selectedClassId} year={selectedExamYear} />
  if (zone2Section === "revision" && selectedRevisionChapterId !== null) return <RevisionContent classId={selectedClassId} chapterIndex={selectedRevisionChapterId} />
  if (selectedEvaluationId) return <EvaluationContent classId={selectedClassId} evaluationId={selectedEvaluationId} />
  }
  if (activeTab === "mathematiciens" && selectedMathematician) return <MathematicianContent name={selectedMathematician} />
  if (activeTab === "conseils" && selectedAdviceItem) return <AdviceContent itemId={selectedAdviceItem} />
  if (activeTab === "quiz") { if (selectedQuizId) return <QuizGameContent quizId={selectedQuizId} />; return <QuizLanding /> }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5"><BookOpen className="w-10 h-10 text-muted-foreground" /></div>
  <h3 className="font-display font-bold text-black dark:text-white text-[24px] md:text-[28px] mb-3">{t("z3.welcomeTitle", lang)}</h3>
  <p className="text-[20px] md:text-[22px] text-neutral-600 dark:text-neutral-300 max-w-md leading-relaxed">{t("z3.welcomeDesc", lang)}</p>
    </div>
  )
}

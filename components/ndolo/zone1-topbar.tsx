"use client"

import { useState, useRef, useEffect } from "react"
import { Moon, Sun, User, GraduationCap, Users, BookHeart, Gamepad2, Library, Menu, Clock, CalendarDays, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { CLASSES, getExamCountdown, getExamLabel, isExamClass } from "@/lib/data"
import type { TopbarTab } from "@/lib/data"
import { t } from "@/lib/i18n"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"

function ExamDatePicker({ classId, onClose }: { classId: string; onClose: () => void }) {
  const { examDate, setExamDate, language } = useAppStore()
  const label = getExamLabel(classId)
  const ref = useRef<HTMLDivElement>(null)
  const lang = language

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  return (
    <div ref={ref} className="absolute top-full mt-2 right-0 z-50 bg-background border border-border rounded-xl shadow-xl p-4 min-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[15px] font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[var(--ndolo-green)]" />
          {t("nav.examDate", lang)} {label}
        </h4>
        <button onClick={onClose} className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
      </div>
      <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
        {t("nav.setExamDate", lang)} {label} {t("nav.setExamDateSuffix", lang)}
      </p>
      <input
        type="date"
        value={examDate || ""}
        onChange={(e) => setExamDate(e.target.value || null)}
        min={new Date().toISOString().slice(0, 10)}
        className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-foreground text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--ndolo-green)] focus:border-transparent"
      />
      {examDate && (
        <button onClick={() => { setExamDate(null); onClose() }}
          className="mt-2 w-full py-2 rounded-lg bg-destructive/10 text-destructive text-[13px] font-medium hover:bg-destructive/20 transition-colors">
          {t("nav.deleteDate", lang)}
        </button>
      )}
    </div>
  )
}

export function Zone1Topbar() {
  const { activeTab, setActiveTab, selectedClassId, setSelectedClassId, darkMode, toggleDarkMode, user, setAccountDrawerOpen, setZone2Open, examDate, language, toggleLanguage } = useAppStore()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const lang = language

  const countdown = getExamCountdown(selectedClassId, examDate)
  const examLabel = getExamLabel(selectedClassId)
  const showExamClass = isExamClass(selectedClassId)
  const registeredClass = user?.registeredClass || "6e"
  const classLabel = CLASSES.find(c => c.id === registeredClass)?.label || registeredClass

  const NAV_ITEMS: { id: TopbarTab; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { id: "classe", label: t("nav.classe", lang), shortLabel: t("nav.classe", lang), icon: GraduationCap },
    { id: "mathematiciens", label: t("nav.mathematiciens", lang), shortLabel: t("nav.shortMaths", lang), icon: Users },
    { id: "conseils", label: t("nav.conseils", lang), shortLabel: t("nav.shortConseils", lang), icon: BookHeart },
    { id: "quiz", label: t("nav.quiz", lang), shortLabel: "Quiz", icon: Gamepad2 },
    { id: "tous", label: t("nav.tous", lang), shortLabel: t("nav.shortCours", lang), icon: Library },
  ]

  const goToClass = () => {
    setSelectedClassId(registeredClass)
    setActiveTab("classe")
  }

  return (
    <TooltipProvider delayDuration={200}>
      <header className="bg-[var(--ndolo-green)] border-b border-white/10 flex-shrink-0 z-30" role="banner">
        {/* Main bar */}
        <div className="flex items-center h-12 px-2 md:px-3 gap-2">
          {/* Mobile menu */}
          <button onClick={() => setZone2Open(true)} className="md:hidden w-9 h-9 rounded-lg bg-[#f8cf41] text-[var(--ndolo-green)] flex items-center justify-center flex-shrink-0 animate-menu-pulse" aria-label={t("nav.openMenu", lang)}>
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <span className="text-white font-display font-bold text-[15px] flex-shrink-0">Ndolomath</span>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-4 flex-1" aria-label={lang === "fr" ? "Navigation principale" : "Main navigation"}>
            {NAV_ITEMS.map((item) => {
              if (item.id === "classe") {
                return (
                  <button key={item.id} onClick={goToClass} title={`${lang === "fr" ? "Revenir a ma classe" : "Back to my class"} : ${classLabel}`}
                    className={`px-3 py-1.5 rounded-lg text-[15px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      activeTab === "classe" ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/80 hover:bg-[#e98c00] hover:text-white"
                    }`}>
                    <item.icon className="w-4 h-4" />{classLabel}
                  </button>
                )
              }
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[15px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === item.id ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-semibold" : "text-white/80 hover:bg-[#e98c00] hover:text-white"
                  }`}>
                  <item.icon className="w-4 h-4" />{item.label}
                </button>
              )
            })}

            {showExamClass && (
              <div className="relative ml-2">
                <button onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`px-3 py-1 rounded-lg text-[14px] font-bold flex items-center gap-1.5 transition-all ${
                    countdown ? "bg-[#f8cf41]/20 text-[#f8cf41] hover:bg-[#f8cf41]/30" : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}>
                  <Clock className="w-3.5 h-3.5" />
                  {countdown ? `${countdown.label} ${countdown.days}${lang === "fr" ? "j" : "d"}` : `${examLabel} : ${t("nav.examCountdown", lang)}`}
                </button>
                {showDatePicker && <ExamDatePicker classId={selectedClassId} onClose={() => setShowDatePicker(false)} />}
              </div>
            )}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1.5 ml-auto">
            {showExamClass && (
              <div className="lg:hidden relative">
                <button onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`px-2 py-1 rounded-md text-[12px] font-bold flex items-center gap-1 ${
                    countdown ? "bg-[#f8cf41]/20 text-[#f8cf41]" : "bg-white/10 text-white/60"
                  }`}>
                  <Clock className="w-3 h-3" />
                  {countdown ? `${countdown.label} ${countdown.days}${lang === "fr" ? "j" : "d"}` : `${examLabel}`}
                </button>
                {showDatePicker && <ExamDatePicker classId={selectedClassId} onClose={() => setShowDatePicker(false)} />}
              </div>
            )}

            {/* Language toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleLanguage} className="w-9 h-9 rounded-lg flex items-center justify-center text-[#f8cf41] hover:bg-[#e98c00] hover:text-white transition-colors font-bold text-[13px]"
                  aria-label={lang === "fr" ? "Switch to English" : "Passer en francais"}>
                  {lang === "fr" ? "FR" : "EN"}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-card text-card-foreground border-border text-[14px]">
                {t(lang === "fr" ? "lang.fr" : "lang.en", lang)}
              </TooltipContent>
            </Tooltip>

            <button onClick={toggleDarkMode} className="w-9 h-9 rounded-lg flex items-center justify-center text-[#f8cf41] hover:bg-[#e98c00] hover:text-white transition-colors" aria-label={darkMode ? t("nav.lightMode", lang) : t("nav.darkMode", lang)}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setAccountDrawerOpen(true)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-white/15 text-white hover:bg-[#e98c00] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#f8cf41] flex items-center justify-center"><User className="w-4 h-4 text-[var(--ndolo-green)]" /></div>
              <span className="text-[15px] font-medium hidden sm:inline max-w-[80px] truncate">{user?.name || t("nav.account", lang)}</span>
            </button>
          </div>
        </div>

        {/* Mobile nav icons */}
        <nav className="lg:hidden flex items-center justify-around px-2 pb-1.5 pt-0.5" aria-label={lang === "fr" ? "Navigation mobile" : "Mobile navigation"}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id
            if (item.id === "classe") {
              return (
                <button key={item.id} onClick={goToClass} title={`${lang === "fr" ? "Revenir a ma classe" : "Back to my class"} : ${classLabel}`}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                    isActive ? "bg-[#f8cf41] text-[var(--ndolo-green)]" : "text-white/70 hover:text-white"
                  }`}>
                  <item.icon className="w-5 h-5" />
                  <span className={`text-[11px] leading-tight font-medium ${isActive ? "font-semibold" : ""}`}>{classLabel}</span>
                </button>
              )
            }
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                  isActive ? "bg-[#f8cf41] text-[var(--ndolo-green)]" : "text-white/70 hover:text-white"
                }`}>
                <item.icon className="w-5 h-5" />
                <span className={`text-[11px] leading-tight font-medium ${isActive ? "font-semibold" : ""}`}>{item.shortLabel}</span>
              </button>
            )
          })}
        </nav>
      </header>
    </TooltipProvider>
  )
}

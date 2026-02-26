"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon, Clock, Tag } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { getExamCountdown, getExamLabel, isExamClass } from "@/lib/data"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/local-client"
import { t, type Language } from "@/lib/i18n"

interface CalEvent {
  id: string
  title: string
  description: string
  event_date: string
  color: string
  category: string
}

function getCategories(lang: Language) {
  return [
    { id: "examen", label: t("cal.catExam", lang), color: "#ef4444" },
    { id: "devoir", label: t("cal.catHomework", lang), color: "#f97316" },
    { id: "revision", label: t("cal.catRevision", lang), color: "#3b82f6" },
    { id: "personnel", label: t("cal.catPersonal", lang), color: "#f8cf41" },
    { id: "autre", label: t("cal.catOther", lang), color: "#8b5cf6" },
  ]
}

const MONTH_NAMES_FR = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]
const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAY_NAMES_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const DAY_NAMES_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function CalendarModal() {
  const { openModal, setOpenModal, selectedClassId, isAuthenticated, examDate, setExamDate, language } = useAppStore()
  const lang = language
  const CATEGORIES = getCategories(lang)
  const MONTH_NAMES = lang === "fr" ? MONTH_NAMES_FR : MONTH_NAMES_EN
  const DAY_NAMES = lang === "fr" ? DAY_NAMES_FR : DAY_NAMES_EN
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [events, setEvents] = useState<CalEvent[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState("personnel")
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7

  const days = useMemo(() => {
    const arr: (number | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(d)
    return arr
  }, [daysInMonth, firstDayOfWeek])

  const getDateStr = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
  const todayStr = new Date().toISOString().slice(0, 10)

  // Fetch events from Supabase
  const fetchEvents = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const localClient = createClient()
      const { data: { session } } = await localClient.auth.getSession()
      if (!session) { setLoading(false); return }
      const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`
      const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${daysInMonth}`
      const { data, error } = await localClient
        .from("calendar_events")
        .select("*")
        .gte("event_date", startDate)
        .lte("event_date", endDate)
        .order("event_date", { ascending: true })
      if (!error && data) {
        setEvents(data as CalEvent[])
      } else if (error) {
        console.log("[v0] Calendar fetch error:", error.message)
      }
    } catch { /* offline fallback */ }
    setLoading(false)
  }, [year, month, daysInMonth, isAuthenticated])

  useEffect(() => {
    if (openModal === "calendar") fetchEvents()
  }, [openModal, fetchEvents])

  const eventsForDate = (d: number) => events.filter(e => e.event_date === getDateStr(d))
  const selectedEvents = selectedDate ? events.filter(e => e.event_date === selectedDate) : []

  const handleAdd = async () => {
    if (!newTitle.trim() || !selectedDate) return
    const cat = CATEGORIES.find(c => c.id === newCategory)
    try {
      const localClient = createClient()
      // Use getSession for reliability (getUser makes a network call that can fail)
      const { data: { session } } = await localClient.auth.getSession()
      if (!session?.user) {
        console.log("[v0] Calendar add: no session found")
        return
      }
      const { data, error } = await localClient.from("calendar_events").insert({
        user_id: session.user.id,
        title: newTitle.trim(),
        description: "",
        event_date: selectedDate,
        color: cat?.color || "#f8cf41",
        category: newCategory,
      }).select().single()
      if (error) {
        console.log("[v0] Calendar insert error:", error.message)
        return
      }
      if (data) {
        setEvents(prev => [...prev, data as CalEvent])
        setNewTitle("")
        setShowAddForm(false)
      }
    } catch (err) {
      console.log("[v0] Calendar add catch:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const localClient = createClient()
      await localClient.from("calendar_events").delete().eq("id", id)
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch { /* offline */ }
  }

  const countdown = getExamCountdown(selectedClassId, examDate)

  const getCatColor = (category: string) => CATEGORIES.find(c => c.id === category)?.color || "#f8cf41"

  return (
    <Dialog open={openModal === "calendar"} onOpenChange={(open) => !open && setOpenModal(null)}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2 border-b border-border flex-shrink-0">
          <DialogTitle className="font-display text-foreground text-[16px] flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[var(--ndolo-green)]" />
            {t("cal.title", lang)}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 flex flex-col gap-4">
            {/* Exam countdown / date setter */}
            {isExamClass(selectedClassId) && (
              <div className="bg-[var(--ndolo-green)] text-white rounded-xl px-4 py-3">
                {countdown ? (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#f8cf41] flex-shrink-0" />
                    <span className="text-[15px] font-medium flex-1">{countdown.label} :</span>
                    <span className="text-[22px] font-bold text-[#f8cf41]">{countdown.days}j</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] text-white/80">{t("cal.setExamDate", lang)} {getExamLabel(selectedClassId)} :</p>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="date"
                    value={examDate || ""}
                    onChange={(e) => setExamDate(e.target.value || null)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="flex-1 h-9 px-3 rounded-lg border border-white/20 bg-white/10 text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-[#f8cf41]"
                  />
                  {examDate && (
                    <button onClick={() => setExamDate(null)} className="text-[12px] text-white/60 hover:text-white underline">
                      {t("cal.clear", lang)}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground hover:bg-[var(--ndolo-green)] hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="text-[17px] font-bold text-foreground">{MONTH_NAMES[month]} {year}</h3>
              <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground hover:bg-[var(--ndolo-green)] hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[12px] font-semibold text-muted-foreground py-1.5">{d}</div>
              ))}
              {days.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />
                const dateStr = getDateStr(day)
                const dayEvents = eventsForDate(day)
                const hasEvents = dayEvents.length > 0
                const isSelected = selectedDate === dateStr
                const isToday = dateStr === todayStr
                const isPast = dateStr < todayStr

                return (
                  <button
                    key={i}
                    onClick={() => { setSelectedDate(dateStr); setShowAddForm(false) }}
                    className={`relative flex flex-col items-center py-2 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-bold shadow-sm ring-2 ring-[#f8cf41]/50"
                        : isToday
                          ? "bg-[var(--ndolo-green)] text-white font-bold"
                          : isPast
                            ? "text-muted-foreground/60 hover:bg-muted"
                            : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {day}
                    {hasEvents && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map((evt, ei) => (
                          <span key={ei} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCatColor(evt.category) }} />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Selected date events */}
            {selectedDate && (
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[15px] font-bold text-foreground">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString(lang === "fr" ? "fr" : "en", { weekday: "long", day: "numeric", month: "long" })}
                  </h4>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ndolo-green)] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t("cal.add", lang)}
                  </button>
                </div>

                {/* Add form */}
                {showAddForm && (
                  <div className="bg-muted/50 rounded-xl p-3 mb-3 flex flex-col gap-2.5 border border-border">
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={t("cal.eventPlaceholder", lang)}
                      className="text-[15px] h-10 bg-background"
                      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setNewCategory(cat.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all border ${
                            newCategory === cat.id
                              ? "border-foreground/30 bg-background shadow-sm"
                              : "border-transparent bg-muted hover:bg-background"
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                          {cat.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleAdd}
                      disabled={!newTitle.trim()}
                      className="w-full py-2 rounded-lg bg-[var(--ndolo-green)] text-white text-[14px] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {t("cal.save", lang)}
                    </button>
                  </div>
                )}

                {/* Events list */}
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground text-[14px]">{t("cal.loading", lang)}</div>
                ) : selectedEvents.length === 0 && !showAddForm ? (
                  <p className="text-[14px] text-muted-foreground text-center py-3">{t("cal.noEvents", lang)}</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {selectedEvents.map((evt) => (
                      <div key={evt.id} className="flex items-center gap-3 bg-muted px-3 py-2.5 rounded-xl group">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getCatColor(evt.category) }} />
                        <div className="flex-1 min-w-0">
                          <span className="text-[15px] text-foreground font-medium block truncate">{evt.title}</span>
                          <span className="text-[12px] text-muted-foreground capitalize">{CATEGORIES.find(c => c.id === evt.category)?.label || evt.category}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(evt.id)}
                          className="text-destructive/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                          aria-label={t("cal.delete", lang)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Category legend */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[12px] text-muted-foreground">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

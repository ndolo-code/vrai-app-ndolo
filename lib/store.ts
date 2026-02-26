"use client"

import { create } from "zustand"
import type { TopbarTab } from "./data"
import type { Language } from "./i18n"

export interface CalendarEvent { id: string; date: string; title: string }
export interface ForumMessage { id: string; classId: string; author: string; text: string; timestamp: string }
export interface FavoriteItem { type: "chapter"|"exam"|"mathematician"|"advice"|"quiz"|"course"; classId?: string; chapterIndex?: number; label: string; examYear?: number }
export interface GradeEntry { subject: string; note: number; coef: number }
export interface SchoolGoal { id: string; text: string; done: boolean }
export interface GradeObjective { id: string; text: string }

export interface UserData {
  name: string; email: string; role: string; country: string; phone: string; registeredClass: string
}

export interface AppState {
  isAuthenticated: boolean
  user: UserData | null
  login: (user: UserData) => void
  logout: () => void
  updateUser: (partial: Partial<UserData>) => void

  darkMode: boolean
  toggleDarkMode: () => void

  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void

  activeTab: TopbarTab
  setActiveTab: (tab: TopbarTab) => void

  selectedClassId: string
  setSelectedClassId: (id: string) => void

  selectedChapterId: number | null
  setSelectedChapterId: (id: number | null) => void
  selectedExamYear: number | null
  setSelectedExamYear: (year: number | null) => void
  selectedRevisionChapterId: number | null
  setSelectedRevisionChapterId: (id: number | null) => void
  zone2Section: "programme" | "sujets" | "revision" | null
  setZone2Section: (s: "programme" | "sujets" | "revision" | null) => void

  selectedMathematician: string | null
  setSelectedMathematician: (m: string | null) => void
  selectedAdviceItem: string | null
  setSelectedAdviceItem: (id: string | null) => void
  selectedQuizId: string | null
  setSelectedQuizId: (id: string | null) => void

  openModal: string | null
  setOpenModal: (m: string | null) => void

  accountDrawerOpen: boolean
  setAccountDrawerOpen: (open: boolean) => void
  accountSubView: string | null
  setAccountSubView: (v: string | null) => void

  favorites: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (label: string) => void
  isFavorite: (label: string) => boolean

  unlocks: Record<string, boolean>
  unlockClass: (classId: string) => void

  lastVisited: { classId: string; chapter: string; chapterIndex?: number; date: string } | null
  setLastVisited: (classId: string, chapter: string, chapterIndex?: number) => void

  calendarEvents: CalendarEvent[]
  addCalendarEvent: (evt: Omit<CalendarEvent, "id">) => void
  removeCalendarEvent: (id: string) => void

  forumMessages: ForumMessage[]
  addForumMessage: (msg: Omit<ForumMessage, "id" | "timestamp">) => void

  zone2Open: boolean
  setZone2Open: (open: boolean) => void

  objective: string
  setObjective: (o: string) => void

  gradeObjectives: GradeObjective[]
  addGradeObjective: (text: string) => void
  removeGradeObjective: (id: string) => void
  updateGradeObjective: (id: string, text: string) => void

  grades: GradeEntry[]
  setGrades: (g: GradeEntry[]) => void

  schoolGoals: SchoolGoal[]
  addSchoolGoal: (text: string) => void
  toggleSchoolGoal: (id: string) => void
  removeSchoolGoal: (id: string) => void

  examDate: string | null // ISO date string e.g. "2026-07-10"
  setExamDate: (d: string | null) => void

  selectedEvaluationId: string | null
  setSelectedEvaluationId: (id: string | null) => void

  navigateToFavorite: (item: FavoriteItem) => void
  navigateToLastVisited: () => void
}

const load = <T,>(key: string, fb: T): T => {
  if (typeof window === "undefined") return fb
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb } catch { return fb }
}
const save = (key: string, value: unknown) => {
  if (typeof window === "undefined") return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* */ }
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: load("ndolo_auth", false),
  user: load("ndolo_user", null),
  login: (user) => { save("ndolo_auth", true); save("ndolo_user", user); set({ isAuthenticated: true, user, selectedClassId: user.registeredClass || "6e" }) },
  logout: () => {
    save("ndolo_auth", false); save("ndolo_user", null); set({ isAuthenticated: false, user: null })
    // Sign out from Supabase (async, fire-and-forget)
    if (typeof window !== "undefined") {
      import("@/lib/supabase/client").then(({ createClient }) => {
        createClient().auth.signOut().catch(() => {})
      })
    }
  },
  updateUser: (partial) => {
    const current = get().user
    if (!current) return
    const updated = { ...current, ...partial }
    save("ndolo_user", updated)
    set({ user: updated })
  },

  darkMode: load("ndolo_dark", false),
  toggleDarkMode: () => set((s) => { const n = !s.darkMode; save("ndolo_dark", n); return { darkMode: n } }),

  language: load<Language>("ndolo_lang", "fr"),
  setLanguage: (lang) => { save("ndolo_lang", lang); set({ language: lang }) },
  toggleLanguage: () => set((s) => { const n: Language = s.language === "fr" ? "en" : "fr"; save("ndolo_lang", n); return { language: n } }),

  activeTab: "classe",
  setActiveTab: (tab) => set({ activeTab: tab, selectedChapterId: null, selectedExamYear: null, selectedRevisionChapterId: null, zone2Section: null, selectedMathematician: null, selectedAdviceItem: null, selectedQuizId: null, selectedEvaluationId: null }),

  selectedClassId: load("ndolo_user", null)?.registeredClass || "6e",
  setSelectedClassId: (id) => set({ selectedClassId: id, selectedChapterId: null, selectedExamYear: null, selectedRevisionChapterId: null, zone2Section: null, selectedEvaluationId: null }),

  selectedChapterId: null,
  setSelectedChapterId: (id) => set({ selectedChapterId: id, selectedExamYear: null, selectedRevisionChapterId: null, selectedEvaluationId: null, zone2Section: "programme" }),
  selectedExamYear: null,
  setSelectedExamYear: (year) => set({ selectedExamYear: year, selectedChapterId: null, selectedRevisionChapterId: null, selectedEvaluationId: null, zone2Section: "sujets" }),
  selectedRevisionChapterId: null,
  setSelectedRevisionChapterId: (id) => set({ selectedRevisionChapterId: id, selectedChapterId: null, selectedExamYear: null, selectedEvaluationId: null, zone2Section: "revision" }),
  zone2Section: null,
  setZone2Section: (s) => set({ zone2Section: s }),

  selectedMathematician: null,
  setSelectedMathematician: (m) => set({ selectedMathematician: m }),
  selectedAdviceItem: null,
  setSelectedAdviceItem: (id) => set({ selectedAdviceItem: id }),
  selectedQuizId: null,
  setSelectedQuizId: (id) => set({ selectedQuizId: id }),

  openModal: null,
  setOpenModal: (m) => set({ openModal: m }),
  accountDrawerOpen: false,
  setAccountDrawerOpen: (open) => set({ accountDrawerOpen: open }),
  accountSubView: null,
  setAccountSubView: (v) => set({ accountSubView: v }),

  favorites: load<FavoriteItem[]>("ndolo_favs2", []),
  addFavorite: (item) => set((s) => { const f = [...s.favorites, item]; save("ndolo_favs2", f); return { favorites: f } }),
  removeFavorite: (label) => set((s) => { const f = s.favorites.filter(x => x.label !== label); save("ndolo_favs2", f); return { favorites: f } }),
  isFavorite: (label) => get().favorites.some(f => f.label === label),

  unlocks: load("ndolo_unlocks", {}),
  unlockClass: (classId) => set((s) => { const u = { ...s.unlocks, [classId]: true }; save("ndolo_unlocks", u); return { unlocks: u } }),

  lastVisited: load("ndolo_last", null),
  setLastVisited: (classId, chapter, chapterIndex) => { const e = { classId, chapter, chapterIndex, date: new Date().toISOString() }; save("ndolo_last", e); set({ lastVisited: e }) },

  calendarEvents: load<CalendarEvent[]>("ndolo_cal_events", []),
  addCalendarEvent: (evt) => set((s) => { const n = { ...evt, id: Date.now().toString() }; const events = [...s.calendarEvents, n]; save("ndolo_cal_events", events); return { calendarEvents: events } }),
  removeCalendarEvent: (id) => set((s) => { const events = s.calendarEvents.filter(e => e.id !== id); save("ndolo_cal_events", events); return { calendarEvents: events } }),

  forumMessages: load<ForumMessage[]>("ndolo_forum", []),
  addForumMessage: (msg) => set((s) => { const n = { ...msg, id: Date.now().toString(), timestamp: new Date().toISOString() }; const msgs = [...s.forumMessages, n]; save("ndolo_forum", msgs); return { forumMessages: msgs } }),

  zone2Open: false,
  setZone2Open: (open) => set({ zone2Open: open }),

  objective: load("ndolo_objective", "Avoir 16/20 en mathematiques"),
  setObjective: (o) => { save("ndolo_objective", o); set({ objective: o }) },

  gradeObjectives: load<GradeObjective[]>("ndolo_grade_objectives", [
    { id: "go1", text: "Avoir 16/20 en mathematiques" },
  ]),
  addGradeObjective: (text) => set((s) => {
    const list = [...s.gradeObjectives, { id: Date.now().toString(), text }]
    save("ndolo_grade_objectives", list)
    return { gradeObjectives: list }
  }),
  removeGradeObjective: (id) => set((s) => {
    const list = s.gradeObjectives.filter(g => g.id !== id)
    save("ndolo_grade_objectives", list)
    return { gradeObjectives: list }
  }),
  updateGradeObjective: (id, text) => set((s) => {
    const list = s.gradeObjectives.map(g => g.id === id ? { ...g, text } : g)
    save("ndolo_grade_objectives", list)
    return { gradeObjectives: list }
  }),

  examDate: load<string | null>("ndolo_exam_date", null),
  setExamDate: (d) => { save("ndolo_exam_date", d); set({ examDate: d }) },

  selectedEvaluationId: null,
  setSelectedEvaluationId: (id) => set({ selectedEvaluationId: id, selectedChapterId: null, selectedExamYear: null, selectedRevisionChapterId: null, zone2Section: null }),

  schoolGoals: load<SchoolGoal[]>("ndolo_goals", [
    { id: "g1", text: "Reviser chaque chapitre avant les examens", done: false },
    { id: "g2", text: "Faire tous les exercices du manuel", done: false },
    { id: "g3", text: "Obtenir au moins 14/20 au prochain devoir", done: false },
  ]),
  addSchoolGoal: (text) => set((s) => {
    const goals = [...s.schoolGoals, { id: Date.now().toString(), text, done: false }]
    save("ndolo_goals", goals)
    return { schoolGoals: goals }
  }),
  toggleSchoolGoal: (id) => set((s) => {
    const goals = s.schoolGoals.map(g => g.id === id ? { ...g, done: !g.done } : g)
    save("ndolo_goals", goals)
    return { schoolGoals: goals }
  }),
  removeSchoolGoal: (id) => set((s) => {
    const goals = s.schoolGoals.filter(g => g.id !== id)
    save("ndolo_goals", goals)
    return { schoolGoals: goals }
  }),

  grades: load<GradeEntry[]>("ndolo_grades", [
    { subject: "Maths", note: 0, coef: 4 },
    { subject: "Physique", note: 0, coef: 3 },
    { subject: "SVT", note: 0, coef: 2 },
    { subject: "Francais", note: 0, coef: 3 },
    { subject: "Anglais", note: 0, coef: 2 },
    { subject: "Histoire-Geo", note: 0, coef: 2 },
  ]),
  setGrades: (g) => { save("ndolo_grades", g); set({ grades: g }) },

  navigateToFavorite: (item) => {
    const s = get()
    if ((item.type === "chapter" || item.type === "course") && item.classId !== undefined && item.chapterIndex !== undefined) {
      s.setActiveTab("classe"); s.setSelectedClassId(item.classId); s.setSelectedChapterId(item.chapterIndex)
    } else if (item.type === "exam" && item.classId && item.examYear) {
      s.setActiveTab("classe"); s.setSelectedClassId(item.classId); s.setSelectedExamYear(item.examYear)
    } else if (item.type === "mathematician") {
      s.setActiveTab("mathematiciens"); s.setSelectedMathematician(item.label)
    } else if (item.type === "advice") {
      s.setActiveTab("conseils"); s.setSelectedAdviceItem(item.label)
    } else if (item.type === "quiz") {
      s.setActiveTab("quiz"); s.setSelectedQuizId(item.label)
    }
    set({ accountDrawerOpen: false })
  },

  navigateToLastVisited: () => {
    const s = get()
    const lv = s.lastVisited
    if (!lv) return
    s.setActiveTab("classe")
    s.setSelectedClassId(lv.classId)
    if (lv.chapterIndex !== undefined) s.setSelectedChapterId(lv.chapterIndex)
    set({ accountDrawerOpen: false })
  },
}))

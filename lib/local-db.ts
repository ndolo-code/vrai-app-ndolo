"use client"

export interface LocalUser {
  id: string
  email: string
  name: string
  role: string
  country: string
  phone: string
  registered_class: string
  password: string
}

export interface LocalCalendarEvent {
  id: string
  user_id: string
  title: string
  description: string
  event_date: string
  color: string
  category: string
  created_at: string
}

export interface LocalForumPost {
  id: string
  user_id: string
  class_id: string
  content: string
  author_name: string
  created_at: string
}

export interface LocalReport {
  id: string
  reporter_id: string
  post_id: string
  reason: string
  created_at: string
}

type LocalDB = {
  users: LocalUser[]
  profiles: Array<{
    id: string
    full_name: string
    role: string
    country: string
    phone: string
    registered_class: string
  }>
  calendar_events: LocalCalendarEvent[]
  posts: LocalForumPost[]
  reports: LocalReport[]
  settings: Record<string, unknown>
  goals: unknown[]
  progress: Record<string, unknown>
  bookmarks: unknown[]
  history: unknown[]
}

const DB_KEY = "ndolo_local_db_v1"
const AUTH_KEY = "ndolo_local_auth_user_v1"

const DEMO_USER: LocalUser = {
  id: "local-demo-user",
  email: "demo@ndolomath.local",
  name: "mba verlaine",
  role: "eleve",
  country: "Cameroun",
  phone: "",
  registered_class: "3e",
  password: "123456",
}

function nowIso() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getDefaultDB(): LocalDB {
  return {
    users: [DEMO_USER],
    profiles: [{
      id: DEMO_USER.id,
      full_name: DEMO_USER.name,
      role: DEMO_USER.role,
      country: DEMO_USER.country,
      phone: DEMO_USER.phone,
      registered_class: DEMO_USER.registered_class,
    }],
    calendar_events: [],
    posts: [],
    reports: [],
    settings: {},
    goals: [],
    progress: {},
    bookmarks: [],
    history: [],
  }
}

export function loadLocalDB(): LocalDB {
  if (typeof window === "undefined") return getDefaultDB()
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) return getDefaultDB()
    const parsed = JSON.parse(raw) as Partial<LocalDB>
    return { ...getDefaultDB(), ...parsed }
  } catch {
    return getDefaultDB()
  }
}

export function saveLocalDB(db: LocalDB) {
  if (typeof window === "undefined") return
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export function getUser() {
  if (typeof window === "undefined") return DEMO_USER
  const authUserId = localStorage.getItem(AUTH_KEY) || DEMO_USER.id
  const db = loadLocalDB()
  return db.users.find((u) => u.id === authUserId) || DEMO_USER
}

export function setCurrentUser(userId: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_KEY, userId)
}

export function resetCurrentUser() {
  setCurrentUser(DEMO_USER.id)
}

export function ensureProfileForUser(user: LocalUser) {
  const db = loadLocalDB()
  const hasProfile = db.profiles.some((p) => p.id === user.id)
  if (!hasProfile) {
    db.profiles.push({
      id: user.id,
      full_name: user.name,
      role: user.role,
      country: user.country,
      phone: user.phone,
      registered_class: user.registered_class,
    })
    saveLocalDB(db)
  }
}

export function createLocalUser(email: string, password: string, name: string, role: string, country: string, phone: string, registered_class: string): LocalUser {
  const db = loadLocalDB()
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existing) return existing
  const user: LocalUser = {
    id: uid("user"),
    email,
    name,
    role,
    country,
    phone,
    registered_class,
    password,
  }
  db.users.push(user)
  db.profiles.push({
    id: user.id,
    full_name: user.name,
    role: user.role,
    country: user.country,
    phone: user.phone,
    registered_class: user.registered_class,
  })
  saveLocalDB(db)
  return user
}

export function updateLocalUserPassword(userId: string, password: string) {
  const db = loadLocalDB()
  db.users = db.users.map((u) => (u.id === userId ? { ...u, password } : u))
  saveLocalDB(db)
}

export function loadSettings() {
  return loadLocalDB().settings
}
export function saveSettings(settings: Record<string, unknown>) {
  const db = loadLocalDB()
  db.settings = settings
  saveLocalDB(db)
}

export function loadGoals() {
  return loadLocalDB().goals
}
export function saveGoals(goals: unknown[]) {
  const db = loadLocalDB()
  db.goals = goals
  saveLocalDB(db)
}

export function loadCalendarEvents() {
  return loadLocalDB().calendar_events
}
export function saveCalendarEvents(events: LocalCalendarEvent[]) {
  const db = loadLocalDB()
  db.calendar_events = events
  saveLocalDB(db)
}

export function loadProgress() {
  return loadLocalDB().progress
}
export function saveProgress(progress: Record<string, unknown>) {
  const db = loadLocalDB()
  db.progress = progress
  saveLocalDB(db)
}

export function loadBookmarks() {
  return loadLocalDB().bookmarks
}
export function saveBookmarks(bookmarks: unknown[]) {
  const db = loadLocalDB()
  db.bookmarks = bookmarks
  saveLocalDB(db)
}

export function loadHistory() {
  return loadLocalDB().history
}
export function saveHistory(history: unknown[]) {
  const db = loadLocalDB()
  db.history = history
  saveLocalDB(db)
}

export function makeRow<T extends Record<string, unknown>>(prefix: string, row: T): T & { id: string; created_at: string } {
  return {
    id: (row.id as string) || uid(prefix),
    created_at: (row.created_at as string) || nowIso(),
    ...row,
  }
}

"use client"

import {
  createLocalUser,
  ensureProfileForUser,
  getUser,
  loadLocalDB,
  makeRow,
  resetCurrentUser,
  saveLocalDB,
  setCurrentUser,
  updateLocalUserPassword,
} from "@/lib/local-db"

type AnyRow = Record<string, any>
type Filter = { type: "eq" | "gte" | "lte"; field: string; value: any }
type Order = { field: string; ascending: boolean }

type ChannelHandler = {
  channelName: string
  event: "INSERT" | "DELETE"
  table: string
  filter?: string
  callback: (payload: any) => void
}

const handlers: ChannelHandler[] = []

function parseFilter(filter?: string) {
  // class_id=eq.3e
  if (!filter) return null
  const match = filter.match(/^([^=]+)=eq\.(.+)$/)
  if (!match) return null
  return { field: match[1], value: match[2] }
}

function emitTableEvent(table: string, event: "INSERT" | "DELETE", payload: any) {
  handlers
    .filter((h) => h.table === table && h.event === event)
    .forEach((h) => {
      const parsed = parseFilter(h.filter)
      if (parsed && payload?.new?.[parsed.field] !== parsed.value && payload?.old?.[parsed.field] !== parsed.value) return
      h.callback(payload)
    })
}

class SelectBuilder {
  private table: string
  private filters: Filter[] = []
  private orderBy: Order | null = null
  private limitCount: number | null = null

  constructor(table: string) {
    this.table = table
  }

  eq(field: string, value: any) { this.filters.push({ type: "eq", field, value }); return this }
  gte(field: string, value: any) { this.filters.push({ type: "gte", field, value }); return this }
  lte(field: string, value: any) { this.filters.push({ type: "lte", field, value }); return this }
  order(field: string, opts?: { ascending?: boolean }) { this.orderBy = { field, ascending: opts?.ascending ?? true }; return this }
  limit(count: number) { this.limitCount = count; return this }

  private run() {
    const db = loadLocalDB() as Record<string, AnyRow[]>
    let rows = [...(db[this.table] || [])]

    for (const f of this.filters) {
      rows = rows.filter((r) => {
        const v = r[f.field]
        if (f.type === "eq") return v === f.value
        if (f.type === "gte") return v >= f.value
        if (f.type === "lte") return v <= f.value
        return true
      })
    }

    if (this.orderBy) {
      const { field, ascending } = this.orderBy
      rows.sort((a, b) => {
        if (a[field] === b[field]) return 0
        return ascending ? (a[field] > b[field] ? 1 : -1) : (a[field] < b[field] ? 1 : -1)
      })
    }

    if (this.limitCount !== null) rows = rows.slice(0, this.limitCount)
    return rows
  }

  async single() {
    const rows = this.run()
    return { data: rows[0] || null, error: null as any }
  }

  then<TResult1 = { data: AnyRow[]; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: AnyRow[]; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return Promise.resolve({ data: this.run(), error: null as any }).then(onfulfilled, onrejected)
  }
}

class InsertBuilder {
  private table: string
  private payload: AnyRow | AnyRow[]
  private returnSingle = false

  constructor(table: string, payload: AnyRow | AnyRow[]) {
    this.table = table
    this.payload = payload
  }

  select() { return this }
  single() { this.returnSingle = true; return this.exec() }

  private async exec() {
    const db = loadLocalDB() as Record<string, AnyRow[]>
    const rows = Array.isArray(this.payload) ? this.payload : [this.payload]
    const prepared = rows.map((r) => makeRow(this.table, r))
    db[this.table] = [...(db[this.table] || []), ...prepared]
    saveLocalDB(db as any)

    for (const row of prepared) emitTableEvent(this.table, "INSERT", { new: row })

    if (this.returnSingle) return { data: prepared[0] || null, error: null as any }
    return { data: prepared, error: null as any }
  }

  then<TResult1 = { data: AnyRow[]; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: AnyRow[]; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.exec().then(onfulfilled, onrejected)
  }
}

class UpdateDeleteBuilder {
  private table: string
  private mode: "update" | "delete"
  private updates: AnyRow
  private filters: Filter[] = []

  constructor(table: string, mode: "update" | "delete", updates: AnyRow = {}) {
    this.table = table
    this.mode = mode
    this.updates = updates
  }

  eq(field: string, value: any) { this.filters.push({ type: "eq", field, value }); return this.exec() }

  private async exec() {
    const db = loadLocalDB() as Record<string, AnyRow[]>
    const current = db[this.table] || []

    const isMatch = (r: AnyRow) => this.filters.every((f) => r[f.field] === f.value)

    if (this.mode === "update") {
      const next = current.map((r) => (isMatch(r) ? { ...r, ...this.updates } : r))
      db[this.table] = next
      saveLocalDB(db as any)
      return { data: null, error: null as any }
    }

    const toDelete = current.filter((r) => isMatch(r))
    db[this.table] = current.filter((r) => !isMatch(r))
    saveLocalDB(db as any)
    for (const row of toDelete) emitTableEvent(this.table, "DELETE", { old: row })
    return { data: null, error: null as any }
  }
}

function tableApi(table: string) {
  return {
    select: (_cols?: string) => new SelectBuilder(table),
    insert: (payload: AnyRow | AnyRow[]) => new InsertBuilder(table, payload),
    update: (payload: AnyRow) => new UpdateDeleteBuilder(table, "update", payload),
    delete: () => new UpdateDeleteBuilder(table, "delete"),
  }
}

export function createClient() {
  return {
    auth: {
      async getSession() {
        const u = getUser()
        return { data: { session: { user: { id: u.id, email: u.email, user_metadata: { full_name: u.name } } } }, error: null as any }
      },
      async getUser() {
        const u = getUser()
        return { data: { user: { id: u.id, email: u.email, user_metadata: { full_name: u.name } } }, error: null as any }
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const db = loadLocalDB()
        const found = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!found || (found.password && found.password !== password)) {
          return { data: { user: null }, error: { message: "Invalid login credentials" } as any }
        }
        setCurrentUser(found.id)
        return { data: { user: { id: found.id, email: found.email, user_metadata: { full_name: found.name } } }, error: null as any }
      },
      async signUp({ email, password, options }: { email: string; password: string; options?: any }) {
        const meta = options?.data || {}
        const newUser = createLocalUser(email, password, meta.full_name || "Utilisateur", meta.role || "eleve", meta.country || "Cameroun", meta.phone || "", meta.registered_class || "3e")
        ensureProfileForUser(newUser)
        setCurrentUser(newUser.id)
        return { data: { user: { id: newUser.id, email: newUser.email, user_metadata: { full_name: newUser.name } } }, error: null as any }
      },
      async resetPasswordForEmail(_email: string, _opts?: any) {
        return { data: {}, error: null as any }
      },
      async updateUser({ password }: { password?: string }) {
        const u = getUser()
        if (password) updateLocalUserPassword(u.id, password)
        return { data: { user: { id: u.id, email: u.email } }, error: null as any }
      },
      async signOut() {
        resetCurrentUser()
        return { error: null as any }
      },
    },
    from: (table: string) => tableApi(table),
    channel(name: string) {
      const channelName = name
      return {
        on(_type: "postgres_changes", cfg: { event: "INSERT" | "DELETE"; table: string; filter?: string }, callback: (payload: any) => void) {
          handlers.push({ channelName, event: cfg.event, table: cfg.table, filter: cfg.filter, callback })
          return this
        },
        subscribe() {
          return { channelName }
        },
      }
    },
    removeChannel(channel: { channelName: string }) {
      for (let i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i].channelName === channel.channelName) handlers.splice(i, 1)
      }
    },
  }
}

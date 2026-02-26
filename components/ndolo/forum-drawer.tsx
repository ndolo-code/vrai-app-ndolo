"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, Send, Maximize2, Minimize2, WifiOff, MessageSquare, Flag, AlertTriangle, Loader2, Users } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { CLASSES } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { t } from "@/lib/i18n"

interface ForumPost {
  id: string
  user_id: string
  class_id: string
  content: string
  author_name: string
  created_at: string
}

export function ForumDrawer() {
  const { user, forumDrawerOpen, setForumDrawerOpen, language } = useAppStore()
  const lang = language
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set())
  const [reportingId, setReportingId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const registeredClass = user?.registeredClass || "6e"
  const classLabel = CLASSES.find(c => c.id === registeredClass)?.label || registeredClass

  // Online/offline detection
  useEffect(() => {
    const on = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener("online", on)
    window.addEventListener("offline", off)
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off) }
  }, [])

  // Load posts and subscribe to realtime
  useEffect(() => {
    if (!forumDrawerOpen || !isOnline) return
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null

    const fetchPosts = async () => {
      setLoading(true)
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("class_id", registeredClass)
        .order("created_at", { ascending: true })
        .limit(200)
      if (data) setPosts(data)
      setLoading(false)
      setTimeout(() => scrollToBottom(), 100)
    }

    fetchPosts()

    // Subscribe to realtime inserts
    channel = supabase
      .channel(`forum-${registeredClass}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "posts",
        filter: `class_id=eq.${registeredClass}`,
      }, (payload) => {
        const newPost = payload.new as ForumPost
        setPosts(prev => [...prev, newPost])
        setTimeout(() => scrollToBottom(), 50)
      })
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "posts",
        filter: `class_id=eq.${registeredClass}`,
      }, (payload) => {
        setPosts(prev => prev.filter(p => p.id !== payload.old.id))
      })
      .subscribe()

    return () => { if (channel) supabase.removeChannel(channel) }
  }, [forumDrawerOpen, registeredClass, isOnline])

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [])

  const handleSend = async () => {
    if (!text.trim() || !user || sending) return
    const content = text.trim()
    if (content.length > 500) return
    setSending(true)
    setText("")

    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { setSending(false); return }

      await supabase.from("posts").insert({
        user_id: authUser.id,
        class_id: registeredClass,
        content,
        author_name: user.name,
      })
    } catch {
      setText(content) // restore on error
    }
    setSending(false)
    inputRef.current?.focus()
  }

  const handleReport = async (postId: string) => {
    if (reportedIds.has(postId)) return
    setReportingId(postId)
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return
      await supabase.from("reports").insert({
        reporter_id: authUser.id,
        post_id: postId,
        reason: "inappropriate",
      })
      setReportedIds(prev => new Set(prev).add(postId))
    } catch { /* duplicate or error */ }
    setReportingId(null)
  }

  const formatTime = (ts: string) => {
    const d = new Date(ts)
    return d.toLocaleString(lang === "fr" ? "fr" : "en", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })
  }

  if (!forumDrawerOpen) return null

  const drawerClass = isFullscreen
    ? "fixed inset-0 z-[60]"
    : "fixed inset-y-0 right-0 z-[60] w-full sm:w-[420px] md:w-[480px]"

  return (
    <>
      {/* Backdrop */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-[59] bg-black/40" onClick={() => setForumDrawerOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`${drawerClass} bg-background border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[var(--ndolo-green)] text-white flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <MessageSquare className="w-5 h-5 text-[#f8cf41] flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="font-display font-bold text-[17px] truncate">{t("forum.title", lang)} - {classLabel}</h2>
              <p className="text-[12px] text-white/60">{posts.length} {posts.length !== 1 ? t("forum.messages", lang) : t("forum.message", lang)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={isFullscreen ? t("forum.reduce", lang) : t("forum.fullscreen", lang)}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={() => { setForumDrawerOpen(false); setIsFullscreen(false) }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={t("forum.close", lang)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Class info bar */}
        <div className="px-4 py-2 bg-muted border-b border-border flex items-center gap-2 flex-shrink-0">
          <Users className="w-4 h-4 text-[var(--ndolo-green)]" />
          <span className="text-[13px] text-muted-foreground">
            {t("forum.classDiscussion", lang)} <strong className="text-foreground">{classLabel}</strong>
          </span>
        </div>

        {/* Messages area */}
        {!isOnline ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <WifiOff className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-[17px] font-bold text-foreground">{t("forum.offlineTitle", lang)}</p>
            <p className="text-[14px] text-muted-foreground">{t("forum.offlineDesc", lang)}</p>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[var(--ndolo-green)] animate-spin" />
              <span className="text-[14px] text-muted-foreground">{t("forum.loading", lang)}</span>
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {posts.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
                <p className="text-[15px] text-muted-foreground">{t("forum.noMessages", lang)}</p>
                <p className="text-[13px] text-muted-foreground/60">{t("forum.beFirst", lang)} {classLabel} !</p>
              </div>
            )}
            {posts.map((post) => {
              const isOwn = post.author_name === user?.name
              return (
                <div key={post.id} className={`group relative max-w-[85%] ${isOwn ? "self-end" : "self-start"}`}>
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    isOwn
                      ? "bg-[var(--ndolo-green)] text-white rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {!isOwn && (
                      <p className={`text-[12px] font-bold mb-0.5 ${isOwn ? "text-[#f8cf41]" : "text-[var(--ndolo-green)]"}`}>
                        {post.author_name}
                      </p>
                    )}
                    <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">{post.content}</p>
                    <p className={`text-[11px] mt-1 ${isOwn ? "text-white/50 text-right" : "text-muted-foreground/60"}`}>
                      {formatTime(post.created_at)}
                    </p>
                  </div>
                  {/* Report button for other users' messages */}
                  {!isOwn && (
                    <button
                      onClick={() => handleReport(post.id)}
                      disabled={reportedIds.has(post.id) || reportingId === post.id}
                      className="absolute -right-2 top-1 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-background border border-border shadow flex items-center justify-center transition-opacity"
                      aria-label={t("forum.report", lang)}
                    >
                      {reportedIds.has(post.id)
                        ? <AlertTriangle className="w-3 h-3 text-amber-500" />
                        : <Flag className="w-3 h-3 text-muted-foreground" />
                      }
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Input bar */}
        {isOnline && (
          <div className="px-4 py-3 border-t border-border bg-background flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 500))}
                placeholder={t("forum.writePlaceholder", lang)}
                className="text-[15px] h-10 flex-1"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={!isOnline || sending}
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() || sending}
                className="w-10 h-10 rounded-lg bg-[var(--ndolo-green)] text-white flex items-center justify-center hover:bg-[#e98c00] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t("forum.send", lang)}
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 text-right">{text.length}/500</p>
          </div>
        )}
      </div>
    </>
  )
}

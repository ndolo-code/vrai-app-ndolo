"use client"

import { useState, useRef, useEffect } from "react"
import { Target, Star, FileText, MessageSquare, Mail, User, Settings, LogOut, ChevronLeft, Pencil, Save, Plus, Trash2, Clock, Info, Volume2, VolumeX, Check, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react"
import { useAppStore, type GradeEntry, type UserData } from "@/lib/store"
import { CLASSES, COUNTRY_PHONE_CODES, COUNTRIES } from "@/lib/data"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/local-client"
import { t, type Language } from "@/lib/i18n"
import { autoTranslate } from "@/lib/auto-translate"

function ProfileView({ user, classLabel, updateUser, editingProfile, setEditingProfile, profileDraft, setProfileDraft, lang }: {
  user: UserData | null
  classLabel: string
  updateUser: (partial: Partial<UserData>) => void
  editingProfile: boolean
  setEditingProfile: (v: boolean) => void
  profileDraft: { name: string; email: string; phone: string; country: string }
  setProfileDraft: React.Dispatch<React.SetStateAction<{ name: string; email: string; phone: string; country: string }>>
  lang: Language
}) {
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [pwError, setPwError] = useState("")
  const [pwSuccess, setPwSuccess] = useState("")
  const [pwLoading, setPwLoading] = useState(false)
  const [showMaskedPw, setShowMaskedPw] = useState(false)

  const handleChangePassword = async () => {
    setPwError("")
    setPwSuccess("")
    if (currentPw.length < 6) { setPwError(t("account.pwCurrentTooShort", lang)); return }
    if (newPw.length < 6) { setPwError(t("account.pwNewTooShort", lang)); return }
    if (newPw !== confirmPw) { setPwError(t("account.pwMismatch", lang)); return }
    if (currentPw === newPw) { setPwError(t("account.pwSame", lang)); return }

    setPwLoading(true)
    try {
      const localClient = createClient()
      const { error: signInError } = await localClient.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPw,
      })
      if (signInError) {
        setPwError(t("account.pwIncorrect", lang))
        setPwLoading(false)
        return
      }
      const { error: updateError } = await localClient.auth.updateUser({ password: newPw })
      if (updateError) {
        setPwError(updateError.message)
        setPwLoading(false)
        return
      }
      setPwSuccess(t("account.passwordChanged", lang))
      setCurrentPw("")
      setNewPw("")
      setConfirmPw("")
      setTimeout(() => { setChangingPassword(false); setPwSuccess("") }, 2000)
    } catch {
      setPwError(t("auth.connectionError", lang))
    }
    setPwLoading(false)
  }

  if (editingProfile) {
    const phonePrefix = COUNTRY_PHONE_CODES[profileDraft.country] || "+"
    return (
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-display font-bold text-[16px] text-foreground">{t("account.editProfile", lang)}</h3>
        <div className="flex flex-col gap-2.5">
          <div><label className="text-[13px] text-muted-foreground mb-1 block">{t("auth.fullName", lang)}</label>
            <Input value={profileDraft.name} onChange={(e) => setProfileDraft(p => ({ ...p, name: e.target.value }))} className="text-[15px] h-10" /></div>
          <div><label className="text-[13px] text-muted-foreground mb-1 block">{t("auth.email", lang)}</label>
            <Input type="email" value={profileDraft.email} onChange={(e) => setProfileDraft(p => ({ ...p, email: e.target.value }))} className="text-[15px] h-10" /></div>
          <div><label className="text-[13px] text-muted-foreground mb-1 block">{t("account.countryLabel", lang)}</label>
            <select value={profileDraft.country} onChange={(e) => setProfileDraft(p => ({ ...p, country: e.target.value }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-[15px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="text-[13px] text-muted-foreground mb-1 block">{t("account.phoneLabel", lang)}</label>
            <div className="flex gap-1.5">
              <span className="flex items-center px-3 rounded-md border border-input bg-muted text-[15px] text-foreground font-medium min-w-[60px] justify-center">{phonePrefix}</span>
              <Input type="tel" value={profileDraft.phone} onChange={(e) => setProfileDraft(p => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))} className="text-[15px] h-10 flex-1" placeholder="6XXXXXXXX" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setEditingProfile(false)} className="flex-1 py-2.5 rounded-lg border border-border text-[15px] text-foreground font-medium hover:bg-muted transition-colors">{t("account.cancel", lang)}</button>
          <button onClick={() => { updateUser(profileDraft); setEditingProfile(false) }} className="flex-1 py-2.5 rounded-lg bg-[var(--ndolo-green)] text-white text-[15px] font-semibold hover:bg-[#e98c00] transition-colors flex items-center justify-center gap-1.5"><Save className="w-4 h-4" />{t("account.save", lang)}</button>
        </div>
      </div>
    )
  }

  const phonePrefix = COUNTRY_PHONE_CODES[user?.country || "Cameroun"] || "+"
  return (
    <div className="p-4 flex flex-col gap-3">
      <h3 className="font-display font-bold text-[16px] text-foreground">{t("account.profile", lang)}</h3>
      <div className="flex flex-col items-center mb-2">
        <div className="w-16 h-16 rounded-full bg-[#f8cf41] flex items-center justify-center mb-2"><User className="w-8 h-8 text-[var(--ndolo-green)]" /></div>
        <p className="font-bold text-foreground text-[16px]">{user?.name || (lang === "fr" ? "Utilisateur" : "User")}</p>
        <p className="text-[15px] text-muted-foreground">{user?.email}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          { label: t("account.classLabel", lang), value: classLabel },
          { label: t("account.roleLabel", lang), value: user?.role },
          { label: t("account.countryLabel", lang), value: user?.country },
          { label: t("account.phoneLabel", lang), value: user?.phone ? `${phonePrefix} ${user.phone}` : t("account.notProvided", lang) },
        ].map((f) => (
          <div key={f.label} className="flex justify-between bg-muted px-4 py-2.5 rounded-xl text-[15px]">
            <span className="text-muted-foreground">{f.label}</span>
            <span className="text-foreground font-medium">{f.value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center bg-muted px-4 py-2.5 rounded-xl text-[15px]">
          <span className="text-muted-foreground">{t("account.passwordLabel", lang)}</span>
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium font-mono tracking-wider">{"••••••••"}</span>
            <button onClick={() => setShowMaskedPw(!showMaskedPw)} className="text-muted-foreground hover:text-foreground transition-colors">
              {showMaskedPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <button onClick={() => { setProfileDraft({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", country: user?.country || "Cameroun" }); setEditingProfile(true) }}
        className="flex items-center gap-1.5 justify-center py-2.5 rounded-xl bg-muted text-[15px] text-foreground font-medium hover:bg-[#e98c00] hover:text-white transition-colors mt-1">
        <Pencil className="w-4 h-4" />{t("account.editProfile", lang)}
      </button>

      <div className="border-t border-border pt-3 mt-1">
        {!changingPassword ? (
          <button onClick={() => { setChangingPassword(true); setPwError(""); setPwSuccess("") }}
            className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl bg-[var(--ndolo-green)]/10 border border-[var(--ndolo-green)]/30 text-[15px] text-[var(--ndolo-green)] font-semibold hover:bg-[#e98c00] hover:text-white hover:border-[#e98c00] transition-colors">
            <KeyRound className="w-4 h-4" />{t("account.changePassword", lang)}
          </button>
        ) : (
          <div className="flex flex-col gap-3 bg-muted rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-5 h-5 text-[var(--ndolo-green)]" />
              <h4 className="font-display font-bold text-[15px] text-foreground">{t("account.changePassword", lang)}</h4>
            </div>

            {pwError && <div className="bg-destructive/10 text-destructive text-[13px] px-3 py-2 rounded-lg font-medium">{pwError}</div>}
            {pwSuccess && <div className="bg-[var(--ndolo-green)]/10 text-[var(--ndolo-green)] text-[13px] px-3 py-2 rounded-lg font-medium">{pwSuccess}</div>}

            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">{t("account.currentPassword", lang)}</label>
              <div className="relative">
                <Input type={showCurrentPw ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder={t("account.currentPwPlaceholder", lang)} className="text-[15px] h-10 pr-10 bg-background" />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">{t("account.newPassword", lang)}</label>
              <div className="relative">
                <Input type={showNewPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder={t("auth.minChars", lang)} className="text-[15px] h-10 pr-10 bg-background" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">{t("account.confirmNewPassword", lang)}</label>
              <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder={t("auth.confirmPassword", lang)} className="text-[15px] h-10 bg-background"
                onKeyDown={(e) => { if (e.key === "Enter") handleChangePassword() }} />
            </div>

            <div className="flex gap-2 mt-1">
              <button onClick={() => { setChangingPassword(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPwError(""); setPwSuccess("") }}
                className="flex-1 py-2.5 rounded-lg border border-border text-[15px] text-foreground font-medium hover:bg-background transition-colors">
                {t("account.cancel", lang)}
              </button>
              <button onClick={handleChangePassword} disabled={pwLoading}
                className="flex-1 py-2.5 rounded-lg bg-[var(--ndolo-green)] text-white text-[15px] font-semibold hover:bg-[#e98c00] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {pwLoading ? "..." : t("z3.validate", lang)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SubViewContent({ viewId }: { viewId: string }) {
  const store = useAppStore()
  const { user, updateUser, favorites, navigateToFavorite, lastVisited, navigateToLastVisited, setOpenModal, setAccountDrawerOpen, objective, setObjective, grades, setGrades, schoolGoals, addSchoolGoal, toggleSchoolGoal, removeSchoolGoal, gradeObjectives, addGradeObjective, removeGradeObjective, updateGradeObjective, language } = store
  const lang = language
  const [editingObjective, setEditingObjective] = useState(false)
  const [objDraft, setObjDraft] = useState(objective)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileDraft, setProfileDraft] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", country: user?.country || "Cameroun" })

  const registeredClass = user?.registeredClass || "6e"
  const classLabel = CLASSES.find(c => c.id === registeredClass)?.label || registeredClass

  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioPlaying, setAudioPlaying] = useState(false)

  useEffect(() => {
    if (viewId === "tutoriel" && audioRef.current) {
      audioRef.current.play().catch(() => {})
      setAudioPlaying(true)
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); setAudioPlaying(false) } }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewId])

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (audioPlaying) { audioRef.current.pause(); setAudioPlaying(false) }
    else { audioRef.current.play(); setAudioPlaying(true) }
  }

  switch (viewId) {
    case "apropos":
      return (
        <div className="p-4 flex flex-col gap-4">
          <div className="text-center mb-2">
            <h2 className="font-display font-bold text-[22px] text-[var(--ndolo-green)]">{t("account.aboutTitle", lang)}</h2>
            <p className="text-[15px] text-muted-foreground italic mt-1">{t("account.aboutTagline", lang)}</p>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-[15px] text-foreground leading-relaxed">{t("account.aboutDesc1", lang)}</p>
            <p className="text-[15px] text-foreground leading-relaxed mt-3">{t("account.aboutDesc2", lang)}</p>
          </div>
        </div>
      )

    case "tutoriel":
      return (
        <div className="p-4 flex flex-col gap-4">
          <audio ref={audioRef} src="/ndolomath-tutorial.mp3" onEnded={() => setAudioPlaying(false)} />
          <div className="flex items-center gap-3 bg-[var(--ndolo-green)] rounded-xl px-4 py-3">
            <button onClick={toggleAudio} className="w-10 h-10 rounded-full bg-[#f8cf41] text-[var(--ndolo-green)] flex items-center justify-center flex-shrink-0 hover:bg-[#e98c00] hover:text-white transition-colors">
              {audioPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div>
              <p className="text-[15px] text-white font-semibold">{audioPlaying ? t("account.tutorialAudioPlaying", lang) : t("account.tutorialListen", lang)}</p>
              <p className="text-[13px] text-white/70">{t("account.tutorialAutoplay", lang)}</p>
            </div>
          </div>
          <div className="text-center mb-2">
            <h2 className="font-display font-bold text-[22px] text-[var(--ndolo-green)]">{t("account.aboutTitle", lang)}</h2>
            <p className="text-[15px] text-muted-foreground italic mt-1">{t("account.aboutTagline", lang)}</p>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-[15px] text-foreground leading-relaxed">{t("account.tutorialDesc", lang)}</p>
          </div>
        </div>
      )

    case "objectif": {
      const [newObjText, setNewObjText] = useState("")
      const [editingId, setEditingId] = useState<string | null>(null)
      const [editDraft, setEditDraft] = useState("")
      const [newGoalText, setNewGoalText] = useState("")
      const doneCount = schoolGoals.filter(g => g.done).length
      const totalGoals = schoolGoals.length
      const progress = totalGoals > 0 ? Math.round((doneCount / totalGoals) * 100) : 0
      return (
        <div className="p-4 flex flex-col gap-4">
          <div>
            <h3 className="font-display font-bold text-[16px] text-foreground mb-2">{t("account.gradeObjectives", lang)}</h3>
            <div className="flex flex-col gap-2">
              {gradeObjectives.map((obj) => (
                <div key={obj.id} className="bg-muted rounded-xl px-4 py-3 group">
                  {editingId === obj.id ? (
                    <div className="flex gap-2 items-center">
                      <Input value={editDraft} onChange={(e) => setEditDraft(e.target.value)} className="text-[15px] h-9 flex-1"
                        onKeyDown={(e) => { if (e.key === "Enter" && editDraft.trim()) { updateGradeObjective(obj.id, editDraft.trim()); setEditingId(null) } }}
                        autoFocus />
                      <button onClick={() => { if (editDraft.trim()) { updateGradeObjective(obj.id, editDraft.trim()); setEditingId(null) } }}
                        className="h-9 px-3 rounded-lg bg-[var(--ndolo-green)] text-white text-[14px] font-medium hover:bg-[#e98c00] transition-colors flex-shrink-0">
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[var(--ndolo-green)] flex-shrink-0" />
                      <p className="flex-1 text-[15px] font-semibold text-[var(--ndolo-green)] leading-snug">{lang === "en" ? autoTranslate(obj.text) : obj.text}</p>
                      <button onClick={() => { setEditingId(obj.id); setEditDraft(obj.text) }}
                        className="text-muted-foreground hover:text-[#e98c00] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {gradeObjectives.length > 1 && (
                        <button onClick={() => removeGradeObjective(obj.id)}
                          className="text-destructive/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input value={newObjText} onChange={(e) => setNewObjText(e.target.value)}
                placeholder={t("account.newObjPlaceholder", lang)}
                className="text-[15px] h-10 flex-1"
                onKeyDown={(e) => { if (e.key === "Enter" && newObjText.trim()) { addGradeObjective(newObjText.trim()); setNewObjText("") } }} />
              <button onClick={() => { if (newObjText.trim()) { addGradeObjective(newObjText.trim()); setNewObjText("") } }}
                className="h-10 px-3 rounded-lg bg-[var(--ndolo-green)] text-white flex items-center justify-center hover:bg-[#e98c00] transition-colors flex-shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-[16px] text-foreground">{t("account.schoolGoals", lang)}</h3>
              <span className="text-[13px] text-muted-foreground font-medium">{doneCount}/{totalGoals}</span>
            </div>

            {totalGoals > 0 && (
              <div className="mb-3">
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--ndolo-green)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[12px] text-muted-foreground mt-1 text-right">{progress}% {t("account.accomplished", lang)}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              {schoolGoals.map((goal) => (
                <div key={goal.id} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all group ${goal.done ? "bg-[var(--ndolo-green)]/10" : "bg-muted"}`}>
                  <button onClick={() => toggleSchoolGoal(goal.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      goal.done ? "bg-[var(--ndolo-green)] border-[var(--ndolo-green)]" : "border-muted-foreground/30 hover:border-[var(--ndolo-green)]"
                    }`}>
                    {goal.done && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <span className={`flex-1 text-[15px] leading-snug ${goal.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{lang === "en" ? autoTranslate(goal.text) : goal.text}</span>
                  <button onClick={() => removeSchoolGoal(goal.id)}
                    className="text-destructive/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2.5">
              <Input value={newGoalText} onChange={(e) => setNewGoalText(e.target.value)} placeholder={t("account.newGoalPlaceholder", lang)}
                className="text-[15px] h-10 flex-1"
                onKeyDown={(e) => { if (e.key === "Enter" && newGoalText.trim()) { addSchoolGoal(newGoalText.trim()); setNewGoalText("") } }} />
              <button onClick={() => { if (newGoalText.trim()) { addSchoolGoal(newGoalText.trim()); setNewGoalText("") } }}
                className="h-10 px-3 rounded-lg bg-[var(--ndolo-green)] text-white flex items-center justify-center hover:bg-[#e98c00] transition-colors flex-shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )
    }

    case "favoris":
      return (
        <div className="p-4 flex flex-col gap-3">
          <h3 className="font-display font-bold text-[16px] text-foreground">{t("account.myFavorites", lang)}</h3>
          {favorites.length === 0 ? (
            <p className="text-[15px] text-muted-foreground">{t("account.noFavorites", lang)}</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {favorites.map((fav, i) => (
                <button key={i} onClick={() => navigateToFavorite(fav)}
                  className="flex items-center gap-2 px-3 py-2.5 bg-muted rounded-lg text-[15px] text-foreground hover:bg-[#e98c00] hover:text-white transition-colors text-left">
                  <Star className="w-4 h-4 fill-[#f8cf41] text-[#f8cf41] flex-shrink-0" />
                  <span className="break-words leading-snug">{lang === "en" ? autoTranslate(fav.label) : fav.label}</span>
                </button>
              ))}
            </div>
          )}
          {lastVisited && (
            <div className="mt-3 border-t border-border pt-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-4 h-4 text-[var(--ndolo-green)]" />
                <p className="text-[15px] font-bold text-foreground">{t("account.lastVisited", lang)}</p>
              </div>
              <button onClick={navigateToLastVisited}
                className="w-full text-left bg-[var(--ndolo-green)]/10 border border-[var(--ndolo-green)]/30 rounded-xl px-3 py-2.5 text-[15px] text-[var(--ndolo-green)] font-medium hover:bg-[#e98c00] hover:text-white hover:border-[#e98c00] transition-colors">
                {CLASSES.find(c => c.id === lastVisited.classId)?.label} - {lang === "en" ? autoTranslate(lastVisited.chapter) : lastVisited.chapter}
                <span className="block text-[13px] text-muted-foreground mt-0.5">{t("account.clickToReturn", lang)}</span>
              </button>
            </div>
          )}
        </div>
      )

    case "notes": {
      const handleGradeChange = (index: number, field: keyof GradeEntry, value: string) => {
        const updated = [...grades]
        if (field === "subject") updated[index] = { ...updated[index], subject: value }
        else if (field === "note") updated[index] = { ...updated[index], note: parseFloat(value) || 0 }
        else if (field === "coef") updated[index] = { ...updated[index], coef: parseFloat(value) || 1 }
        setGrades(updated)
      }
      const addSubject = () => setGrades([...grades, { subject: lang === "fr" ? "Nouvelle matiere" : "New subject", note: 0, coef: 1 }])
      const removeSubject = (index: number) => { const updated = grades.filter((_, i) => i !== index); setGrades(updated) }
      const totalCoef = grades.reduce((s, g) => s + g.coef, 0)
      const weightedSum = grades.reduce((s, g) => s + g.note * g.coef, 0)
      const average = totalCoef > 0 ? Math.round((weightedSum / totalCoef) * 100) / 100 : 0

      return (
        <div className="p-4 flex flex-col gap-3">
          <h3 className="font-display font-bold text-[16px] text-foreground">{t("account.myGrades", lang)}</h3>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_60px_50px_32px] gap-1.5 text-[13px] font-semibold text-muted-foreground px-1">
              <span>{t("account.subject", lang)}</span><span>{t("account.grade", lang)}</span><span>{t("account.coef", lang)}</span><span></span>
            </div>
            {grades.map((g, i) => (
              <div key={i} className="grid grid-cols-[1fr_60px_50px_32px] gap-1.5 items-center">
                <Input value={lang === "en" ? autoTranslate(g.subject) : g.subject} onChange={(e) => handleGradeChange(i, "subject", e.target.value)} className="text-[15px] h-9" />
                <Input type="number" min="0" max="20" step="0.5" value={g.note || ""} onChange={(e) => handleGradeChange(i, "note", e.target.value)} className="text-[15px] h-9 text-center" />
                <Input type="number" min="1" max="10" value={g.coef || ""} onChange={(e) => handleGradeChange(i, "coef", e.target.value)} className="text-[15px] h-9 text-center" />
                <button onClick={() => removeSubject(i)} className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <button onClick={addSubject} className="flex items-center gap-1.5 self-start text-[14px] text-[var(--ndolo-green)] font-medium hover:text-[#e98c00] transition-colors"><Plus className="w-4 h-4" />{t("account.addSubject", lang)}</button>
          <div className="bg-[var(--ndolo-green)] rounded-xl p-3 text-center mt-2">
            <p className="text-[22px] font-bold text-white">{average}/20</p>
            <p className="text-[13px] text-white/80">{t("account.weightedAverage", lang)}</p>
          </div>
        </div>
      )
    }

    case "forum": {
      return (
        <div className="p-4 flex flex-col gap-3 h-full">
          <div className="bg-muted rounded-xl p-4 flex flex-col gap-3">
            <h3 className="font-display font-bold text-[16px] text-foreground">{t("forum.communityTitle", lang)}</h3>
            <p className="text-[15px] text-muted-foreground leading-relaxed">{t("forum.communityDesc", lang)}</p>
            <a
              href="https://chat.whatsapp.com/Ly3vtXUU4FbLBQc2o6DWSD?mode=hq2tcla"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-lg bg-[var(--ndolo-green)] text-white text-[15px] font-semibold hover:bg-[#e98c00] transition-colors flex items-center justify-center"
            >
              {t("forum.communityBtn", lang)}
            </a>
          </div>
        </div>
      )
    }

    case "contact":
      return (
        <div className="p-4 flex flex-col gap-3">
          <h3 className="font-display font-bold text-[16px] text-foreground">{t("account.contactUs", lang)}</h3>
          <a href="mailto:contact.ndolomath@gmail.com" className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 hover:bg-[#e98c00] hover:text-white transition-colors group">
            <Mail className="w-5 h-5 text-[var(--ndolo-green)] group-hover:text-white flex-shrink-0" />
            <div>
              <p className="text-[13px] text-muted-foreground group-hover:text-white/70">Email</p>
              <p className="text-[15px] text-foreground font-medium group-hover:text-white">contact.ndolomath@gmail.com</p>
            </div>
          </a>
          <a href="https://wa.me/237682468359" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 hover:bg-[#e98c00] hover:text-white transition-colors group">
            <MessageSquare className="w-5 h-5 text-[var(--ndolo-green)] group-hover:text-white flex-shrink-0" />
            <div>
              <p className="text-[13px] text-muted-foreground group-hover:text-white/70">WhatsApp</p>
              <p className="text-[15px] text-foreground font-medium group-hover:text-white">+237 682 468 359</p>
            </div>
          </a>
        </div>
      )

    case "profil":
      return <ProfileView
        user={user}
        classLabel={classLabel}
        updateUser={updateUser}
        editingProfile={editingProfile}
        setEditingProfile={setEditingProfile}
        profileDraft={profileDraft}
        setProfileDraft={setProfileDraft}
        lang={lang}
      />

    case "settings":
      return (
        <div className="p-4">
          <button onClick={() => { setAccountDrawerOpen(false); setOpenModal("settings") }}
            className="w-full py-3 rounded-xl bg-muted text-foreground text-[15px] font-medium hover:bg-[#e98c00] hover:text-white transition-colors">
            {t("account.openSettings", lang)}
          </button>
        </div>
      )

    default: return null
  }
}

export function AccountDrawer() {
  const { accountDrawerOpen, setAccountDrawerOpen, accountSubView, setAccountSubView, user, logout, language } = useAppStore()
  const lang = language
  const handleLogout = () => { setAccountDrawerOpen(false); logout() }

  const MENU_ITEMS = [
    { id: "apropos", icon: Info, label: t("account.about", lang) },
    { id: "tutoriel", icon: Volume2, label: t("account.tutorial", lang) },
    { id: "objectif", icon: Target, label: t("account.objective", lang) },
    { id: "favoris", icon: Star, label: t("account.favorites", lang) },
    { id: "notes", icon: FileText, label: t("account.grades", lang) },
    { id: "forum", icon: MessageSquare, label: t("account.forum", lang) },
    { id: "contact", icon: Mail, label: t("account.contact", lang) },
    { id: "profil", icon: User, label: t("account.profile", lang) },
    { id: "settings", icon: Settings, label: t("account.settings", lang) },
  ]

  return (
    <Sheet open={accountDrawerOpen} onOpenChange={setAccountDrawerOpen}>
      <SheetContent side="right" className="w-[320px] sm:w-[360px] p-0 flex flex-col bg-card">
        <SheetHeader className="p-4 pb-2 border-b border-border">
          {accountSubView ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setAccountSubView(null)} className="w-8 h-8 rounded-lg bg-[#f8cf41] text-[var(--ndolo-green)] flex items-center justify-center hover:bg-[#e98c00] hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <SheetTitle className="font-display text-[16px]">{t("account.myAccount", lang)}</SheetTitle>
            </div>
          ) : (
            <div><SheetTitle className="font-display text-foreground text-[16px]">{t("account.myAccount", lang)}</SheetTitle><p className="text-[15px] text-muted-foreground mt-0.5">{user?.name || (lang === "fr" ? "Utilisateur" : "User")}</p></div>
          )}
        </SheetHeader>
        <ScrollArea className="flex-1">
          {accountSubView ? (
            <SubViewContent viewId={accountSubView} />
          ) : (
            <nav className="p-2 flex flex-col gap-0.5" aria-label={lang === "fr" ? "Menu du compte" : "Account menu"}>
              {MENU_ITEMS.map((item) => (
                <button key={item.id} onClick={() => setAccountSubView(item.id)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] text-foreground font-medium hover:bg-[#e98c00] hover:text-white transition-colors">
                  <item.icon className="w-5 h-5 text-[var(--ndolo-green)]" />{item.label}
                </button>
              ))}
              <div className="border-t border-border my-2" />
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] text-destructive font-medium hover:bg-destructive/10 transition-colors">
                <LogOut className="w-5 h-5" />{t("account.logout", lang)}
              </button>
            </nav>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

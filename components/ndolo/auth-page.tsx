"use client"

import { useState, useEffect, useCallback } from "react"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { COUNTRIES, CLASSES, COUNTRY_PHONE_CODES } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/local-client"
import { t } from "@/lib/i18n"
import type { Language } from "@/lib/i18n"

type AuthTab = "login" | "register" | "forgot"
type Role = "Eleve" | "Parent" | "Enseignant"

interface FormErrors { [key: string]: string }

export function AuthPage() {
  const login = useAppStore((s) => s.login)
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const [tab, setTab] = useState<AuthTab>("login")
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPw, setLoginPw] = useState("")

  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPw, setRegPw] = useState("")
  const [regPwConfirm, setRegPwConfirm] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regCountry, setRegCountry] = useState("Cameroun")
  const [regRole, setRegRole] = useState<Role>("Eleve")
  const [regClass, setRegClass] = useState("6e")
  const [regLang, setRegLang] = useState<Language>(language)

  const [forgotEmail, setForgotEmail] = useState("")

  const phonePrefix = COUNTRY_PHONE_CODES[regCountry] || "+"
  const lang = language

  // Load remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem("ndolo_remember_email")
    if (saved) { setLoginEmail(saved); setRemember(true) }
  }, [])

  const switchTab = (tVal: AuthTab) => { setTab(tVal); setErrors({}); setServerError(""); setSuccessMsg("") }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // ===== LOGIN =====
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: FormErrors = {}
    if (!validateEmail(loginEmail)) errs.loginEmail = t("auth.emailInvalid", lang)
    if (loginPw.length < 6) errs.loginPw = t("auth.minChars", lang)
    setErrors(errs); setServerError("")
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    try {
      const localClient = createClient()
      const { data, error } = await localClient.auth.signInWithPassword({ email: loginEmail.trim(), password: loginPw })
      if (error) {
        if (error.message.includes("Invalid login")) {
          setServerError(t("auth.wrongCredentials", lang))
        } else if (error.message.includes("Email not confirmed")) {
          setServerError(t("auth.emailNotConfirmed", lang))
        } else {
          setServerError(error.message)
        }
        setIsSubmitting(false)
        return
      }
      if (data.user) {
        if (remember) {
          localStorage.setItem("ndolo_remember_email", loginEmail.trim())
        } else {
          localStorage.removeItem("ndolo_remember_email")
        }
        const { data: profile } = await localClient.from("profiles").select("*").eq("id", data.user.id).single()
        login({
          name: profile?.full_name || data.user.user_metadata?.full_name || "",
          email: data.user.email || "",
          role: profile?.role || "eleve",
          country: profile?.country || "Cameroun",
          phone: profile?.phone || "",
          registeredClass: profile?.registered_class || "6e",
        })
      }
    } catch {
      setServerError(t("auth.connectionError", lang))
    }
    setIsSubmitting(false)
  }, [loginEmail, loginPw, login, remember, lang])

  // ===== REGISTER =====
  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: FormErrors = {}
    if (!regName.trim()) errs.regName = t("auth.nameRequired", lang)
    if (!validateEmail(regEmail)) errs.regEmail = t("auth.emailInvalid", lang)
    if (regPw.length < 6) errs.regPw = t("auth.minChars", lang)
    if (regPw !== regPwConfirm) errs.regPwConfirm = t("auth.passwordMismatch", lang)
    if (regPhone && !/^\d{9,15}$/.test(regPhone)) errs.regPhone = t("auth.phoneDigits", lang)
    setErrors(errs); setServerError("")
    if (Object.keys(errs).length > 0) return

    // Set the language preference chosen during registration
    setLanguage(regLang)

    setIsSubmitting(true)
    try {
      const localClient = createClient()
      const { data, error } = await localClient.auth.signUp({
        email: regEmail.trim(),
        password: regPw,
        options: {
          data: {
            full_name: regName.trim(),
            country: regCountry,
            role: regRole.toLowerCase(),
            registered_class: regClass,
          },
        },
      })
      if (error) {
        if (error.message === "User already registered" || error.message.toLowerCase().includes("already")) {
          setServerError(t("auth.emailAlreadyUsed", lang))
        } else {
          setServerError(error.message)
        }
        setIsSubmitting(false)
        return
      }
      if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
        setServerError(t("auth.emailAlreadyUsed", lang))
        setIsSubmitting(false)
        return
      }
      if (data.user) {
        if (regPhone) {
          await localClient.from("profiles").update({ phone: phonePrefix + regPhone }).eq("id", data.user.id)
        }
        login({
          name: regName.trim(),
          email: regEmail.trim(),
          role: regRole,
          country: regCountry,
          phone: regPhone ? phonePrefix + regPhone : "",
          registeredClass: regClass,
        })
      }
    } catch {
      setServerError(t("auth.connectionError", lang))
    }
    setIsSubmitting(false)
  }, [regName, regEmail, regPw, regPwConfirm, regPhone, regCountry, regRole, regClass, phonePrefix, login, lang, regLang, setLanguage])

  // ===== FORGOT PASSWORD =====
  const handleForgot = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: FormErrors = {}
    if (!validateEmail(forgotEmail)) errs.forgotEmail = t("auth.emailInvalid", lang)
    setErrors(errs); setServerError(""); setSuccessMsg("")
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    try {
      const localClient = createClient()
      const { error } = await localClient.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}`,
      })
      if (error) {
        setServerError(error.message)
      } else {
        setSuccessMsg(t("auth.resetSuccess", lang))
      }
    } catch {
      setServerError(t("auth.connectionError", lang))
    }
    setIsSubmitting(false)
  }, [forgotEmail, lang])

  const roleLabels: { role: Role; label: string }[] = [
    { role: "Eleve", label: t("auth.roleEleve", lang) },
    { role: "Parent", label: t("auth.roleParent", lang) },
    { role: "Enseignant", label: t("auth.roleEnseignant", lang) },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-[var(--ndolo-green)] py-8 px-4 text-center">
        <img
          src="/icon-512.png"
          alt="Ndolomath logo"
          className="w-20 h-20 mx-auto mb-3 rounded-xl shadow-lg"
        />
        <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Ndolomath</h1>
        <p className="text-white/90 text-[15px] font-medium max-w-md mx-auto">{t("auth.tagline", lang)}</p>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Language toggle for auth page */}
          <div className="flex justify-center gap-2 mb-4">
            <button onClick={() => { setLanguage("fr"); setRegLang("fr") }}
              className={`px-4 py-2 rounded-lg text-[14px] font-semibold transition-all ${lang === "fr" ? "bg-[#f8cf41] text-[var(--ndolo-green)]" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
              FR - Francais
            </button>
            <button onClick={() => { setLanguage("en"); setRegLang("en") }}
              className={`px-4 py-2 rounded-lg text-[14px] font-semibold transition-all ${lang === "en" ? "bg-[#f8cf41] text-[var(--ndolo-green)]" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
              EN - English
            </button>
          </div>

          {/* Tab switcher */}
          {tab !== "forgot" && (
            <div className="flex rounded-t-lg overflow-hidden border border-b-0 border-border">
              {(["login", "register"] as AuthTab[]).map((tVal) => (
                <button key={tVal} onClick={() => switchTab(tVal)}
                  className={`flex-1 py-3 px-4 text-[15px] font-semibold transition-all duration-300 ${
                    tab === tVal ? "bg-[#f8cf41] text-[var(--ndolo-green)] border-b-2 border-[var(--ndolo-green)]" : "bg-card text-muted-foreground hover:bg-[#e98c00] hover:text-white"
                  }`}>
                  {tVal === "login" ? t("auth.login", lang) : t("auth.register", lang)}
                </button>
              ))}
            </div>
          )}

          <div className={`bg-card border border-border ${tab === "forgot" ? "rounded-lg" : "rounded-b-lg"} p-6 shadow-sm`}>
            {/* Error / Success */}
            {serverError && (
              <div className="bg-destructive/10 text-destructive text-[14px] px-4 py-3 rounded-lg mb-4 font-medium">
                {serverError}
                {serverError.includes("deja utilisee") && tab === "register" && (
                  <button type="button" onClick={() => { switchTab("login"); setLoginEmail(regEmail) }}
                    className="block mt-2 text-[var(--ndolo-green)] underline font-semibold hover:opacity-80">
                    {t("auth.loginWithThis", lang)}
                  </button>
                )}
              </div>
            )}
            {successMsg && (
              <div className="bg-[var(--ndolo-green)]/10 text-[var(--ndolo-green)] text-[14px] px-4 py-3 rounded-lg mb-4 font-medium">{successMsg}</div>
            )}

            {/* ===== LOGIN ===== */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="login-email" className="text-foreground text-[15px]">{t("auth.email", lang)}</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="jean@email.com" className="bg-background text-[15px] h-11" />
                  {errors.loginEmail && <span className="text-destructive text-[13px]">{errors.loginEmail}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="login-pw" className="text-foreground text-[15px]">{t("auth.password", lang)}</Label>
                  <div className="relative">
                    <Input id="login-pw" type={showPw ? "text" : "password"} value={loginPw} onChange={(e) => setLoginPw(e.target.value)} placeholder="******" className="bg-background pr-10 text-[15px] h-11" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPw ? "Hide" : "Show"}>
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.loginPw && <span className="text-destructive text-[13px]">{errors.loginPw}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" checked={remember} onCheckedChange={(c) => setRemember(c === true)} />
                    <Label htmlFor="remember" className="text-[14px] text-muted-foreground cursor-pointer">{t("auth.rememberMe", lang)}</Label>
                  </div>
                  <button type="button" onClick={() => { switchTab("forgot"); setForgotEmail(loginEmail) }}
                    className="text-[13px] text-[var(--ndolo-green)] font-semibold hover:underline">
                    {t("auth.forgotPassword", lang)}
                  </button>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg bg-[var(--ndolo-green)] text-white font-semibold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? t("auth.connecting", lang) : t("auth.login", lang)}
                </button>
              </form>
            )}

            {/* ===== REGISTER ===== */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-name" className="text-foreground text-[15px]">{t("auth.fullName", lang)}</Label>
                  <Input id="reg-name" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Jean Dupont" className="bg-background text-[15px] h-11" />
                  {errors.regName && <span className="text-destructive text-[13px]">{errors.regName}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-email" className="text-foreground text-[15px]">{t("auth.email", lang)}</Label>
                  <Input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="jean@email.com" className="bg-background text-[15px] h-11" />
                  {errors.regEmail && <span className="text-destructive text-[13px]">{errors.regEmail}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-pw" className="text-foreground text-[15px]">{t("auth.password", lang)}</Label>
                  <div className="relative">
                    <Input id="reg-pw" type={showPw ? "text" : "password"} value={regPw} onChange={(e) => setRegPw(e.target.value)} placeholder={t("auth.minChars", lang)} className="bg-background pr-10 text-[15px] h-11" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPw ? "Hide" : "Show"}>
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.regPw && <span className="text-destructive text-[13px]">{errors.regPw}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-pw-confirm" className="text-foreground text-[15px]">{t("auth.confirmPassword", lang)}</Label>
                  <Input id="reg-pw-confirm" type="password" value={regPwConfirm} onChange={(e) => setRegPwConfirm(e.target.value)} placeholder={lang === "fr" ? "Confirmer" : "Confirm"} className="bg-background text-[15px] h-11" />
                  {errors.regPwConfirm && <span className="text-destructive text-[13px]">{errors.regPwConfirm}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-country" className="text-foreground text-[15px]">{t("auth.country", lang)}</Label>
                  <select id="reg-country" value={regCountry} onChange={(e) => setRegCountry(e.target.value)} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-[15px] text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-phone" className="text-foreground text-[15px]">{t("auth.phone", lang)}</Label>
                  <div className="flex gap-1.5">
                    <span className="flex items-center px-3 rounded-md border border-input bg-muted text-[15px] text-foreground font-medium min-w-[64px] justify-center">{phonePrefix}</span>
                    <Input id="reg-phone" type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))} placeholder="6XXXXXXXX" className="bg-background text-[15px] h-11 flex-1" />
                  </div>
                  {errors.regPhone && <span className="text-destructive text-[13px]">{errors.regPhone}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-class" className="text-foreground text-[15px]">{t("auth.class", lang)}</Label>
                  <select id="reg-class" value={regClass} onChange={(e) => setRegClass(e.target.value)} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-[15px] text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                    {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-foreground text-[15px]">{t("auth.role", lang)}</Label>
                  <div className="flex gap-2">
                    {roleLabels.map((r) => (
                      <button key={r.role} type="button" onClick={() => setRegRole(r.role)}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-[15px] font-medium transition-all duration-200 border ${
                          regRole === r.role ? "bg-[#f8cf41] text-[var(--ndolo-green)] border-[#f8cf41] font-semibold" : "bg-card text-foreground border-border hover:bg-[#e98c00] hover:text-white hover:border-[#e98c00]"
                        }`}>{r.label}</button>
                    ))}
                  </div>
                </div>

                {/* Language preference at registration */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-foreground text-[15px]">{t("auth.language", lang)}</Label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setRegLang("fr"); setLanguage("fr") }}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-[15px] font-medium transition-all duration-200 border ${
                        regLang === "fr" ? "bg-[#f8cf41] text-[var(--ndolo-green)] border-[#f8cf41] font-semibold" : "bg-card text-foreground border-border hover:bg-[#e98c00] hover:text-white hover:border-[#e98c00]"
                      }`}>{t("auth.langFr", lang)}</button>
                    <button type="button" onClick={() => { setRegLang("en"); setLanguage("en") }}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-[15px] font-medium transition-all duration-200 border ${
                        regLang === "en" ? "bg-[#f8cf41] text-[var(--ndolo-green)] border-[#f8cf41] font-semibold" : "bg-card text-foreground border-border hover:bg-[#e98c00] hover:text-white hover:border-[#e98c00]"
                      }`}>{t("auth.langEn", lang)}</button>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg bg-[var(--ndolo-green)] text-white font-semibold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? t("auth.creating", lang) : t("auth.createAccount", lang)}
                </button>
              </form>
            )}

            {/* ===== FORGOT PASSWORD ===== */}
            {tab === "forgot" && (
              <form onSubmit={handleForgot} className="flex flex-col gap-4">
                <button type="button" onClick={() => switchTab("login")} className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground self-start -mt-1 mb-1">
                  <ArrowLeft className="w-4 h-4" /> {t("auth.backToLogin", lang)}
                </button>
                <h3 className="text-[18px] font-bold text-foreground">{t("auth.forgotTitle", lang)}</h3>
                <p className="text-[14px] text-muted-foreground -mt-2 leading-relaxed">
                  {t("auth.forgotDesc", lang)}
                </p>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="forgot-email" className="text-foreground text-[15px]">{t("auth.email", lang)}</Label>
                  <Input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="jean@email.com" className="bg-background text-[15px] h-11" />
                  {errors.forgotEmail && <span className="text-destructive text-[13px]">{errors.forgotEmail}</span>}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg bg-[var(--ndolo-green)] text-white font-semibold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? t("auth.sending", lang) : t("auth.sendResetLink", lang)}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

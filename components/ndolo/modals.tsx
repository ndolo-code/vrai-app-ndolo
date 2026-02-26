"use client"

import { useState, useRef, useEffect } from "react"
import { X, Delete, Lightbulb, Moon, Sun, Trash2, Info, UserRound, Volume2, VolumeX, Mail, MessageSquare, AlertTriangle, ChevronLeft, Shield, Cookie } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { STUDY_TIPS_SHORT, IMPORTANT_FORMULAS } from "@/lib/data"
import { CalendarModal } from "./calendar-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { LatexText } from "./latex-renderer"
import { t } from "@/lib/i18n"
import { autoTranslate } from "@/lib/auto-translate"

function ModalWrapper({ id, title, children, size = "md" }: { id: string; title: string; children: React.ReactNode; size?: "md" | "lg" | "xl" | "full" }) {
  const { openModal, setOpenModal } = useAppStore()
  const sizeClass = size === "full" ? "max-w-[95vw] h-[90vh]" : size === "xl" ? "max-w-4xl max-h-[90vh]" : size === "lg" ? "max-w-2xl max-h-[85vh]" : "max-w-md max-h-[85vh]"
  return (
    <Dialog open={openModal === id} onOpenChange={(open) => !open && setOpenModal(null)}>
      <DialogContent className={`${sizeClass} !flex !flex-col p-0 gap-0 overflow-hidden`}>
        <DialogHeader className="px-4 pt-4 pb-2 border-b border-border flex-shrink-0">
          <DialogTitle className="font-display text-foreground text-[16px]">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain modal-scroll">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

// ===================== SCIENTIFIC CALCULATOR =====================
function CalculatorModal() {
  const { language } = useAppStore()
  const lang = language
  const [display, setDisplay] = useState("0")
  const [history, setHistory] = useState("")
  const [isDeg, setIsDeg] = useState(true)
  const [showSecond, setShowSecond] = useState(false)

  const isInitial = display === "0" || display === t("modal.error", lang)
  const OPERATORS = ["+", "-", "\u00d7", "\u00f7", "^"]
  const FUNCTIONS = ["sin(", "cos(", "tan(", "asin(", "acos(", "atan(", "log(", "ln(", "sqrt(", "cbrt(", "abs(", "exp(", "fact("]

  const appendVal = (v: string) => {
    if (isInitial) {
      if (v === ".") { setDisplay("0."); return }
      if (FUNCTIONS.includes(v) || v === "(" || v === "\u03c0" || v === "e") { setDisplay(v); return }
      setDisplay(v)
    } else {
      setDisplay(display + v)
    }
  }

  const calculate = () => {
    try {
      let expr = display
        .replace(/\u00d7/g, "*")
        .replace(/\u00f7/g, "/")
        .replace(/\u03c0/g, `(${Math.PI})`)
        .replace(/(?<![a-z])e(?![a-z(])/g, `(${Math.E})`)
        .replace(/\^/g, "**")

      expr = expr.replace(/fact\(([^)]+)\)/g, (_, n) => {
        const num = parseInt(n)
        if (isNaN(num) || num < 0 || num > 170) return "NaN"
        let r = 1; for (let i = 2; i <= num; i++) r *= i; return String(r)
      })

      if (isDeg) {
        expr = expr.replace(/sin\(/g, "Math.sin(Math.PI/180*(").replace(/cos\(/g, "Math.cos(Math.PI/180*(").replace(/tan\(/g, "Math.tan(Math.PI/180*(")
        const sinCount = (expr.match(/Math\.sin\(Math\.PI\/180\*\(/g) || []).length
        const cosCount = (expr.match(/Math\.cos\(Math\.PI\/180\*\(/g) || []).length
        const tanCount = (expr.match(/Math\.tan\(Math\.PI\/180\*\(/g) || []).length
        expr = expr.replace(/Math\.sin\(Math\.PI\/180\*\(([^)]+)\)/g, "Math.sin(Math.PI/180*($1))")
        expr = expr.replace(/Math\.cos\(Math\.PI\/180\*\(([^)]+)\)/g, "Math.cos(Math.PI/180*($1))")
        expr = expr.replace(/Math\.tan\(Math\.PI\/180\*\(([^)]+)\)/g, "Math.tan(Math.PI/180*($1))")
        void sinCount; void cosCount; void tanCount
      } else {
        expr = expr.replace(/sin\(/g, "Math.sin(").replace(/cos\(/g, "Math.cos(").replace(/tan\(/g, "Math.tan(")
      }

      if (isDeg) {
        expr = expr.replace(/asin\(/g, "(180/Math.PI)*Math.asin(").replace(/acos\(/g, "(180/Math.PI)*Math.acos(").replace(/atan\(/g, "(180/Math.PI)*Math.atan(")
      } else {
        expr = expr.replace(/asin\(/g, "Math.asin(").replace(/acos\(/g, "Math.acos(").replace(/atan\(/g, "Math.atan(")
      }

      expr = expr
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/cbrt\(/g, "Math.cbrt(")
        .replace(/abs\(/g, "Math.abs(")
        .replace(/exp\(/g, "Math.exp(")

      const result = Function(`"use strict"; return (${expr})`)()
      if (!isFinite(result)) { setDisplay(t("modal.error", lang)); setHistory(display + " ="); return }
      setHistory(display + " =")
      setDisplay(String(Math.round(result * 1e12) / 1e12))
    } catch { setDisplay(t("modal.error", lang)); setHistory(display + " =") }
  }

  const clear = () => { setDisplay("0"); setHistory("") }
  const backspace = () => {
    if (isInitial) { clear(); return }
    for (const fn of FUNCTIONS) {
      if (display.endsWith(fn)) { const d = display.slice(0, -fn.length); setDisplay(d || "0"); return }
    }
    const d = display.slice(0, -1); setDisplay(d || "0")
  }
  const toggleSign = () => {
    if (isInitial) return
    if (display.startsWith("-")) setDisplay(display.slice(1))
    else setDisplay("-" + display)
  }
  const percent = () => {
    try {
      const val = parseFloat(display)
      if (!isNaN(val)) setDisplay(String(val / 100))
    } catch { /* ignore */ }
  }

  const sciRow1 = showSecond
    ? [{ l: "asin(", d: "sin\u207B\u00B9" }, { l: "acos(", d: "cos\u207B\u00B9" }, { l: "atan(", d: "tan\u207B\u00B9" }, { l: "^", d: "x\u02B8" }]
    : [{ l: "sin(", d: "sin" }, { l: "cos(", d: "cos" }, { l: "tan(", d: "tan" }, { l: "^", d: "x\u02B8" }]
  const sciRow2 = showSecond
    ? [{ l: "exp(", d: "e\u02E3" }, { l: "cbrt(", d: "\u00B3\u221A" }, { l: "fact(", d: "n!" }, { l: "\u03c0", d: "\u03c0" }]
    : [{ l: "log(", d: "log" }, { l: "ln(", d: "ln" }, { l: "sqrt(", d: "\u221A" }, { l: "\u03c0", d: "\u03c0" }]
  const sciRow3 = [{ l: "(", d: "(" }, { l: ")", d: ")" }, { l: "abs(", d: "|x|" }, { l: "e", d: "e" }]

  const numRows = [
    ["7", "8", "9", "\u00f7"],
    ["4", "5", "6", "\u00d7"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ]

  return (
    <ModalWrapper id="calculator" title={t("modal.calculator", lang)} size="md">
      <div className="p-4">
        <div className="bg-muted rounded-xl px-4 py-3 mb-3">
          {history && <div className="text-[13px] text-muted-foreground text-right font-mono truncate">{history}</div>}
          <div className="text-[26px] font-mono text-foreground font-bold text-right truncate leading-tight">{display}</div>
        </div>

        <div className="grid grid-cols-6 gap-1.5 mb-2">
          <button onClick={clear} className="py-2 rounded-lg bg-destructive/10 text-destructive text-[14px] font-bold hover:bg-destructive/20 transition-colors">C</button>
          <button onClick={backspace} className="py-2 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted-foreground/10 transition-colors flex items-center justify-center"><Delete className="w-4 h-4" /></button>
          <button onClick={toggleSign} className="py-2 rounded-lg bg-muted text-foreground text-[14px] font-semibold hover:bg-muted-foreground/10 transition-colors">+/-</button>
          <button onClick={percent} className="py-2 rounded-lg bg-muted text-foreground text-[14px] font-semibold hover:bg-muted-foreground/10 transition-colors">%</button>
          <button onClick={() => setIsDeg(!isDeg)} className={`py-2 rounded-lg text-[12px] font-bold transition-colors ${isDeg ? "bg-[#f8cf41] text-[var(--ndolo-green)]" : "bg-[var(--ndolo-green)] text-white"}`}>
            {isDeg ? "DEG" : "RAD"}
          </button>
          <button onClick={() => setShowSecond(!showSecond)} className={`py-2 rounded-lg text-[13px] font-bold transition-colors ${showSecond ? "bg-[#f8cf41] text-[var(--ndolo-green)]" : "bg-muted text-foreground hover:bg-muted-foreground/10"}`}>
            2nd
          </button>
        </div>

        <div className="flex flex-col gap-1.5 mb-2">
          {[sciRow1, sciRow2, sciRow3].map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-1.5">
              {row.map((btn) => (
                <button key={btn.d} onClick={() => appendVal(btn.l)}
                  className="py-2 rounded-lg bg-[var(--ndolo-green)]/10 text-[var(--ndolo-green)] text-[14px] font-semibold hover:bg-[var(--ndolo-green)]/20 transition-colors">
                  {btn.d}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          {numRows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-1.5">
              {row.map((btn) => (
                <button key={`${ri}-${btn}`}
                  onClick={() => { if (btn === "=") calculate(); else appendVal(btn) }}
                  className={`py-3 rounded-lg text-[16px] font-semibold transition-colors ${
                    ["+", "-", "\u00d7", "\u00f7"].includes(btn)
                      ? "bg-[var(--ndolo-green)] text-white hover:bg-[#e98c00]"
                      : btn === "=" ? "bg-[#f8cf41] text-[var(--ndolo-green)] font-bold hover:bg-[#e98c00] hover:text-white"
                      : "bg-muted text-foreground hover:bg-muted-foreground/10"
                  }`}>{btn}</button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  )
}

// ===================== FORMULAS (with LaTeX) - SCROLLABLE =====================
function FormulasModal() {
  const { language } = useAppStore()
  const isEn = language === "en"
  return (
    <ModalWrapper id="formulas" title={t("modal.formulas", language)} size="lg">
      <div className="p-4 flex flex-col gap-5">
        {IMPORTANT_FORMULAS.map((f) => (
          <div key={f.cat}>
            <h3 className="text-[17px] font-bold text-[var(--ndolo-green)] mb-2">{isEn ? autoTranslate(f.cat) : f.cat}</h3>
            <div className="flex flex-col gap-1.5">{f.items.map((item, i) => (
              <div key={i} className="bg-muted px-3 py-3 rounded-lg text-[17px] text-foreground">
                <LatexText text={isEn ? autoTranslate(item) : item} />
              </div>
            ))}</div>
          </div>
        ))}
      </div>
    </ModalWrapper>
  )
}

// ===================== CURVE (GeoGebra) - MUCH LARGER =====================
function CurveModal() {
  const { language } = useAppStore()
  const lang = language
  return (
    <ModalWrapper id="curve" title={t("modal.curve", lang)} size="full">
      <div className="p-4 flex flex-col h-full">
        <p className="text-[15px] text-muted-foreground mb-3">{t("modal.curveDesc", lang)}</p>
        <div className="flex-1 rounded-xl overflow-hidden border border-border min-h-[70vh]">
          <iframe
            src="https://www.geogebra.org/graphing"
            title="GeoGebra Graphing Calculator"
            className="w-full h-full border-0"
            style={{ minHeight: "70vh" }}
            allow="fullscreen"
          />
        </div>
      </div>
    </ModalWrapper>
  )
}

// ===================== TIPS =====================
function TipsModal() {
  const { language } = useAppStore()
  const lang = language
  const isEn = lang === "en"
  return (
    <ModalWrapper id="tips" title={t("modal.tips", lang)} size="lg">
      <div className="flex flex-col">
        <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 border-b border-border/50">
          <p className="text-[13px] text-muted-foreground">{t("modal.tipsDesc", lang)}</p>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {STUDY_TIPS_SHORT.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-muted px-3 py-3 rounded-xl">
              <span className="w-6 h-6 rounded-full bg-[#f8cf41] text-[var(--ndolo-green)] flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
              <span className="text-[15px] text-foreground leading-relaxed">{isEn ? autoTranslate(tip) : tip}</span>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  )
}

// ===================== SETTINGS (with about, creator, tutorial, report) =====================
function SettingsModal() {
  const { darkMode, toggleDarkMode, setOpenModal, language } = useAppStore()
  const lang = language
  const isEn = lang === "en"
  const [subPage, setSubPage] = useState<null|"about"|"creator"|"tutorial"|"report"|"privacy"|"cookies">(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioPlaying, setAudioPlaying] = useState(false)

  useEffect(() => {
    if (subPage === "tutorial" && audioRef.current) {
      audioRef.current.play().catch(() => {})
      setAudioPlaying(true)
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); setAudioPlaying(false) } }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subPage])

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (audioPlaying) { audioRef.current.pause(); setAudioPlaying(false) }
    else { audioRef.current.play(); setAudioPlaying(true) }
  }

  if (subPage === "about") {
    return (
      <ModalWrapper id="settings" title={t("account.about", lang)}>
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 border-b border-border/50">
            <button onClick={() => setSubPage(null)} className="text-[15px] text-[var(--ndolo-green)] font-semibold flex items-center gap-1 hover:text-[#e98c00] transition-colors"><ChevronLeft className="w-4 h-4" /> {t("modal.back", lang)}</button>
          </div>
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
        </div>
      </ModalWrapper>
    )
  }

  if (subPage === "creator") {
    return (
      <ModalWrapper id="settings" title={t("modal.creator", lang)}>
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 border-b border-border/50">
            <button onClick={() => setSubPage(null)} className="text-[15px] text-[var(--ndolo-green)] font-semibold flex items-center gap-1 hover:text-[#e98c00] transition-colors"><ChevronLeft className="w-4 h-4" /> {t("modal.back", lang)}</button>
          </div>
          <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col items-center mb-2">
            <div className="w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-3">
              <UserRound className="w-10 h-10 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="font-display font-bold text-[18px] text-foreground">{t("modal.creatorName", lang)}</h2>
            <p className="text-[15px] text-muted-foreground">{t("modal.creatorRole", lang)}</p>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-[15px] text-foreground leading-relaxed">{t("modal.creatorDesc1", lang)}</p>
            <p className="text-[15px] text-foreground leading-relaxed mt-3">{t("modal.creatorDesc2", lang)}</p>
          </div>
          </div>
        </div>
      </ModalWrapper>
    )
  }

  if (subPage === "tutorial") {
    return (
      <ModalWrapper id="settings" title={t("modal.howToUse", lang)}>
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 border-b border-border/50">
            <button onClick={() => setSubPage(null)} className="text-[15px] text-[var(--ndolo-green)] font-semibold flex items-center gap-1 hover:text-[#e98c00] transition-colors"><ChevronLeft className="w-4 h-4" /> {t("modal.back", lang)}</button>
          </div>
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
        </div>
      </ModalWrapper>
    )
  }

  if (subPage === "privacy") {
    const at = (s: string) => isEn ? autoTranslate(s) : s
    return (
      <ModalWrapper id="settings" title={t("modal.privacy", lang)} size="lg">
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 border-b border-border/50">
            <button onClick={() => setSubPage(null)} className="text-[15px] text-[var(--ndolo-green)] font-semibold flex items-center gap-1 hover:text-[#e98c00] transition-colors"><ChevronLeft className="w-4 h-4" /> {t("modal.back", lang)}</button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="bg-muted rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-[16px] font-bold text-foreground">1. Introduction</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Ndolomath respecte votre vie privee. Cette politique de confidentialite decrit quelles donnees nous collectons, comment nous les utilisons et comment nous les protegeons. En utilisant l'application Ndolomath, vous acceptez les pratiques decrites dans cette politique.")}</p>
              <h3 className="text-[16px] font-bold text-foreground">{at("2. Donnees collectees")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Ndolomath collecte uniquement les donnees strictement necessaires au fonctionnement de l'application :")}</p>
              <ul className="list-disc pl-5 text-[14px] text-foreground leading-relaxed flex flex-col gap-1">
                <li>{at("Informations de profil (nom, prenom, classe) pour personnaliser l'experience")}</li>
                <li>{at("Progression et favoris pour sauvegarder votre avancement")}</li>
                <li>{at("Preferences d'affichage (mode sombre, classe selectionnee)")}</li>
              </ul>
              <h3 className="text-[16px] font-bold text-foreground">{at("3. Stockage des donnees")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Les donnees sont stockees localement sur votre appareil via le stockage du navigateur. Aucune donnee personnelle n'est transmise a des serveurs externes sans votre consentement explicite. Lorsque vous creez un compte, vos donnees sont stockees de maniere securisee sur nos serveurs.")}</p>
              <h3 className="text-[16px] font-bold text-foreground">{at("4. Utilisation des donnees")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Vos donnees sont utilisees exclusivement pour :")}</p>
              <ul className="list-disc pl-5 text-[14px] text-foreground leading-relaxed flex flex-col gap-1">
                <li>{at("Personnaliser votre experience d'apprentissage")}</li>
                <li>{at("Sauvegarder votre progression et vos favoris")}</li>
                <li>{at("Ameliorer les fonctionnalites de l'application")}</li>
              </ul>
              <h3 className="text-[16px] font-bold text-foreground">{at("5. Partage des donnees")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Ndolomath ne vend, ne loue et ne partage aucune donnee personnelle avec des tiers a des fins commerciales. Nous pouvons partager des donnees anonymisees a des fins statistiques pour ameliorer l'application.")}</p>
              <h3 className="text-[16px] font-bold text-foreground">{at("6. Securite")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Nous mettons en oeuvre des mesures de securite appropriees pour proteger vos donnees contre tout acces non autorise, modification, divulgation ou destruction.")}</p>
              <h3 className="text-[16px] font-bold text-foreground">{at("7. Droits des utilisateurs")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Vous avez le droit de consulter, modifier ou supprimer vos donnees a tout moment. Vous pouvez reinitialiser toutes vos donnees locales depuis les parametres de l'application. Pour toute demande concernant vos donnees, contactez-nous a contact.ndolomath@gmail.com.")}</p>
              <h3 className="text-[16px] font-bold text-foreground">8. Modifications</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Nous nous reservons le droit de modifier cette politique de confidentialite a tout moment. Les modifications prennent effet des leur publication dans l'application.")}</p>
              <p className="text-[13px] text-muted-foreground mt-2 italic">{at("Derniere mise a jour : fevrier 2026")}</p>
            </div>
          </div>
        </div>
      </ModalWrapper>
    )
  }

  if (subPage === "cookies") {
    const at = (s: string) => isEn ? autoTranslate(s) : s
    return (
      <ModalWrapper id="settings" title={t("modal.cookies", lang)} size="lg">
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 border-b border-border/50">
            <button onClick={() => setSubPage(null)} className="text-[15px] text-[var(--ndolo-green)] font-semibold flex items-center gap-1 hover:text-[#e98c00] transition-colors"><ChevronLeft className="w-4 h-4" /> {t("modal.back", lang)}</button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="bg-muted rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-[16px] font-bold text-foreground">{at("1. Qu'est-ce qu'un cookie ?")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Un cookie est un petit fichier texte stocke sur votre appareil lorsque vous visitez un site web ou utilisez une application. Les cookies permettent de memoriser vos preferences et d'ameliorer votre experience.")}</p>
              <h3 className="text-[16px] font-bold text-foreground">{at("2. Cookies utilises par Ndolomath")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Ndolomath utilise uniquement des cookies essentiels et fonctionnels :")}</p>
              <ul className="list-disc pl-5 text-[14px] text-foreground leading-relaxed flex flex-col gap-1">
                <li><strong>{at("Cookies essentiels :")}</strong>{" "}{at("necessaires au fonctionnement de l'application (authentification, session utilisateur)")}</li>
                <li><strong>{at("Cookies fonctionnels :")}</strong>{" "}{at("stockent vos preferences (mode sombre, classe selectionnee, progression)")}</li>
                <li><strong>{at("Stockage local :")}</strong>{" "}{at("utilise pour sauvegarder votre progression et vos favoris hors ligne")}</li>
              </ul>
              <h3 className="text-[16px] font-bold text-foreground">{at("3. Cookies tiers")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Ndolomath n'utilise pas de cookies publicitaires ou de suivi tiers. Certains contenus integres (comme GeoGebra pour le traceur de courbes) peuvent utiliser leurs propres cookies soumis a leurs propres politiques.")}</p>
              <h3 className="text-[16px] font-bold text-foreground">{at("4. Duree de conservation")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Les cookies essentiels sont conserves pendant la duree de votre session. Les cookies fonctionnels et le stockage local sont conserves jusqu'a ce que vous les supprimiez manuellement via les parametres de l'application ou de votre navigateur.")}</p>
              <h3 className="text-[16px] font-bold text-foreground">{at("5. Gestion des cookies")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("Vous pouvez a tout moment supprimer les cookies et les donnees de stockage local :")}</p>
              <ul className="list-disc pl-5 text-[14px] text-foreground leading-relaxed flex flex-col gap-1">
                <li>{at("Depuis les parametres de Ndolomath : bouton 'Reinitialiser le stockage local'")}</li>
                <li>{at("Depuis les parametres de votre navigateur : suppression des cookies et donnees de site")}</li>
              </ul>
              <h3 className="text-[16px] font-bold text-foreground">{at("6. Consentement")}</h3>
              <p className="text-[14px] text-foreground leading-relaxed">{at("En utilisant Ndolomath, vous consentez a l'utilisation des cookies essentiels et fonctionnels decrits ci-dessus. Vous pouvez retirer votre consentement a tout moment en supprimant les cookies.")}</p>
              <p className="text-[13px] text-muted-foreground mt-2 italic">{at("Derniere mise a jour : fevrier 2026")}</p>
            </div>
          </div>
        </div>
      </ModalWrapper>
    )
  }

  if (subPage === "report") {
    return (
      <ModalWrapper id="settings" title={t("modal.report", lang)}>
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 border-b border-border/50">
            <button onClick={() => setSubPage(null)} className="text-[15px] text-[var(--ndolo-green)] font-semibold flex items-center gap-1 hover:text-[#e98c00] transition-colors"><ChevronLeft className="w-4 h-4" /> {t("modal.back", lang)}</button>
          </div>
          <div className="p-4 flex flex-col gap-4">
          <p className="text-[15px] text-muted-foreground">{t("modal.reportDesc", lang)}</p>
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
        </div>
      </ModalWrapper>
    )
  }

  return (
    <ModalWrapper id="settings" title={t("modal.settings", lang)}>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-xl">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="w-5 h-5 text-foreground" /> : <Sun className="w-5 h-5 text-foreground" />}
            <span className="text-[15px] text-foreground font-medium">{darkMode ? t("modal.darkModeLabel", lang) : t("modal.lightModeLabel", lang)}</span>
          </div>
          <button onClick={toggleDarkMode} className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? "bg-[var(--ndolo-green)]" : "bg-muted-foreground/30"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>

        <button onClick={() => setSubPage("about")} className="flex items-center gap-3 bg-muted px-4 py-3 rounded-xl text-[15px] text-foreground font-medium hover:bg-[#e98c00] hover:text-white transition-colors">
          <Info className="w-5 h-5 text-[var(--ndolo-green)]" />{t("modal.aboutNdolomath", lang)}
        </button>

        <button onClick={() => setSubPage("creator")} className="flex items-center gap-3 bg-muted px-4 py-3 rounded-xl text-[15px] text-foreground font-medium hover:bg-[#e98c00] hover:text-white transition-colors">
          <UserRound className="w-5 h-5 text-[var(--ndolo-green)]" />{t("modal.creator", lang)}
        </button>

        <button onClick={() => setSubPage("tutorial")} className="flex items-center gap-3 bg-muted px-4 py-3 rounded-xl text-[15px] text-foreground font-medium hover:bg-[#e98c00] hover:text-white transition-colors">
          <Volume2 className="w-5 h-5 text-[var(--ndolo-green)]" />{t("modal.howToUse", lang)}
        </button>

        <button onClick={() => setSubPage("report")} className="flex items-center gap-3 bg-muted px-4 py-3 rounded-xl text-[15px] text-foreground font-medium hover:bg-[#e98c00] hover:text-white transition-colors">
          <AlertTriangle className="w-5 h-5 text-[var(--ndolo-green)]" />{t("modal.report", lang)}
        </button>

        <button onClick={() => setSubPage("privacy")} className="flex items-center gap-3 bg-muted px-4 py-3 rounded-xl text-[15px] text-foreground font-medium hover:bg-[#e98c00] hover:text-white transition-colors">
          <Shield className="w-5 h-5 text-[var(--ndolo-green)]" />{t("modal.privacy", lang)}
        </button>

        <button onClick={() => setSubPage("cookies")} className="flex items-center gap-3 bg-muted px-4 py-3 rounded-xl text-[15px] text-foreground font-medium hover:bg-[#e98c00] hover:text-white transition-colors">
          <Cookie className="w-5 h-5 text-[var(--ndolo-green)]" />{t("modal.cookies", lang)}
        </button>

        <div className="border-t border-border pt-3">
          <button onClick={() => { if (confirm(t("modal.resetConfirm", lang))) { localStorage.clear(); setOpenModal(null); window.location.reload() } }}
            className="flex items-center gap-2 bg-destructive/10 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/20 transition-colors w-full">
            <Trash2 className="w-5 h-5" /><span className="text-[15px] font-medium">{t("modal.resetStorage", lang)}</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export function AppModals() {
  return (<><CalculatorModal /><FormulasModal /><CurveModal /><TipsModal /><SettingsModal /><CalendarModal /></>)
}

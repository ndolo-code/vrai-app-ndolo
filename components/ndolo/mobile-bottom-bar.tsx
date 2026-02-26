"use client"

import {
  Calculator, User, Settings, FunctionSquare,
  TrendingUp, CalendarDays, Lightbulb
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"

export function MobileBottomBar() {
  const { setOpenModal, setAccountDrawerOpen, openModal, language } = useAppStore()
  const lang = language

  const BOTTOM_ITEMS = [
    { id: "formulas", icon: FunctionSquare, label: t("mobile.formulas", lang) },
    { id: "curve", icon: TrendingUp, label: t("mobile.curve", lang) },
    { id: "calculator", icon: Calculator, label: t("mobile.calc", lang) },
    { id: "calendar", icon: CalendarDays, label: t("mobile.calendar", lang) },
    { id: "tips", icon: Lightbulb, label: t("mobile.tips", lang) },
    { id: "user", icon: User, label: t("mobile.profile", lang) },
    { id: "settings", icon: Settings, label: t("mobile.settings", lang) },
  ]

  const handleClick = (id: string) => {
    if (id === "user") {
      setAccountDrawerOpen(true)
    } else {
      setOpenModal(id)
    }
  }

  return (
    <nav
      className="md:hidden flex-shrink-0 bg-[var(--ndolo-green)] border-t border-white/10 safe-area-pb"
      aria-label={t("mobile.toolbar", lang)}
    >
      <div className="flex items-center justify-around px-1 py-1.5">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = openModal === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-colors"
              aria-label={item.label}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-[#f8cf41]" : "text-white/70"
                }`}
              />
              <span
                className={`text-[10px] leading-tight transition-colors ${
                  isActive ? "text-[#f8cf41] font-semibold" : "text-white/60"
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

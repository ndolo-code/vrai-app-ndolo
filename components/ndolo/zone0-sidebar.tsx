"use client"

import {
  FunctionSquare, TrendingUp, Calculator, CalendarDays,
  Lightbulb, User, Settings
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"

export function Zone0Sidebar() {
  const { setOpenModal, setAccountDrawerOpen, openModal, language } = useAppStore()
  const lang = language

  const topItems = [
    { id: "formulas", icon: FunctionSquare, label: t("sidebar.formulas", lang) },
    { id: "curve", icon: TrendingUp, label: t("sidebar.curve", lang) },
    { id: "calculator", icon: Calculator, label: t("sidebar.calculator", lang) },
    { id: "calendar", icon: CalendarDays, label: t("sidebar.calendar", lang) },
    { id: "tips", icon: Lightbulb, label: t("sidebar.tips", lang) },
  ]

  const bottomItems = [
    { id: "user", icon: User, label: t("sidebar.user", lang) },
    { id: "settings", icon: Settings, label: t("sidebar.settings", lang) },
  ]

  const handleClick = (id: string) => {
    if (id === "user") {
      setAccountDrawerOpen(true)
    } else {
      setOpenModal(id)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="hidden md:flex flex-col items-center justify-between py-3 px-1.5 bg-[var(--ndolo-green)] border-r border-white/10 w-14 flex-shrink-0" role="complementary" aria-label={lang === "fr" ? "Barre d'outils" : "Toolbar"}>
        <nav className="flex flex-col items-center gap-1.5" aria-label={lang === "fr" ? "Outils" : "Tools"}>
          {topItems.map((item) => {
            const isActive = openModal === item.id
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleClick(item.id)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "bg-[#f8cf41] text-[var(--ndolo-green)]"
                        : "text-[#f8cf41]/70 hover:text-white hover:bg-[#e98c00]"
                    }`}
                    aria-label={item.label}
                  >
                    <item.icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-card text-card-foreground border-border text-[15px]">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
        <nav className="flex flex-col items-center gap-1.5" aria-label={lang === "fr" ? "Compte" : "Account"}>
          {bottomItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleClick(item.id)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-[#f8cf41]/70 hover:text-white hover:bg-[#e98c00] transition-all duration-200"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-card text-card-foreground border-border text-[15px]">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  )
}

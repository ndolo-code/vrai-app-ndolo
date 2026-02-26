"use client"

import { Zone0Sidebar } from "./zone0-sidebar"
import { Zone1Topbar } from "./zone1-topbar"
import { Zone2Panel } from "./zone2-panel"
import { Zone3Content } from "./zone3-content"
import { Zone4Panel } from "./zone4-panel"
import { MobileBottomBar } from "./mobile-bottom-bar"
import { AppModals } from "./modals"
import { AccountDrawer } from "./account-drawer"
import { useAppStore } from "@/lib/store"
import { useState, useCallback, useRef, useEffect } from "react"
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, X } from "lucide-react"
import { t } from "@/lib/i18n"

export function Dashboard() {
  const { activeTab, zone2Open, setZone2Open, language } = useAppStore()
  const lang = language
  const [zone2Collapsed, setZone2Collapsed] = useState(false)
  const [zone4Collapsed, setZone4Collapsed] = useState(false)
  const [zone4Width, setZone4Width] = useState(256) // default w-64 = 256px
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const showZone4 = activeTab === "classe" || activeTab === "mathematiciens" || activeTab === "tous"

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const rightEdge = containerRect.right
      const newWidth = Math.round(rightEdge - e.clientX)
      const clamped = Math.max(200, Math.min(600, newWidth))
      setZone4Width(clamped)
    }
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-background">
      {/* Zone 1 - Topbar */}
      <Zone1Topbar />

      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* Zone 0 - Micro sidebar (desktop only) */}
        <Zone0Sidebar />

        {/* Zone 2 - Left panel (desktop) */}
        <div className={`hidden md:block flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-border ${
          zone2Collapsed ? "w-0" : "w-64 lg:w-72"
        }`}>
          <div className="h-full w-64 lg:w-72">
            <Zone2Panel />
          </div>
        </div>

        {/* Zone 2 - Mobile overlay */}
        {zone2Open && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setZone2Open(false)} />
            <div className="relative w-[85vw] max-w-sm h-full z-10 shadow-xl">
              <button
                onClick={() => setZone2Open(false)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[var(--ndolo-yellow)] text-[var(--ndolo-green)] flex items-center justify-center shadow-lg"
                aria-label={t("dash.closeMenu", lang)}
              >
                <X className="w-5 h-5" />
              </button>
              <Zone2Panel />
            </div>
          </div>
        )}

        {/* Zone 3 - Main content */}
        <div className="flex-1 flex flex-col min-w-0 bg-background relative">
          {/* Toggle buttons (desktop) */}
          <div className="hidden md:flex absolute top-2 left-2 z-10 gap-1">
            <button
              onClick={() => setZone2Collapsed(!zone2Collapsed)}
              className="w-8 h-8 rounded-lg bg-[var(--ndolo-yellow)] text-[var(--ndolo-green)] flex items-center justify-center hover:bg-[var(--ndolo-hover)] hover:text-white transition-colors shadow-sm"
              aria-label={zone2Collapsed ? t("dash.showMenu", lang) : t("dash.hideMenu", lang)}
            >
              {zone2Collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>
          {showZone4 && (
            <div className="hidden md:flex absolute top-2 right-2 z-10">
              <button
                onClick={() => setZone4Collapsed(!zone4Collapsed)}
                className="w-8 h-8 rounded-lg bg-[var(--ndolo-yellow)] text-[var(--ndolo-green)] flex items-center justify-center hover:bg-[var(--ndolo-hover)] hover:text-white transition-colors shadow-sm"
                aria-label={zone4Collapsed ? t("dash.showSupplements", lang) : t("dash.hideSupplements", lang)}
              >
                {zone4Collapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
              </button>
            </div>
          )}
          <Zone3Content />
        </div>

        {/* Zone 4 - Right panel (desktop) with resize handle */}
        {showZone4 && !zone4Collapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="hidden lg:flex flex-shrink-0 w-1.5 cursor-col-resize items-center justify-center hover:bg-[var(--ndolo-yellow)]/40 active:bg-[var(--ndolo-yellow)]/60 transition-colors group"
            title={t("dash.resizePanel", lang)}
          >
            <div className="w-0.5 h-8 rounded-full bg-border group-hover:bg-[var(--ndolo-yellow)] group-active:bg-[var(--ndolo-yellow)] transition-colors" />
          </div>
        )}
        {showZone4 && (
          <div
            className={`flex-shrink-0 overflow-hidden border-l border-border ${
              zone4Collapsed ? "w-0 transition-all duration-300" : "hidden lg:block"
            }`}
            style={zone4Collapsed ? undefined : { width: zone4Width }}
          >
            <div className="h-full bg-[var(--ndolo-green)]" style={{ width: zone4Width }}>
              <Zone4Panel />
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom bar */}
      <MobileBottomBar />

      {/* Modals + Drawer */}
      <AppModals />
      <AccountDrawer />
    </div>
  )
}

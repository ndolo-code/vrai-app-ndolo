"use client"

import { useEffect, useState } from "react"

export function ServiceWorkerRegister() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      // Check for waiting worker on page load
      if (reg.waiting) {
        setWaitingWorker(reg.waiting)
        setShowUpdate(true)
      }

      // Listen for new worker
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker)
            setShowUpdate(true)
          }
        })
      })
    }).catch(() => {})

    // Reload once new SW takes over
    let refreshing = false
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage("SKIP_WAITING")
    }
    setShowUpdate(false)
  }

  if (!showUpdate) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-[var(--ndolo-green)] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-sm">
      <span className="text-[14px] font-medium flex-1">Nouvelle version disponible</span>
      <button
        onClick={handleUpdate}
        className="px-3 py-1.5 rounded-lg bg-[#f8cf41] text-[var(--ndolo-green)] text-[13px] font-bold hover:opacity-90 transition-opacity flex-shrink-0"
      >
        Mettre a jour
      </button>
    </div>
  )
}

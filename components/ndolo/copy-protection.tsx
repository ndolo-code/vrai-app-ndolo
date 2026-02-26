"use client"

import { useEffect } from "react"

export function CopyProtection() {
  useEffect(() => {
    const preventContext = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }
    const preventKeyShortcuts = (e: KeyboardEvent) => {
      // Block Ctrl/Cmd+C, U, S, A, P, Shift+I, F12
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "u" || e.key === "s" || e.key === "a" || e.key === "p")) ||
        (e.metaKey && (e.key === "c" || e.key === "u" || e.key === "s" || e.key === "a" || e.key === "p")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        e.key === "F12"
      ) {
        e.preventDefault()
        return false
      }
    }
    const preventPrint = (e: Event) => { e.preventDefault() }

    const preventDrag = (e: DragEvent) => { e.preventDefault(); return false }
    const preventSelect = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", preventContext)
    document.addEventListener("copy", preventCopy)
    document.addEventListener("keydown", preventKeyShortcuts)
    document.addEventListener("dragstart", preventDrag)
    document.addEventListener("selectstart", preventSelect)
    window.addEventListener("beforeprint", preventPrint)

    // Disable text selection via CSS as extra protection
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"

    return () => {
      document.removeEventListener("contextmenu", preventContext)
      document.removeEventListener("copy", preventCopy)
      document.removeEventListener("keydown", preventKeyShortcuts)
      document.removeEventListener("dragstart", preventDrag)
      document.removeEventListener("selectstart", preventSelect)
      window.removeEventListener("beforeprint", preventPrint)
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
    }
  }, [])

  return null
}

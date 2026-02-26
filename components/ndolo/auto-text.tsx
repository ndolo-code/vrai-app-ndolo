"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { autoTranslate } from "@/lib/auto-translate"

/**
 * AutoText — renders text as-is in French, auto-translates to English.
 * Use this to wrap any French data content that shouldn't be duplicated.
 * Preserves LaTeX ($...$) expressions and proper nouns in quotes.
 */
export function useAutoText(text: string): string {
  const language = useAppStore(s => s.language)
  return useMemo(() => {
    if (language === "fr" || !text) return text
    return autoTranslate(text)
  }, [text, language])
}

export function AutoText({ children, className }: { children: string; className?: string }) {
  const translated = useAutoText(children)
  if (className) return <span className={className}>{translated}</span>
  return <>{translated}</>
}

"use client"

import React from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

type Part = { type: "text" | "inline" | "block"; value: string }

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function normalizeMath(math: string): string {
  return math
    .replaceAll("\u0008", "\\")
    .replace(/\\\s+\\hline/g, "\\\\ \\hline")
    .replace(/\\hline\s+\\hline/g, "\\hline")
    .trim()
}

function renderKatex(math: string, displayMode: boolean): string {
  const source = normalizeMath(math)
  try {
    return katex.renderToString(source, {
      displayMode,
      throwOnError: true,
      strict: "ignore",
      trust: false,
    })
  } catch {
    try {
      return katex.renderToString(source, {
        displayMode,
        throwOnError: false,
        strict: "ignore",
        trust: false,
      })
    } catch {
      return `<code class=\"text-red-700 dark:text-red-300 break-words\">${escapeHtml(source)}</code>`
    }
  }
}

function splitByMathDelimiters(text: string): Part[] {
  const parts: Part[] = []
  let i = 0

  const pushText = (start: number, end: number) => {
    if (end > start) parts.push({ type: "text", value: text.slice(start, end) })
  }

  while (i < text.length) {
    const candidates = [
      { token: "$$", type: "block" as const },
      { token: "\\[", type: "block" as const },
      { token: "\\(", type: "inline" as const },
      { token: "$", type: "inline" as const },
      { token: "\\begin{", type: "block" as const },
    ]

    let nextPos = -1
    let chosen: { token: string; type: "inline" | "block" } | null = null

    for (const c of candidates) {
      const pos = text.indexOf(c.token, i)
      if (pos !== -1 && (nextPos === -1 || pos < nextPos)) {
        nextPos = pos
        chosen = c
      }
    }

    if (nextPos === -1 || !chosen) {
      pushText(i, text.length)
      break
    }

    pushText(i, nextPos)

    if (chosen.token === "\\begin{") {
      const endBegin = text.indexOf("\\end{", nextPos + chosen.token.length)
      if (endBegin === -1) {
        pushText(nextPos, text.length)
        break
      }
      const endBrace = text.indexOf("}", endBegin + 5)
      if (endBrace === -1) {
        pushText(nextPos, text.length)
        break
      }
      parts.push({ type: "block", value: text.slice(nextPos, endBrace + 1) })
      i = endBrace + 1
      continue
    }

    const closing = chosen.token === "$$"
      ? "$$"
      : chosen.token === "\\["
        ? "\\]"
        : chosen.token === "\\("
          ? "\\)"
          : "$"

    const contentStart = nextPos + chosen.token.length
    const end = text.indexOf(closing, contentStart)

    if (end === -1) {
      pushText(nextPos, text.length)
      break
    }

    parts.push({ type: chosen.type, value: text.slice(contentStart, end) })
    i = end + closing.length
  }

  return parts.length ? parts : [{ type: "text", value: text }]
}

export function LatexText({ text, className }: { text: string; className?: string }) {
  const parts = splitByMathDelimiters(text)

  return (
    <span className={className} style={{ lineHeight: 1.6 }}>
      {parts.map((part, idx) => {
        if (part.type === "text") return <span key={idx}>{part.value}</span>
        if (part.type === "inline") {
          return <span key={idx} dangerouslySetInnerHTML={{ __html: renderKatex(part.value, false) }} />
        }
        return <div key={idx} className="my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: renderKatex(part.value, true) }} />
      })}
    </span>
  )
}

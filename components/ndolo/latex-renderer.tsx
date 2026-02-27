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

function renderInlineCell(cell: string): string {
  const value = normalizeMath(cell)
  try {
    return katex.renderToString(value, {
      displayMode: false,
      throwOnError: false,
      strict: "ignore",
      trust: false,
    })
  } catch {
    return escapeHtml(value)
  }
}

function renderArrayAsHtml(math: string): string | null {
  const source = normalizeMath(math)
  const match = source.match(/\\begin\{array\}\{[^}]*\}([\s\S]*?)\\end\{array\}/)
  if (!match) return null

  const body = match[1]
  const rows = body
    .split(/\\\\/)
    .map((row) => row.replace(/\\hline/g, "").trim())
    .filter(Boolean)

  if (!rows.length) return null

  const htmlRows = rows
    .map((row, rowIndex) => {
      const cells = row.split("&").map((c) => c.trim())
      const tag = rowIndex === 0 ? "th" : "td"
      const renderedCells = cells
        .map((cell) => `<${tag} class=\"border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-center align-middle\">${renderInlineCell(cell)}</${tag}>`)
        .join("")
      return `<tr>${renderedCells}</tr>`
    })
    .join("")

  return `<table class=\"border-collapse w-full max-w-full text-[0.95em] bg-white/60 dark:bg-slate-900/40\"><tbody>${htmlRows}</tbody></table>`
}

function renderKatex(math: string, displayMode: boolean): string {
  const source = normalizeMath(math)

  if (source.includes("\\begin{array}")) {
    const tableHtml = renderArrayAsHtml(source)
    if (tableHtml) return tableHtml
  }

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

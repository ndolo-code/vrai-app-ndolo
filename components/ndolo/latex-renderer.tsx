"use client"

import React from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

function renderKatex(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math.trim(), { displayMode, throwOnError: false })
  } catch {
    return math
  }
}

function splitByDollars(text: string): { type: "text" | "inline" | "block"; value: string }[] {
  const out: { type: "text" | "inline" | "block"; value: string }[] = []
  let i = 0

  while (i < text.length) {
    const nextBlock = text.indexOf("$$", i)
    const nextInline = text.indexOf("$", i)

    if (nextBlock === -1 && nextInline === -1) {
      out.push({ type: "text", value: text.slice(i) })
      break
    }

    if (nextBlock !== -1 && (nextInline === -1 || nextBlock <= nextInline)) {
      if (nextBlock > i) out.push({ type: "text", value: text.slice(i, nextBlock) })
      const end = text.indexOf("$$", nextBlock + 2)
      if (end === -1) {
        out.push({ type: "text", value: text.slice(nextBlock) })
        break
      }
      out.push({ type: "block", value: text.slice(nextBlock + 2, end) })
      i = end + 2
      continue
    }

    if (nextInline !== -1) {
      if (nextInline > i) out.push({ type: "text", value: text.slice(i, nextInline) })
      const end = text.indexOf("$", nextInline + 1)
      if (end === -1) {
        out.push({ type: "text", value: text.slice(nextInline) })
        break
      }
      out.push({ type: "inline", value: text.slice(nextInline + 1, end) })
      i = end + 1
    }
  }

  return out
}

export function LatexText({ text, className }: { text: string; className?: string }) {
  const parts = splitByDollars(text)

  return (
    <span className={className} style={{ lineHeight: 1.6 }}>
      {parts.map((p, idx) => {
        if (p.type === "text") return <span key={idx}>{p.value}</span>
        if (p.type === "inline") {
          return <span key={idx} dangerouslySetInnerHTML={{ __html: renderKatex(p.value, false) }} />
        }
        return <div key={idx} style={{ margin: "10px 0" }} dangerouslySetInnerHTML={{ __html: renderKatex(p.value, true) }} />
      })}
    </span>
  )
}

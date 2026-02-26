import type { ExamSection } from "./bac-d-data"

import bepcIndex from "@/public/data/bepc/index.json"
import bepc1999Subject from "@/public/data/bepc/1999/subject.json"
import bepc1999Correction from "@/public/data/bepc/1999/correction.json"
import bepc2021Subject from "@/public/data/bepc/2021/subject.json"
import bepc2021Correction from "@/public/data/bepc/2021/correction.json"
import bepc2022Subject from "@/public/data/bepc/2022/subject.json"
import bepc2022Correction from "@/public/data/bepc/2022/correction.json"
import bepc2023Subject from "@/public/data/bepc/2023/subject.json"
import bepc2023Correction from "@/public/data/bepc/2023/correction.json"
import bepc2024Subject from "@/public/data/bepc/2024/subject.json"
import bepc2024Correction from "@/public/data/bepc/2024/correction.json"
import bepc2025Subject from "@/public/data/bepc/2025/subject.json"
import bepc2025Correction from "@/public/data/bepc/2025/correction.json"

type LocalSection = {
  type: "main" | "section" | "subsection" | "exercise" | "text" | "table" | "image"
  title?: string
  text?: string
  pts?: string
  src?: string
}

type LocalExamDoc = {
  title: string
  sections: LocalSection[]
}

// Keep all locally available BEPC years synchronized with index.json
const LOCAL_BEPC_SUBJECTS = {
const LOCAL_BEPC_SUBJECTS: Record<number, LocalExamDoc> = {
  1999: bepc1999Subject,
  2021: bepc2021Subject,
  2022: bepc2022Subject,
  2023: bepc2023Subject,
  2024: bepc2024Subject,
  2025: bepc2025Subject,
}

const LOCAL_BEPC_CORRECTIONS = {
  2022: bepc2022Subject,
  2023: bepc2023Subject,
  2024: bepc2024Subject,
  2023: bepc2023Subject,
  2024: bepc2024Subject,
const LOCAL_BEPC_SUBJECTS: Record<number, LocalExamDoc> = {
  1999: bepc1999Subject,
  2025: bepc2025Subject,
}

const LOCAL_BEPC_CORRECTIONS: Record<number, LocalExamDoc> = {
  1999: bepc1999Correction,
  2021: bepc2021Correction,
  2022: bepc2022Correction,
  2023: bepc2023Correction,
  2024: bepc2024Correction,
  2025: bepc2025Correction,
}

function normalizeDoc(doc: LocalExamDoc): ExamSection[] {
  return [
    { type: "main", title: doc.title },
    ...doc.sections.map((s) => ({
      type: s.type,
      title: s.title,
      text: s.text,
      pts: s.pts,
      src: s.src,
    })) as ExamSection[],
  ]
}

export const LOCAL_BEPC_YEARS = bepcIndex.years as number[]

export function getLocalBepcSubject(year: number): ExamSection[] | null {
  const doc = LOCAL_BEPC_SUBJECTS[year]
  if (!doc) return null
  return normalizeDoc(doc)
}

export function getLocalBepcCorrection(year: number): ExamSection[] | null {
  const doc = LOCAL_BEPC_CORRECTIONS[year]
  if (!doc) return null
  return normalizeDoc(doc)
}

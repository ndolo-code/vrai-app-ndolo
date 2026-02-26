import type { ExamSection } from "./bac-d-data"
import { autoTranslate } from "./auto-translate"

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
  1999: bepc1999Subject,
  2021: bepc2021Subject,
  2022: bepc2022Subject,
  2023: bepc2023Subject,
  2024: bepc2024Subject,
  2025: bepc2025Subject,
}

const LOCAL_BEPC_CORRECTIONS = {
  1999: bepc1999Correction,
  2021: bepc2021Correction,
  2022: bepc2022Correction,
  2023: bepc2023Correction,
  2024: bepc2024Correction,
  2025: bepc2025Correction,
}

const EXAM_SENTENCE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/^L'epreuve comporte les parties A et B\.?$/i, "The exam has two parts: A and B."],
  [/^L'epreuve comporte trois exercices et un probleme\.?$/i, "The exam includes three exercises and one problem."],
  [/^Cette partie comporte deux activites : une activite numerique et geometrique\.?$/i, "This part contains two activities: one numerical and one geometric."],
  [/^Cette partie comporte deux exercices independants 1 et 2\.?$/i, "This part contains two independent exercises: 1 and 2."],
  [/^Cette partie comporte trois exercices independants 1, 2 et 3\.?$/i, "This part contains three independent exercises: 1, 2 and 3."],
  [/^Repondre par vrai ou faux\.?$/i, "Answer true or false."],
  [/^Reproduire et completer le tableau ci-dessus\.?\s*(\d+[,.]?\d*\s*pt)?$/i, "Reproduce and complete the table above. $1"],
  [/^Combien a coute un sac de riz et un carton d'huile \?$/i, "How much did one bag of rice and one carton of oil cost?"],
  [/^Quel est le montant du budget presente par l'orphelinat \?$/i, "What is the amount of the budget presented by the orphanage?"],
  [/^A partir de quelle duree en heures, l'option 2 est-elle plus avantageuse pour le transport des achats \?\s*(\d+\s*pts?)?$/i, "From how many hours onward is option 2 more cost-effective for transporting the purchases? $1"],
]

const EXAM_PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Sujet de math(?:e|é)matiques/gi, "Mathematics exam"],
  [/\bPARTIE\s+A\s*-\s*EVALUATION DES RESSOURCES\b/g, "PART A - RESOURCES ASSESSMENT"],
  [/\bPARTIE\s+B\s*-\s*EVALUATION DES COMPETENCES\b/g, "PART B - SKILLS ASSESSMENT"],
  [/\bACTIVITES NUMERIQUES\b/g, "NUMERICAL ACTIVITIES"],
  [/\bACTIVITES GEOMETRIQUES\b/g, "GEOMETRIC ACTIVITIES"],
  [/\bExercice\b/g, "Exercise"],
  [/\bTache\b/g, "Task"],
  [/\bQuestions\b/g, "Questions"],
  [/\bReponse juste\b/g, "Correct answer"],
  [/\bN\^\\circ de l'affirmation\b/g, "Statement No."],
  [/\bN\^\\circ\b/g, "No."],
  [/\bEffectifs\b/g, "Frequencies"],
  [/\bNotes\b/g, "Scores"],
  [/\bCentres des classes\b/g, "Class midpoints"],
  [/\bTotal\b/g, "Total"],
  [/\bMontrer que\b/gi, "Show that"],
  [/\bCalculer\b/gi, "Calculate"],
  [/\bDeterminer\b/gi, "Determine"],
  [/\bJustifier\b/gi, "Justify"],
  [/\bDonner\b/gi, "Give"],
  [/\bSoit\b/gi, "Let"],
  [/\bpoints\b/gi, "points"],
  [/\bpoint\b/gi, "point"],
]

type Segment = { kind: "text" | "math"; value: string }

function splitMathSegments(input: string): Segment[] {
  const segments: Segment[] = []
  const pattern = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\begin\{[\s\S]*?\\end\{[^}]+\})/g
  let cursor = 0

  for (const match of input.matchAll(pattern)) {
    const start = match.index ?? 0
    const full = match[0]
    if (start > cursor) segments.push({ kind: "text", value: input.slice(cursor, start) })
    segments.push({ kind: "math", value: full })
    cursor = start + full.length
  }

  if (cursor < input.length) segments.push({ kind: "text", value: input.slice(cursor) })
  return segments.length ? segments : [{ kind: "text", value: input }]
}

function translateExamText(value?: string, type?: LocalSection["type"]): string | undefined {
  if (!value) return value
  if (type === "table") return value

  const fullLine = value.trim()
  for (const [pattern, replacement] of EXAM_SENTENCE_REPLACEMENTS) {
    if (pattern.test(fullLine)) return fullLine.replace(pattern, replacement).trim()
  }

  const segments = splitMathSegments(value)
  const translated = segments
    .map((seg) => {
      if (seg.kind === "math") return seg.value

      let text = autoTranslate(seg.value)
      for (const [pattern, replacement] of EXAM_PHRASE_REPLACEMENTS) {
        text = text.replace(pattern, replacement)
      }
      return text
    })
    .join("")

  return translated
}

function normalizeDoc(doc: LocalExamDoc): ExamSection[] {
  return [
    { type: "main", title: doc.title, en: translateExamText(doc.title, "main") },
    ...doc.sections.map((s) => ({
      type: s.type,
      title: s.title,
      text: s.text,
      pts: s.pts,
      src: s.src,
      en: translateExamText(s.text ?? s.title, s.type),
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

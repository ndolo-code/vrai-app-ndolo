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
  [/^L'epreuve comporte trois parties independantes A et B\.?$/i, "The exam is organized into independent parts A and B."],
  [/^L'epreuve comporte trois exercices et un probleme\.?$/i, "The exam includes three exercises and one problem."],
  [/^Cette partie comporte deux activites : une activite numerique et geometrique\.?$/i, "This part includes two activities: one numerical and one geometric."],
  [/^Cette partie comporte deux exercices independants 1 et 2\.?$/i, "This part contains two independent exercises: 1 and 2."],
  [/^Cette partie comporte trois exercices independants 1, 2 et 3\.?$/i, "This part contains three independent exercises: 1, 2 and 3."],
  [/^Repondre par vrai ou faux\.?$/i, "Answer true or false."],
  [/^Reproduire et completer le tableau ci-dessus\.?\s*(\d+[,.]?\d*\s*pt)?$/i, "Reproduce and complete the table above. $1"],
  [/^Combien a coute un sac de riz et un carton d'huile \?$/i, "How much did one bag of rice and one carton of oil cost?"],
  [/^Quel est le montant du budget presente par l'orphelinat \?$/i, "What is the total budget presented by the orphanage?"],
  [/^A partir de quelle duree en heures, l'option 2 est-elle plus avantageuse pour le transport des achats \?\s*(\d+\s*pts?)?$/i, "From what duration (in hours) does option 2 become more economical for transporting the purchases? $1"],
]

const EXAM_PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Sujet de math(?:e|é)matiques/gi, "Mathematics exam paper"],
  [/-\s*EVALUATION DES RESSOURCES/gi, "- RESOURCES ASSESSMENT"],
  [/-\s*EVALUATION DES COMPETENCES/gi, "- SKILLS ASSESSMENT"],
  [/\bPARTIE\s+A\b/gi, "PART A"],
  [/\bPARTIE\s+B\b/gi, "PART B"],
  [/\bACTIVITES NUMERIQUES\b/gi, "NUMERICAL ACTIVITIES"],
  [/\bACTIVITES GEOMETRIQUES\b/gi, "GEOMETRIC ACTIVITIES"],
  [/\bExercice\b/gi, "Exercise"],
  [/\bTache\b/gi, "Task"],
  [/\bSituation\b/gi, "Situation"],
  [/\bChoisir\b/gi, "Choose"],
  [/\bEcrire\b/gi, "Write"],
  [/\bMettre\b/gi, "Rewrite"],
  [/\bMontrer que\b/gi, "Show that"],
  [/\bCalculer\b/gi, "Calculate"],
  [/\bDeterminer\b/gi, "Determine"],
  [/\bJustifier\b/gi, "Justify"],
  [/\bDonner\b/gi, "Give"],
  [/\bSimplifier\b/gi, "Simplify"],
  [/\bSachant que\b/gi, "Given that"],
  [/\bOn considere\b/gi, "Consider"],
  [/\bL'unite de longueur est le centimetre\b/gi, "The unit of length is the centimeter"],
  [/\bsous la forme\b/gi, "in the form"],
  [/\bparmi celles qui sont proposees ci-dessous\b/gi, "from the options below"],
  [/\bparmi les quatre qui sont proposees\b/gi, "among the four proposed options"],
  [/\bbonne reponse\b/gi, "correct answer"],
  [/\bforme developpee\b/gi, "expanded form"],
  [/\bforme factorisee\b/gi, "factorized form"],
  [/\bfraction irreductible\b/gi, "irreducible fraction"],
  [/\bdu premier degre\b/gi, "of first degree"],
  [/\bcondition d'existence d'une valeur numerique\b/gi, "condition for numerical validity"],
  [/\bencadrement\b/gi, "bound"],
  [/\bnombres decimaux\b/gi, "decimal numbers"],
  [/\bentier naturel\b/gi, "natural integer"],
  [/\bsans radical au denominateur\b/gi, "with no radical in the denominator"],
  [/\bQuestions\b/gi, "Questions"],
  [/\bReponse juste\b/gi, "Correct answer"],
  [/\bN\^\\circ de l'affirmation\b/g, "Statement No."],
  [/\bN\^\\circ\b/g, "No."],
  [/\bEffectifs\b/gi, "Frequencies"],
  [/\bNotes\b/gi, "Scores"],
  [/\bCentres des classes\b/gi, "Class midpoints"],
  [/\bTotal\b/gi, "Total"],
  [/\bpt\b/gi, "pt"],
  [/\bpts\b/gi, "pts"],
]

const ENGLISH_POLISH_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bAssessment DES RESOURCES\b/gi, "Resources Assessment"],
  [/\bAssessment des ressources\b/gi, "Resources Assessment"],
  [/\bAssessment DES COMPETENCES\b/gi, "Skills Assessment"],
  [/\bConsider l'expression\b/gi, "Consider the expression"],
  [/\bConsider le nombre\b/gi, "Consider the number"],
  [/\bChoose et recopier\b/gi, "Choose and copy"],
  [/\bGive le resultat\b/gi, "Give the result"],
  [/\bdeux Decimal numbers\b/gi, "two decimal numbers"],
  [/\bdeux independent exercises\b/gi, "two independent exercises"],
  [/\btrois independent exercises\b/gi, "three independent exercises"],
  [/\bin the forma\b/gi, "in the form"],
  [/\bou a et b sont des entiers\b/gi, "where a and b are integers"],
  [/\bpar deux decimal numbers d'ordre 2\b/gi, "between two decimal numbers to two decimal places"],
  [/\bThe exam has two parts: A and B\b(?!\.)/g, "The exam has two parts: A and B."],
  [/\bThis part contains two activities: one numerical and one geometric\b(?!\.)/g, "This part includes two activities: one numerical and one geometric."],
  [/\bthe following table recapitule\b/gi, "The following table summarizes"],
  [/\bles notes sur 20 en mathematiques\b/gi, "scores out of 20 in mathematics"],
  [/\bd'une classe de troisieme\b/gi, "for a grade-9 class"],
  [/\bavec une donnee manquante\b/gi, "with one missing value"],
  [/\bChoisir la\b/gi, "Choose the"],
  [/\bEcrire la\b/gi, "Write the"],
  [/\bEcrire le\b/gi, "Write the"],
  [/\bEcrire l'\b/gi, "Write the "],
  [/\bDonner la\b/gi, "Give the"],
  [/\bDeterminer la\b/gi, "Determine the"],
  [/\bDeterminer les\b/gi, "Determine the"],
  [/\bCalculer la\b/gi, "Calculate the"],
  [/\bCalculer le\b/gi, "Calculate the"],
  [/\bCalculer l'\b/gi, "Calculate the "],
  [/\bMontrer que la\b/gi, "Show that the"],
  [/\bMontrer que le\b/gi, "Show that the"],
  [/\bsont perpendiculaires\b/gi, "are perpendicular"],
  [/\bsont colineaires\b/gi, "are collinear"],
  [/\bsont paralleles\b/gi, "are parallel"],
  [/\barrondie a l'entier le plus proche\b/gi, "rounded to the nearest integer"],
  [/\barrondi a\b/gi, "rounded to"],
  [/\bpres\b/gi, "accuracy"],
  [/\s+\./g, "."],
  [/\s+,/g, ","],
  [/\s+:/g, ":"],
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

function applyReplacements(value: string, rules: Array<[RegExp, string]>): string {
  let out = value
  for (const [pattern, replacement] of rules) out = out.replace(pattern, replacement)
  return out
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

      const fromDictionary = autoTranslate(seg.value)
      const preferredBase = fromDictionary === seg.value ? seg.value : fromDictionary
      const withExamTerms = applyReplacements(preferredBase, EXAM_PHRASE_REPLACEMENTS)
      return applyReplacements(withExamTerms, ENGLISH_POLISH_REPLACEMENTS)
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

// ─── Superset helpers ──────────────────────────────────────────────────────────
// Un superset = un run *contigu* d'exercices partageant la même valeur de
// `superset_group`. Un run isolé (taille 1) n'est pas un superset → traité comme
// un exercice simple. Ces helpers sont partagés entre le builder (ExerciseDraft)
// et le moteur live (quest_exercises enrichis).

export const MAX_SUPERSET_SIZE = 5

interface HasGroup {
  superset_group?: number | null
}

/** Une tranche du programme : soit un exercice simple, soit un superset (≥2 exercices). */
export interface ProgramSegment {
  /** Indices (dans le tableau d'origine) des exercices de la tranche, dans l'ordre. */
  indices: number[]
  /** true si la tranche est un superset (≥2 exercices liés). */
  isSuperset: boolean
}

/**
 * Découpe une liste d'exercices en tranches : runs contigus de même `superset_group`
 * (≥2) = supersets, le reste = exercices simples.
 */
export function buildSegments<T extends HasGroup>(items: T[]): ProgramSegment[] {
  const segments: ProgramSegment[] = []
  let i = 0
  while (i < items.length) {
    const g = items[i].superset_group
    if (g != null) {
      const indices = [i]
      let j = i + 1
      while (j < items.length && items[j].superset_group === g) {
        indices.push(j)
        j++
      }
      if (indices.length >= 2) {
        segments.push({ indices, isSuperset: true })
        i = j
        continue
      }
    }
    segments.push({ indices: [i], isSuperset: false })
    i++
  }
  return segments
}

/**
 * Renvoie une copie de la liste avec des `superset_group` propres :
 * - chaque run contigu de même valeur (≥2) reçoit un id frais (1, 2, 3, …)
 * - les runs isolés (taille 1) sont remis à `null`
 * Garantit que les groupes restent des runs contigus après un drag/del.
 */
export function normalizeGroups<T extends HasGroup>(items: T[]): T[] {
  const result = items.map(it => ({ ...it }))
  let nextId = 1
  let i = 0
  while (i < result.length) {
    const g = result[i].superset_group
    if (g == null) {
      i++
      continue
    }
    let j = i + 1
    while (j < result.length && result[j].superset_group === g) j++
    const runLen = j - i
    if (runLen >= 2) {
      const id = nextId++
      for (let k = i; k < j; k++) result[k].superset_group = id as T['superset_group']
    } else {
      result[i].superset_group = null as T['superset_group']
    }
    i = j
  }
  return result
}

/** Taille du run contigu de superset auquel appartient l'exercice `idx` (1 si simple). */
function runSizeAt<T extends HasGroup>(items: T[], idx: number): number {
  const g = items[idx]?.superset_group
  if (g == null) return 1
  let size = 0
  let i = idx
  while (i >= 0 && items[i].superset_group === g) { size++; i-- }
  i = idx + 1
  while (i < items.length && items[i].superset_group === g) { size++; i++ }
  return size
}

/** True si l'exercice `idx` peut être lié à son suivant (existe + taille < max). */
export function canLinkWithNext<T extends HasGroup>(items: T[], idx: number): boolean {
  if (idx >= items.length - 1) return false
  const runHere = runSizeAt(items, idx)
  const runNext = runSizeAt(items, idx + 1)
  return runHere + runNext <= MAX_SUPERSET_SIZE
}

/**
 * Lie l'exercice `idx` avec le suivant dans un même superset, puis normalise.
 * No-op si la liaison dépasserait la taille max ou s'il n'y a pas de suivant.
 */
export function linkWithNext<T extends HasGroup>(items: T[], idx: number): T[] {
  if (!canLinkWithNext(items, idx)) return items
  const next = items.map(it => ({ ...it }))
  const existing = next[idx].superset_group ?? next[idx + 1].superset_group
  const maxId = next.reduce((m, it) => Math.max(m, it.superset_group ?? 0), 0)
  const id = (existing ?? maxId + 1) as T['superset_group']
  next[idx].superset_group = id
  next[idx + 1].superset_group = id
  return normalizeGroups(next)
}

/** Retire l'exercice `idx` de son superset (et re-normalise). */
export function unlinkExercise<T extends HasGroup>(items: T[], idx: number): T[] {
  const next = items.map(it => ({ ...it }))
  if (next[idx]) next[idx].superset_group = null as T['superset_group']
  return normalizeGroups(next)
}

/**
 * Import one-shot depuis oss.exercisedb.dev
 * - Récupère les ~1500 exercices avec gifUrl (180p animé)
 * - Upsert en base via external_id (exerciseId)
 * - Stocke l'URL CDN directement (Option A — hotlink)
 *
 * Usage :
 *   SUPABASE_SERVICE_KEY=<service_role_key> node scripts/import-exercisedb-gifs.mjs
 *
 * La clé service_role est dans Supabase Dashboard → Project Settings → API
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Charger .env manuellement (pas de dotenv installé)
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '../.env')
try {
  const envContent = readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/)
    if (match) process.env[match[1].trim()] = match[2].trim()
  }
} catch {}

const SUPABASE_URL    = 'https://nwxkcmnzkguxmboigafr.supabase.co'
const PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const SERVICE_KEY     = process.env.SUPABASE_SERVICE_KEY

if (!SERVICE_KEY) {
  console.error('❌  SUPABASE_SERVICE_KEY manquant.')
  process.exit(1)
}

// Helpers REST directs (bypasse le client JS qui valide les JWT)
const REST = `${SUPABASE_URL}/rest/v1`
const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': PUBLISHABLE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Prefer': 'resolution=merge-duplicates,return=minimal',
}

async function dbCount(table, filter = '') {
  const res = await fetch(`${REST}/${table}?select=id${filter}`, {
    headers: { ...HEADERS, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' }
  })
  const range = res.headers.get('content-range') // ex: "0-0/1234"
  return range ? parseInt(range.split('/')[1]) : null
}

async function dbUpsert(table, rows) {
  const res = await fetch(`${REST}/${table}?on_conflict=external_id`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt)
  }
}

const API_BASE  = 'https://oss.exercisedb.dev/api/v1'
const PAGE_SIZE = 100

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function normalizeEquipment(eq) {
  const map = {
    'barbell': 'barbell', 'dumbbell': 'dumbbell', 'cable': 'cable',
    'machine': 'machine', 'body weight': 'body weight', 'band': 'resistance band',
    'resistance band': 'resistance band', 'kettlebell': 'kettlebell',
    'medicine ball': 'medicine ball', 'ez barbell': 'barbell',
    'olympic barbell': 'barbell', 'trap bar': 'barbell', 'weighted': 'other',
    'bosu ball': 'other', 'roller': 'other', 'rope': 'other',
    'skierg machine': 'machine', 'sled machine': 'machine',
    'smith machine': 'machine', 'upper body ergometer': 'machine',
    'assisted': 'other', 'leverage machine': 'machine',
    'hammer': 'dumbbell', 'stability ball': 'other',
  }
  return map[eq?.toLowerCase()] ?? eq ?? 'other'
}

function normalizeBodyPart(bp) {
  const map = {
    'chest': 'chest', 'back': 'back', 'shoulders': 'shoulders',
    'upper arms': 'arms', 'lower arms': 'arms', 'upper legs': 'legs',
    'lower legs': 'legs', 'waist': 'core', 'cardio': 'cardio',
    'neck': 'other',
  }
  return map[bp?.toLowerCase()] ?? bp ?? 'other'
}

// ── Fetch toutes les pages ────────────────────────────────────────────────────

const MAX_EXERCISES = 11500  // plafond = ~11000 selon doc officielle + marge

async function fetchAllExercises() {
  const all = []
  let cursor = null
  let total  = null
  let pages  = 0

  console.log('📡  Connexion à oss.exercisedb.dev...')

  while (true) {
    const url = cursor
      ? `${API_BASE}/exercises?limit=${PAGE_SIZE}&after=${cursor}`
      : `${API_BASE}/exercises?limit=${PAGE_SIZE}`

    const res = await fetch(url)

    if (!res.ok) {
      if (res.status === 429) {
        const wait = 15000
        process.stdout.write(`\n⏸️   Rate limit (429) — pause ${wait/1000}s...\n`)
        await sleep(wait)
        continue  // retry la même url
      }
      throw new Error(`HTTP ${res.status} sur ${url}`)
    }

    const json = await res.json()
    const exercises = json.data ?? []

    if (!exercises.length) break

    all.push(...exercises)
    pages++

    // Capturer le total réel à chaque page (certaines API le mettent à jour)
    const currentTotal = json.meta?.total ?? null
    if (currentTotal && currentTotal > (total ?? 0)) total = currentTotal

    cursor = json.meta?.nextCursor ?? null
    if (cursor === all[all.length - PAGE_SIZE]?.exerciseId) break  // détection boucle

    process.stdout.write(`\r📥  ${all.length}${total ? '/' + total : ''} exercices récupérés...`)

    // Conditions d'arrêt : plus de cursor, hasNextPage=false, ou plafond atteint
    if (!cursor) break
    if (json.meta?.hasNextPage === false) break
    if (total && all.length >= total) break
    if (all.length >= MAX_EXERCISES) {
      process.stdout.write(`\n⚠️   Plafond de sécurité atteint (${MAX_EXERCISES}), arrêt.\n`)
      break
    }

    await sleep(800)  // ~1.25 req/s — conservateur pour éviter le 429
  }

  console.log(`\n✅  ${all.length} exercices récupérés depuis l'API`)
  return all
}

// ── Transformer en row Supabase ───────────────────────────────────────────────

function toRow(ex) {
  const exerciseId = ex.exerciseId ?? ex.id
  const gifUrl = ex.gifUrl
    ?? ex.gifUrls?.['180p']
    ?? ex.gifUrls?.['360p']
    ?? null

  const imageUrl = ex.imageUrl
    ?? ex.imageUrls?.['360p']
    ?? ex.imageUrls?.['180p']
    ?? gifUrl  // fallback sur le gif

  return {
    external_id:       exerciseId,
    name:              ex.name ?? ex.exerciseName ?? '',
    name_fr:           null,  // conservé si déjà en base via l'ancien import
    body_part:         normalizeBodyPart(ex.bodyParts?.[0] ?? ex.bodyPart),
    target_muscle:     ex.targetMuscles?.[0] ?? ex.target ?? ex.bodyParts?.[0] ?? 'other',
    secondary_muscles: ex.secondaryMuscles ?? [],
    equipment:         normalizeEquipment(ex.equipments?.[0] ?? ex.equipment),
    difficulty:        ex.difficulty ?? null,
    instructions:      Array.isArray(ex.instructions) ? ex.instructions : [],
    gif_url:           gifUrl,
    image_url:         imageUrl,
    video_url:         null,
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

function escape(s) {
  if (s === null || s === undefined) return 'NULL'
  return `'${String(s).replace(/'/g, "''")}'`
}

function escapeArr(arr) {
  if (!Array.isArray(arr) || !arr.length) return "'{}'"
  const items = arr.map(s => `"${String(s).replace(/"/g, '\\"')}"`)
  return `'{${items.join(',')}}'`
}

async function main() {
  const exercises = await fetchAllExercises()

  if (!exercises.length) {
    console.error('❌  Aucun exercice récupéré, abandon.')
    process.exit(1)
  }

  const rows = exercises.map(toRow).filter(r => r.name && r.external_id)
  console.log(`\n🔄  Génération du SQL pour ${rows.length} exercices...`)

  // Générer un fichier SQL avec INSERT ... ON CONFLICT DO UPDATE
  const lines = rows.map(r => `(${[
    escape(r.external_id),
    escape(r.name),
    'NULL',
    escape(r.body_part),
    escape(r.target_muscle),
    escapeArr(r.secondary_muscles),
    escape(r.equipment),
    escape(r.difficulty),
    escapeArr(r.instructions),
    escape(r.gif_url),
    escape(r.image_url),
    'NULL',
  ].join(',')})`)

  const sql = `
INSERT INTO exercises (external_id, name, name_fr, body_part, target_muscle, secondary_muscles, equipment, difficulty, instructions, gif_url, image_url, video_url)
VALUES
${lines.join(',\n')}
ON CONFLICT (external_id) DO UPDATE SET
  name = EXCLUDED.name,
  body_part = EXCLUDED.body_part,
  target_muscle = EXCLUDED.target_muscle,
  secondary_muscles = EXCLUDED.secondary_muscles,
  equipment = EXCLUDED.equipment,
  difficulty = EXCLUDED.difficulty,
  instructions = EXCLUDED.instructions,
  gif_url = EXCLUDED.gif_url,
  image_url = EXCLUDED.image_url;
`

  const outPath = join(__dirname, '../scripts/exercises-import.sql')
  writeFileSync(outPath, sql, 'utf8')
  console.log(`✅  SQL généré : scripts/exercises-import.sql (${rows.length} exercices)`)
  console.log(`    Taille : ${(sql.length / 1024 / 1024).toFixed(1)} MB`)
}

main().catch(err => {
  console.error('\n❌  Erreur fatale :', err.message)
  process.exit(1)
})

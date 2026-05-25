/**
 * Script d'enrichissement one-shot : ajoute image_url + gif_url sur les exercices existants
 * Source images : yuhonas/free-exercise-db (exercises/{id}/0.jpg)
 *
 * Usage :
 *   SUPABASE_SERVICE_KEY=<service_role_key> node scripts/enrich-exercises-images.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://nwxkcmnzkguxmboigafr.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY

if (!SERVICE_KEY) {
  console.error('❌  SUPABASE_SERVICE_KEY manquant.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Base URL pour les images GitHub raw
const GH_RAW = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises'

// Charger le dataset local
const exercises = JSON.parse(readFileSync(join(__dirname, '../exercises.json'), 'utf8'))
console.log(`📦  Dataset local : ${exercises.length} exercices`)

// Construire un map id → urls d'images
const imageMap = new Map()
for (const ex of exercises) {
  if (ex.images?.length) {
    imageMap.set(ex.id, {
      image_url: `${GH_RAW}/${ex.images[0]}`,
      // L'image 1 est souvent la position finale — on l'utilise comme "gif" (image2)
      gif_url: ex.images.length > 1 ? `${GH_RAW}/${ex.images[1]}` : `${GH_RAW}/${ex.images[0]}`,
    })
  }
}
console.log(`🖼️   ${imageMap.size} exercices avec images`)

// Récupérer tous les external_ids en base
const { data: dbExercises, error } = await supabase
  .from('exercises')
  .select('id, external_id')
if (error) { console.error('❌', error.message); process.exit(1) }

console.log(`🗄️   ${dbExercises.length} exercices en base`)

// Construire les updates
const updates = []
for (const row of dbExercises) {
  const img = imageMap.get(row.external_id)
  if (img) {
    updates.push({ id: row.id, ...img })
  }
}
console.log(`🔄  ${updates.length} exercices à enrichir avec des images`)

// Mettre à jour par batch de 100
const BATCH = 100
let done = 0
for (let i = 0; i < updates.length; i += BATCH) {
  const batch = updates.slice(i, i + BATCH)
  for (const upd of batch) {
    const { error: upErr } = await supabase
      .from('exercises')
      .update({ image_url: upd.image_url, gif_url: upd.gif_url })
      .eq('id', upd.id)
    if (upErr) console.error(`❌  ${upd.id}:`, upErr.message)
    else done++
  }
  process.stdout.write(`\r⏳  ${Math.min(i + BATCH, updates.length)}/${updates.length}...`)
}

console.log(`\n\n✅  ${done} exercices enrichis avec images`)

// Vérification finale
const { count: withGif } = await supabase
  .from('exercises')
  .select('id', { count: 'exact', head: true })
  .not('gif_url', 'is', null)
console.log(`📊  ${withGif} exercices avec gif_url en base`)

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const exercises = JSON.parse(readFileSync(join(__dirname, '../exercises.json'), 'utf8'))

// Mapping muscle → groupe simplifié
const MUSCLE_GROUP_MAP = {
  chest: 'chest',
  shoulders: 'shoulders',
  biceps: 'arms',
  triceps: 'arms',
  forearms: 'arms',
  lats: 'back',
  'middle back': 'back',
  'lower back': 'back',
  traps: 'back',
  abdominals: 'core',
  abductors: 'legs',
  adductors: 'legs',
  glutes: 'legs',
  hamstrings: 'legs',
  quadriceps: 'legs',
  calves: 'legs',
  neck: 'other',
}

// Mapping equipment → simplifié
const EQUIPMENT_MAP = {
  barbell: 'barbell',
  dumbbell: 'dumbbell',
  cable: 'cable',
  machine: 'machine',
  'body only': 'bodyweight',
  bands: 'bands',
  kettlebells: 'kettlebell',
  'e-z curl bar': 'barbell',
  'exercise ball': 'other',
  'foam roll': 'other',
  'medicine ball': 'other',
  other: 'other',
}

const SUPABASE_URL = 'https://nwxkcmnzkguxmboigafr.supabase.co'
const SUPABASE_KEY = 'sb_publishable_4oAzXbWKNe5hOM88CRFFEw_0dEpF2gr'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const rows = exercises.map(ex => ({
  external_id: ex.id,
  name: ex.name,
  muscle_group: MUSCLE_GROUP_MAP[ex.primaryMuscles?.[0]] ?? 'other',
  secondary_muscles: (ex.secondaryMuscles || []).map(m => MUSCLE_GROUP_MAP[m] ?? m),
  equipment: EQUIPMENT_MAP[ex.equipment] ?? 'other',
  category: ex.category ?? 'strength',
  level: ex.level ?? 'beginner',
  instructions: ex.instructions?.join(' ') ?? null,
}))

console.log(`Importing ${rows.length} exercises...`)

// Insert par batch de 100
const BATCH = 100
let inserted = 0
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const { error } = await supabase
    .from('exercises')
    .upsert(batch, { onConflict: 'external_id' })

  if (error) {
    console.error(`Batch ${i}-${i + BATCH} error:`, error.message)
  } else {
    inserted += batch.length
    process.stdout.write(`\r${inserted}/${rows.length}`)
  }
}

console.log(`\nDone. ${inserted} exercises imported.`)

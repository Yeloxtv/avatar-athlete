import { readFileSync, writeFileSync } from 'fs'

const exercises = JSON.parse(readFileSync('./exercises.json', 'utf8'))

const MUSCLE_GROUP_MAP = {
  chest: 'chest', shoulders: 'shoulders', biceps: 'arms', triceps: 'arms',
  forearms: 'arms', lats: 'back', 'middle back': 'back', 'lower back': 'back',
  traps: 'back', abdominals: 'core', abductors: 'legs', adductors: 'legs',
  glutes: 'legs', hamstrings: 'legs', quadriceps: 'legs', calves: 'legs', neck: 'other',
}
const EQUIPMENT_MAP = {
  barbell: 'barbell', dumbbell: 'dumbbell', cable: 'cable', machine: 'machine',
  'body only': 'bodyweight', bands: 'bands', kettlebells: 'kettlebell',
  'e-z curl bar': 'barbell', 'exercise ball': 'other', 'foam roll': 'other',
  'medicine ball': 'other', other: 'other',
}

const rows = exercises.map(ex => ({
  external_id: ex.id,
  name: ex.name,
  muscle_group: MUSCLE_GROUP_MAP[ex.primaryMuscles?.[0]] ?? 'other',
  equipment: EQUIPMENT_MAP[ex.equipment] ?? 'other',
  category: ex.category ?? 'strength',
  level: ex.level ?? 'beginner',
}))

const BATCH = 50
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const vals = batch.map(r => {
    const name = r.name.replace(/'/g, "''")
    const ext = r.external_id.replace(/'/g, "''")
    return `('${ext}','${name}','${r.muscle_group}','${r.equipment}','${r.category}','${r.level}')`
  }).join(',\n')
  const sql = `INSERT INTO exercises (external_id, name, muscle_group, equipment, category, level) VALUES\n${vals}\nON CONFLICT (external_id) DO NOTHING;`
  const filename = `./scripts/nb${String(Math.floor(i/BATCH)).padStart(2,'0')}.sql`
  writeFileSync(filename, sql)
}
console.log(`Generated ${Math.ceil(rows.length/BATCH)} batches (no instructions)`)

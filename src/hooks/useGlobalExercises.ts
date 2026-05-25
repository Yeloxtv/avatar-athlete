import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface GlobalExercise {
  id: string
  name: string
  name_fr: string | null
  body_part: string
  target_muscle: string
  secondary_muscles: string[]
  equipment: string
  difficulty: string | null
  instructions: string[]
  gif_url: string | null
  image_url: string | null
}

export function useGlobalExercises(enabled: boolean, bodyPart: string | null) {
  const [exercises, setExercises] = useState<GlobalExercise[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled) return
    setLoading(true)
    let query = supabase
      .from('exercises')
      .select('id, name, name_fr, body_part, target_muscle, secondary_muscles, equipment, difficulty, instructions, gif_url, image_url')
      .order('name')
    if (bodyPart) query = (query as any).eq('body_part', bodyPart)
    ;(query as any).then(({ data }: { data: GlobalExercise[] | null }) => {
      setExercises(data ?? [])
      setLoading(false)
    })
  }, [enabled, bodyPart])

  return { exercises, loading }
}

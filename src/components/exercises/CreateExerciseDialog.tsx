import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { GlobalExercise } from '@/hooks/useGlobalExercises'

// Groupes alignés sur la normalisation de l'import (body_part)
const BODY_PARTS = [
  { key: 'chest',     label: 'Pectoraux', emoji: '🫁' },
  { key: 'back',      label: 'Dos',        emoji: '🦅' },
  { key: 'shoulders', label: 'Épaules',    emoji: '🏋️' },
  { key: 'arms',      label: 'Bras',       emoji: '💪' },
  { key: 'legs',      label: 'Jambes',     emoji: '🦵' },
  { key: 'core',      label: 'Abdos',      emoji: '🎯' },
  { key: 'cardio',    label: 'Cardio',     emoji: '🏃' },
  { key: 'other',     label: 'Autre',      emoji: '➕' },
]

const EQUIPMENTS = [
  { key: 'body weight',     label: 'Poids corps' },
  { key: 'dumbbell',        label: 'Haltères' },
  { key: 'barbell',         label: 'Barre' },
  { key: 'machine',         label: 'Machine' },
  { key: 'cable',           label: 'Poulie' },
  { key: 'kettlebell',      label: 'Kettlebell' },
  { key: 'resistance band', label: 'Élastiques' },
  { key: 'other',           label: 'Autre' },
]

interface CreateExerciseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | undefined
  /** Nom pré-rempli (ex : recherche en cours) */
  defaultName?: string
  /** Groupe musculaire pré-sélectionné */
  defaultBodyPart?: string | null
  onCreated: (exercise: GlobalExercise) => void
}

export function CreateExerciseDialog({
  open,
  onOpenChange,
  userId,
  defaultName = '',
  defaultBodyPart = null,
  onCreated,
}: CreateExerciseDialogProps) {
  const [name, setName] = useState(defaultName)
  const [bodyPart, setBodyPart] = useState(defaultBodyPart ?? 'other')
  const [equipment, setEquipment] = useState('body weight')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)

  // Re-synchroniser les valeurs par défaut à chaque ouverture
  useEffect(() => {
    if (open) {
      setName(defaultName)
      setBodyPart(defaultBodyPart ?? 'other')
      setEquipment('body weight')
      setImageUrl('')
    }
  }, [open, defaultName, defaultBodyPart])

  const handleCreate = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (!userId) {
      toast({ title: 'Non connecté', description: 'Reconnecte-toi pour créer un exercice.', variant: 'destructive' })
      return
    }

    setSaving(true)
    const media = imageUrl.trim() || null
    const { data, error } = await supabase
      .from('exercises')
      .insert({
        name: trimmed,
        name_fr: null,
        body_part: bodyPart,
        target_muscle: bodyPart, // colonne NOT NULL — on reprend le groupe
        secondary_muscles: [],
        equipment,
        difficulty: null,
        instructions: [],
        gif_url: media,
        image_url: media,
        is_custom: true,
        created_by: userId,
      })
      .select('id, name, name_fr, body_part, target_muscle, secondary_muscles, equipment, difficulty, instructions, gif_url, image_url, is_custom')
      .single()
    setSaving(false)

    if (error || !data) {
      toast({ title: 'Erreur', description: "Impossible de créer l'exercice.", variant: 'destructive' })
      return
    }

    toast({ title: 'Exercice créé !', description: trimmed })
    onCreated(data as GlobalExercise)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Créer un exercice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nom */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Nom</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Tirage poitrine prise serrée"
              autoFocus
              className="h-11 text-base"
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
          </div>

          {/* Groupe musculaire */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Groupe musculaire</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {BODY_PARTS.map(bp => (
                <button
                  key={bp.key}
                  type="button"
                  onClick={() => setBodyPart(bp.key)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 py-2 rounded-lg border text-[11px] font-medium transition-all',
                    bodyPart === bp.key
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'border-muted/40 text-muted-foreground hover:border-accent/40'
                  )}
                >
                  <span className="text-base leading-none">{bp.emoji}</span>
                  <span>{bp.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Équipement */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Équipement</Label>
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {EQUIPMENTS.map(eq => (
                <option key={eq.key} value={eq.key}>{eq.label}</option>
              ))}
            </select>
          </div>

          {/* URL image (optionnel) */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              URL image / GIF <span className="normal-case opacity-60">(optionnel)</span>
            </Label>
            <Input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://…"
              className="h-11 text-sm"
            />
            {imageUrl.trim() ? (
              <div className="mt-2 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center" style={{ minHeight: 120 }}>
                <img
                  src={imageUrl.trim()}
                  alt="aperçu"
                  className="max-h-40 w-full object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            ) : (
              <div className="mt-2 rounded-lg bg-muted/20 flex items-center justify-center" style={{ minHeight: 80 }}>
                <Dumbbell className="w-8 h-8 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <Button
            onClick={handleCreate}
            disabled={!name.trim() || saving}
            className="w-full h-12 font-bold"
          >
            {saving ? 'Création…' : "Créer l'exercice"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

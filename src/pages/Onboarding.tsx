import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type UserMode = 'guided' | 'autonomous'

interface ModeCardProps {
  mode: UserMode
  icon: string
  title: string
  tagline: string
  bullets: string[]
  selected: boolean
  onSelect: () => void
}

function ModeCard({ icon, title, tagline, bullets, selected, onSelect }: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col gap-4 p-6 rounded-2xl border-2 text-left transition-all w-full',
        selected
          ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
          : 'border-muted/30 bg-muted/5 hover:border-muted/60'
      )}
    >
      <div className="text-4xl">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-lg font-black tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-snug">{tagline}</p>
      </div>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className={cn(
              'w-1.5 h-1.5 rounded-full shrink-0',
              selected ? 'bg-accent' : 'bg-muted-foreground/50'
            )} />
            <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>{b}</span>
          </li>
        ))}
      </ul>
    </button>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { updateProfile } = useProfile()
  const [selected, setSelected] = useState<UserMode | null>(null)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!selected) return
    setLoading(true)
    try {
      await updateProfile({ user_mode: selected })
      navigate('/', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl mb-4">⚔️</div>
          <h1 className="text-3xl font-black tracking-tight">Choisir ta voie</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Deux chemins s'offrent à toi. Tu pourras changer d'avis dans ton profil.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ModeCard
            mode="guided"
            icon="🗺️"
            title="Je débute"
            tagline="Suis des campagnes guidées, débloque les quêtes une par une"
            bullets={['Parcours progressifs', 'Quêtes débloquées pas à pas', 'Guide inclus']}
            selected={selected === 'guided'}
            onSelect={() => setSelected('guided')}
          />
          <ModeCard
            mode="autonomous"
            icon="🏋️"
            title="J'ai mon programme"
            tagline="Gère ton planning semaine et trace tes performances"
            bullets={['Programme sur mesure', 'Planning hebdomadaire', 'Tu décides']}
            selected={selected === 'autonomous'}
            onSelect={() => setSelected('autonomous')}
          />
        </div>

        {/* CTA */}
        <Button
          onClick={handleConfirm}
          disabled={!selected || loading}
          className="w-full h-12 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {loading ? 'Chargement...' : selected ? 'Commencer l\'aventure' : 'Choisir une voie pour continuer'}
        </Button>
      </div>
    </div>
  )
}

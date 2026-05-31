import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useChestReward } from '@/hooks/useChestReward'
import { RarityBadge } from '@/components/loot/RarityBadge'
import { Button } from '@/components/ui/button'
import { UserChest, RewardDefinition, RARITY_COLORS } from '@/types/loot'
import { supabase } from '@/integrations/supabase/client'

const CHEST_IMG = {
  closed:  '/chests/chest-common-1.jpg',
  shaking: '/chests/chest-common-2.jpg',
  opening: '/chests/chest-common-3.jpg',
}

type Step = 'idle' | 'shaking' | 'opening' | 'revealed'

export default function ChestOpening() {
  const { userChestId } = useParams<{ userChestId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { openChest } = useChestReward()

  const [chest, setChest] = useState<UserChest | null>(null)
  const [step, setStep] = useState<Step>('idle')
  const [frame, setFrame] = useState<'closed' | 'shaking'>('closed')
  const [reward, setReward] = useState<RewardDefinition | null>(null)

  useEffect(() => {
    if (!userChestId || !user?.id) return
    supabase
      .from('user_chests')
      .select('*, chests(*)')
      .eq('id', userChestId)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setChest({ ...(data as any), chest: (data as any).chests })
      })
  }, [userChestId, user?.id])

  // Tremblement : alterne frame 1↔2 toutes les 120ms
  useEffect(() => {
    if (step !== 'shaking') return
    let i = 0
    const interval = setInterval(() => {
      setFrame(i % 2 === 0 ? 'shaking' : 'closed')
      i++
    }, 120)
    return () => clearInterval(interval)
  }, [step])

  const handleTap = async () => {
    if (step !== 'idle' || !user?.id || !userChestId) return

    setStep('shaking')
    await new Promise(r => setTimeout(r, 1200))

    setStep('opening')
    setFrame('closed')
    const result = await openChest(user.id, userChestId)
    await new Promise(r => setTimeout(r, 700))

    if (result) {
      setReward(result)
      setStep('revealed')
    } else {
      setStep('idle')
    }
  }

  const chestSrc =
    step === 'opening' ? CHEST_IMG.opening :
    step === 'shaking' ? CHEST_IMG[frame] :
    CHEST_IMG.closed

  if (!chest && step === 'idle') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <style>{`
        @keyframes cardReveal {
          from { opacity: 0; transform: scale(0.6) rotateY(90deg); }
          to   { opacity: 1; transform: scale(1) rotateY(0deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* PHASE COFFRE */}
      {step !== 'revealed' && (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-8 px-6"
          onClick={step === 'idle' ? handleTap : undefined}
          style={{ cursor: step === 'idle' ? 'pointer' : 'default' }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            {chest?.chest?.name ?? 'Coffre'}
          </p>

          <div className="relative">
            {/* Halo lumineux derrière le coffre pendant le tremblement */}
            {step === 'shaking' && (
              <div className="absolute inset-0 rounded-full blur-3xl bg-yellow-400/30 scale-150 animate-pulse" />
            )}
            <img
              src={chestSrc}
              alt="coffre"
              className="w-64 h-64 object-contain select-none relative z-10"
              draggable={false}
              style={{
                filter: step === 'shaking'
                  ? 'drop-shadow(0 0 24px rgba(255,180,0,0.8))'
                  : 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))',
                transform: step === 'opening' ? 'scale(1.1)' : 'scale(1)',
                transition: step === 'opening' ? 'transform 0.5s ease-out' : undefined,
              }}
            />
          </div>

          {chest?.chest?.rarity && (
            <RarityBadge rarity={chest.chest.rarity as any} size="md" />
          )}

          {step === 'idle' && (
            <div className="text-center space-y-3">
              <p className="text-muted-foreground text-sm">
                {chest?.chest?.description ?? 'Tape pour ouvrir'}
              </p>
              <Button onClick={handleTap} className="h-14 px-10 text-base font-black">
                Ouvrir le coffre
              </Button>
            </div>
          )}

          {step === 'shaking' && (
            <p className="text-sm text-yellow-400 font-bold animate-pulse">Quelque chose remue…</p>
          )}
          {step === 'opening' && (
            <p className="text-sm text-accent font-bold animate-pulse">Ça s'ouvre…</p>
          )}
        </div>
      )}

      {/* PHASE REVEAL */}
      {step === 'revealed' && reward && (
        <div className="flex-1 flex flex-col items-center justify-between px-6 py-10"
          style={{ animation: 'fadeUp 0.4s ease-out' }}>

          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-widest text-accent font-bold">Reward débloquée !</p>
          </div>

          {/* Card */}
          <div
            className={`relative w-52 h-72 rounded-3xl overflow-hidden border-2 shadow-2xl ${RARITY_COLORS[reward.rarity]}`}
            style={{
              animation: 'cardReveal 0.6s ease-out',
              boxShadow: reward.rarity === 'legendary'
                ? '0 0 48px rgba(250,200,50,0.7), 0 0 16px rgba(250,200,50,0.4)'
                : reward.rarity === 'epic'
                ? '0 0 32px rgba(168,85,247,0.6)'
                : reward.rarity === 'rare'
                ? '0 0 24px rgba(96,165,250,0.5)'
                : undefined,
            }}
          >
            <img src="/cards/card.jpg" alt="reward card" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-black text-lg leading-tight">{reward.name}</p>
              <p className="text-white/60 text-xs capitalize mt-0.5">{reward.type}</p>
            </div>
            <div className="absolute top-3 right-3 text-2xl">{reward.asset_key ?? '🏆'}</div>
          </div>

          <div className="w-full space-y-3 text-center">
            <RarityBadge rarity={reward.rarity} size="lg" className="mx-auto" />
            {reward.description && (
              <p className="text-sm text-muted-foreground italic">"{reward.description}"</p>
            )}
            <div className="space-y-2 pt-2">
              {reward.is_equippable && (
                <Button className="w-full h-12 font-bold" onClick={() => navigate('/collection')}>
                  Équiper maintenant
                </Button>
              )}
              <Button variant="outline" className="w-full h-12" onClick={() => navigate('/collection')}>
                Voir ma collection
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

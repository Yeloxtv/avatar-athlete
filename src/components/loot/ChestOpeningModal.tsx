import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RarityBadge } from '@/components/loot/RarityBadge'
import { useChestReward } from '@/hooks/useChestReward'
import { UserChest, RewardDefinition, RARITY_COLORS } from '@/types/loot'

interface ChestOpeningModalProps {
  userChest: UserChest
  userId: string
  open: boolean
  onClose: () => void
}

type Step = 'idle' | 'shaking' | 'opening' | 'revealed'

// Pour l'instant on a uniquement common — à étendre quand on aura d'autres assets
const CHEST_IMG: Record<string, { closed: string; shaking: string; opening: string }> = {
  default: {
    closed:  '/chests/chest-common-1.jpg',
    shaking: '/chests/chest-common-2.jpg',
    opening: '/chests/chest-common-3.jpg',
  },
}

function getChestImgs(slug?: string) {
  return CHEST_IMG[slug ?? ''] ?? CHEST_IMG.default
}

export function ChestOpeningModal({ userChest, userId, open, onClose }: ChestOpeningModalProps) {
  const navigate = useNavigate()
  const { openChest } = useChestReward()
  const [step, setStep] = useState<Step>('idle')
  const [frame, setFrame] = useState<'closed' | 'shaking'>('closed')
  const [reward, setReward] = useState<RewardDefinition | null>(null)

  const imgs = getChestImgs(userChest.chest?.slug)
  const chestName = userChest.chest?.name ?? 'Coffre'
  const chestRarity = (userChest.chest?.rarity ?? 'common') as any

  // Reset quand le modal se ferme/rouvre
  useEffect(() => {
    if (!open) { setStep('idle'); setFrame('closed'); setReward(null) }
  }, [open])

  // Animation tremblement : alterne frame 1↔2 toutes les 120ms
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
    if (step !== 'idle') return

    // Phase 1 — tremblement 1.2s
    setStep('shaking')
    await new Promise(r => setTimeout(r, 1200))

    // Phase 2 — ouverture (frame 3) 600ms
    setStep('opening')
    setFrame('closed') // reset frame pendant qu'on fetch
    const result = await openChest(userId, userChest.id)
    await new Promise(r => setTimeout(r, 600))

    if (result) {
      setReward(result)
      setStep('revealed')
    } else {
      setStep('idle')
    }
  }

  const handleClose = () => {
    setStep('idle')
    setFrame('closed')
    setReward(null)
    onClose()
  }

  const chestSrc =
    step === 'opening' ? imgs.opening :
    step === 'shaking' ? imgs[frame] :
    imgs.closed

  return (
    <Dialog open={open} onOpenChange={o => !o && handleClose()}>
      <DialogContent className="max-w-sm mx-2 p-0 overflow-hidden border-0 bg-transparent shadow-none">

        {step !== 'revealed' && (
          <div
            className="flex flex-col items-center gap-6 p-6 rounded-2xl bg-background border border-muted/30"
            onClick={step === 'idle' ? handleTap : undefined}
            style={{ cursor: step === 'idle' ? 'pointer' : 'default' }}
          >
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{chestName}</p>

            <div className="relative w-48 h-48 flex items-center justify-center">
              <img
                src={chestSrc}
                alt="coffre"
                className="w-full h-full object-contain select-none"
                draggable={false}
                style={{
                  filter: step === 'shaking' ? 'drop-shadow(0 0 20px rgba(255,180,0,0.6))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                  transition: step === 'opening' ? 'transform 0.4s ease-out, opacity 0.3s' : undefined,
                  transform: step === 'opening' ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            </div>

            <RarityBadge rarity={chestRarity} size="md" />

            {step === 'idle' && (
              <>
                <p className="text-xs text-muted-foreground text-center">
                  {userChest.chest?.description ?? 'Tape pour ouvrir'}
                </p>
                <Button onClick={handleTap} className="w-full h-12 text-base font-bold">
                  Ouvrir le coffre
                </Button>
              </>
            )}

            {(step === 'shaking' || step === 'opening') && (
              <p className="text-sm text-muted-foreground animate-pulse">
                {step === 'shaking' ? 'Quelque chose remue…' : 'Ça s\'ouvre…'}
              </p>
            )}
          </div>
        )}

        {step === 'revealed' && reward && (
          <div className="flex flex-col items-center gap-5 p-6 rounded-2xl bg-background border border-muted/30">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Reward débloquée !</p>

            {/* Card reward */}
            <div
              className={`relative w-40 h-56 rounded-2xl overflow-hidden border-2 shadow-2xl ${RARITY_COLORS[reward.rarity]}`}
              style={{
                boxShadow: reward.rarity === 'legendary'
                  ? '0 0 32px rgba(250,200,50,0.6), 0 0 8px rgba(250,200,50,0.3)'
                  : reward.rarity === 'epic'
                  ? '0 0 24px rgba(168,85,247,0.5)'
                  : undefined,
                animation: 'cardReveal 0.5s ease-out',
              }}
            >
              <img src="/cards/card.jpg" alt="card" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white font-black text-sm leading-tight">{reward.name}</p>
                <p className="text-white/70 text-xs capitalize">{reward.type}</p>
              </div>
              <div className="absolute top-2 right-2">
                <span className="text-lg">{reward.asset_key ?? '🏆'}</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <RarityBadge rarity={reward.rarity} size="sm" />
              {reward.description && (
                <p className="text-xs text-muted-foreground italic mt-2">"{reward.description}"</p>
              )}
            </div>

            <div className="w-full space-y-2">
              {reward.is_equippable && (
                <Button className="w-full h-11" onClick={() => { handleClose(); navigate('/collection') }}>
                  Équiper maintenant
                </Button>
              )}
              <Button variant="outline" className="w-full h-11" onClick={() => { handleClose(); navigate('/collection') }}>
                Voir ma collection
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleClose}>
                Fermer
              </Button>
            </div>
          </div>
        )}

        <style>{`
          @keyframes cardReveal {
            from { opacity: 0; transform: scale(0.7) rotateY(90deg); }
            to   { opacity: 1; transform: scale(1) rotateY(0deg); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}

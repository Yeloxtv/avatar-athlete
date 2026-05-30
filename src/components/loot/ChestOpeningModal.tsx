import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RarityBadge } from '@/components/loot/RarityBadge'
import { useChestReward } from '@/hooks/useChestReward'
import { UserChest, RewardDefinition, RARITY_COLORS, CHEST_EMOJI } from '@/types/loot'

interface ChestOpeningModalProps {
  userChest: UserChest
  userId: string
  open: boolean
  onClose: () => void
}

type Step = 'closed' | 'opening' | 'revealed'

export function ChestOpeningModal({ userChest, userId, open, onClose }: ChestOpeningModalProps) {
  const navigate = useNavigate()
  const { openChest } = useChestReward()
  const [step, setStep] = useState<Step>('closed')
  const [reward, setReward] = useState<RewardDefinition | null>(null)

  const chestRarity = (userChest.chest?.rarity ?? 'common') as any
  const chestEmoji = CHEST_EMOJI[chestRarity]
  const chestName = userChest.chest?.name ?? 'Coffre'

  const handleOpen = async () => {
    if (step !== 'closed') return
    setStep('opening')
    const result = await openChest(userId, userChest.id)
    if (result) {
      setReward(result)
      setStep('revealed')
    } else {
      setStep('closed')
    }
  }

  const handleClose = () => {
    setStep('closed')
    setReward(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-sm mx-2 text-center">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 'revealed' ? '🎉 Reward débloquée !' : chestName}
          </DialogTitle>
        </DialogHeader>

        {step === 'closed' && (
          <div className="space-y-6 py-4">
            <div
              className="text-8xl mx-auto cursor-pointer select-none transition-transform hover:scale-110 active:scale-95"
              style={{ filter: 'drop-shadow(0 0 16px rgba(255,200,50,0.4))' }}
            >
              {chestEmoji}
            </div>
            <RarityBadge rarity={chestRarity} size="lg" className="mx-auto" />
            <p className="text-sm text-muted-foreground">
              {userChest.chest?.description ?? 'Un coffre t\'attend.'}
            </p>
            <Button onClick={handleOpen} className="w-full h-12 text-base font-bold" disabled={step !== 'closed'}>
              Ouvrir le coffre
            </Button>
          </div>
        )}

        {step === 'opening' && (
          <div className="space-y-4 py-8">
            <div className="text-7xl mx-auto animate-bounce">{chestEmoji}</div>
            <p className="text-muted-foreground text-sm">Ouverture en cours…</p>
          </div>
        )}

        {step === 'revealed' && reward && (
          <div className="space-y-5 py-4">
            <div
              className={`text-6xl mx-auto w-24 h-24 rounded-full flex items-center justify-center border-2 ${RARITY_COLORS[reward.rarity]}`}
              style={{ boxShadow: reward.rarity === 'legendary' ? '0 0 24px rgba(250,200,50,0.5)' : undefined }}
            >
              {reward.asset_key ?? '🏆'}
            </div>
            <div className="space-y-1">
              <RarityBadge rarity={reward.rarity} size="sm" className="mx-auto" />
              <p className="text-xl font-black mt-2">{reward.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{reward.type}</p>
              {reward.description && (
                <p className="text-sm text-muted-foreground italic mt-2">"{reward.description}"</p>
              )}
            </div>
            <div className="space-y-2 pt-2">
              {reward.is_equippable && (
                <Button
                  className="w-full h-11"
                  onClick={() => { handleClose(); navigate('/collection') }}
                >
                  Équiper maintenant
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => { handleClose(); navigate('/collection') }}
              >
                Voir ma collection
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleClose}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

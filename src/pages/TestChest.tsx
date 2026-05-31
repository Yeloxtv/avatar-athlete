import { useState } from 'react'
import { ChestOpeningModal } from '@/components/loot/ChestOpeningModal'
import { Button } from '@/components/ui/button'
import { UserChest } from '@/types/loot'

const FAKE_CHEST: UserChest = {
  id: 'test-chest-id',
  user_id: 'test-user',
  chest_id: 'test',
  status: 'unlocked',
  session_id: null,
  earned_at: new Date().toISOString(),
  opened_at: null,
  chest: {
    id: 'test',
    slug: 'common_chest',
    name: 'Common Chest',
    description: 'Un coffre de test.',
    rarity: 'common',
    prob_common: 70,
    prob_rare: 25,
    prob_epic: 4,
    prob_legendary: 1,
  },
}

export default function TestChest() {
  const [open, setOpen] = useState(false)

  // Mock openChest — bypasse Supabase, retourne direct une fake reward
  const fakeUserId = 'test-user'

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6">
      <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Test animation coffre</p>
      <Button onClick={() => setOpen(true)} className="h-12 px-8 text-base font-bold">
        Ouvrir le coffre
      </Button>

      {open && (
        <ChestOpeningModal
          userChest={FAKE_CHEST}
          userId={fakeUserId}
          open={open}
          onClose={() => setOpen(false)}
          testMode
        />
      )}
    </div>
  )
}

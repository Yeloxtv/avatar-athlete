import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { useStreak } from '@/hooks/useStreak'

import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dumbbell, MapPin, ChevronRight, Calendar, Flame, Swords, Target, Gift, Package } from 'lucide-react'
import { useChestReward } from '@/hooks/useChestReward'
import { useCollection } from '@/hooks/useCollection'
import { PlayerCard } from '@/components/profile/PlayerCard'
import { CHEST_EMOJI } from '@/types/loot'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

interface PersonalQuest {
  id: string
  title: string
  day_of_week: number
  exercises_count: number
  estimated_duration: number
}

interface PersonalProgram {
  id: string
  slug: string
  title: string
  quests: PersonalQuest[]
}

interface PublicCampaign {
  id: string
  title: string
  description: string
  slug: string
  total_quests: number
  completed_quests: number
}

export default function Home() {
  const { profile } = useProfile()
  const { user } = useAuth()
  const { streak } = useStreak(profile?.id)
const { pendingChest, loadPendingChest } = useChestReward()
  const { equipped } = useCollection()
  const [personalProgram, setPersonalProgram] = useState<PersonalProgram | null>(null)
  const [publicCampaigns, setPublicCampaigns] = useState<PublicCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDayIndex, setActiveDayIndex] = useState(() => {
    const jsDay = new Date().getDay()
    return jsDay === 0 ? 6 : jsDay - 1
  })

  const todayIndex = (() => {
    const jsDay = new Date().getDay()
    return jsDay === 0 ? 6 : jsDay - 1
  })()

  useEffect(() => {
    if (profile && user) { fetchHomeData(); loadPendingChest(user.id) }
  }, [profile, user])

  const fetchHomeData = async () => {
    if (!profile || !user) return
    try {
      // Programme perso — use auth UID to match RLS owner_user_id
      const { data: personalData } = await supabase
        .from('campaigns')
        .select(`id, slug, title, quests(id, title, order_index, day_of_week, quest_exercises(id))`)
        .eq('owner_user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (personalData) {
        const quests = (personalData.quests || [])
          .filter(q => q.day_of_week !== null)
          .map(q => ({
            id: q.id,
            title: q.title,
            day_of_week: q.day_of_week as number,
            exercises_count: q.quest_exercises?.length || 0,
            estimated_duration: Math.max(45, (q.quest_exercises?.length || 0) * 6),
          }))
        setPersonalProgram({ id: personalData.id, slug: personalData.slug, title: personalData.title, quests })
      }

      // Séances de cette semaine (lundi → dimanche)
      // Campagnes publiques
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select(`id, title, description, slug, quests!inner(id, user_quests!left(status))`)
        .is('owner_user_id', null)
        .eq('is_active', true)
        .eq('is_published', true)
        .order('created_at', { ascending: true })

      const processed = (campaignsData || []).map(c => ({
        id: c.id,
        title: c.title,
        description: c.description || '',
        slug: c.slug,
        total_quests: c.quests?.length || 0,
        completed_quests: c.quests?.filter((q: any) =>
          q.user_quests?.some((uq: any) => uq.status === 'completed')
        ).length || 0,
      }))
      setPublicCampaigns(processed)

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const isGuided = profile?.user_mode === 'guided'
  const isAutonomous = profile?.user_mode === 'autonomous'

  const todayQuest = personalProgram?.quests.find(q => q.day_of_week === activeDayIndex) ?? null
  const streakLabel = streak.completedToday
    ? `${streak.currentStreak} jour${streak.currentStreak > 1 ? 's' : ''}`
    : streak.isActive
      ? `${streak.currentStreak} jour${streak.currentStreak > 1 ? 's' : ''} à sauver`
      : 'À relancer'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-6">

      {/* WIDGET PROFIL */}
      <div className="rounded-2xl border border-accent/20 bg-card/60 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-2xl shrink-0">
            {profile?.avatar_emoji || '🏋️'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-lg leading-tight truncate">{profile?.display_name || 'Athlète'}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <div className="flex gap-1 flex-1">
                {DAYS.map((day, i) => {
                  const done = streak.weekDays.includes(i)
                  const isToday = i === todayIndex
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className={`w-full h-1.5 rounded-full transition-all ${
                        done ? 'bg-orange-400' : isToday ? 'bg-accent/40' : 'bg-muted/40'
                      }`} />
                      <span className={`text-[9px] ${isToday ? 'text-accent font-bold' : 'text-muted-foreground'}`}>
                        {day}
                      </span>
                    </div>
                  )
                })}
              </div>
              <span className="text-[10px] font-semibold text-orange-400 shrink-0">{streakLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* COFFRE EN ATTENTE */}
      {pendingChest && (
        <Link to="/collection" className="flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/5 px-4 py-3 hover:bg-accent/10 transition-colors">
          <span className="text-2xl shrink-0">{CHEST_EMOJI[(pendingChest.chest?.rarity ?? 'common') as any]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">Coffre à ouvrir !</p>
            <p className="text-xs text-muted-foreground">{pendingChest.chest?.name ?? 'Coffre'} · Tap pour ouvrir</p>
          </div>
          <Gift className="w-4 h-4 text-accent shrink-0" />
        </Link>
      )}

      {/* PROGRAMME PERSO */}
      {!isGuided && personalProgram && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Swords className="w-4 h-4 text-accent" />
              Programme
            </h2>
            <Link to={`/campaign/${personalProgram.slug}`} className="text-xs text-accent flex items-center gap-1">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Sélecteur jours */}
          <div className="flex gap-1.5">
            {DAYS.map((day, i) => {
              const quest = personalProgram.quests.find(q => q.day_of_week === i)
              const isActive = i === activeDayIndex
              const isToday = i === todayIndex
              const hasSession = !!quest
              return (
                <button
                  key={day}
                  onClick={() => setActiveDayIndex(i)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-lg'
                      : hasSession
                      ? 'bg-muted/60 text-foreground hover:bg-muted'
                      : 'bg-muted/20 text-muted-foreground'
                  }`}
                >
                  <span>{day}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    hasSession
                      ? isActive ? 'bg-accent-foreground' : 'bg-accent'
                      : 'bg-transparent'
                  }`} />
                  {isToday && !isActive && (
                    <span className="w-1 h-1 rounded-full bg-orange-400" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Card séance */}
          {todayQuest ? (
            <div className="relative rounded-2xl border border-accent/30 bg-accent/5 overflow-hidden">
              {/* Bande décorative */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />
              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-accent uppercase tracking-widest font-medium mb-1">
                      {activeDayIndex === todayIndex ? 'Quête du jour' : DAYS[activeDayIndex]}
                    </p>
                    <h3 className="font-bold text-xl leading-tight">{todayQuest.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold">{todayQuest.estimated_duration}<span className="text-xs font-normal text-muted-foreground"> min</span></div>
                    <div className="text-xs text-muted-foreground">{todayQuest.exercises_count} exercices</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-accent/20 bg-background/40 p-3">
                    <div className="text-xs text-muted-foreground">Objectif</div>
                    <div className="font-bold">{Math.max(1, todayQuest.exercises_count * 3)} séries</div>
                  </div>
                  <div className="rounded-xl border border-accent/20 bg-background/40 p-3">
                    <div className="text-xs text-muted-foreground">Séries</div>
                    <div className="font-bold text-accent">{Math.max(1, todayQuest.exercises_count * 3)}</div>
                  </div>
                </div>
                <Button asChild className="w-full h-11 text-base font-bold">
                  <Link to={`/train/${todayQuest.id}`}>
                    ⚔️ Lancer la séance
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-dashed border-2 border-muted/40 p-6 text-center text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Repos ce jour</p>
              <p className="text-xs opacity-60 mt-0.5">Récupération active</p>
            </div>
          )}
        </section>
      )}

      {/* CRÉER UN PROGRAMME — masqué en mode guidé */}
      {!isGuided && !personalProgram && (
        <section>
          <Link to="/my-program">
            <div className="rounded-2xl border border-dashed border-accent/30 p-5 text-center space-y-2 hover:border-accent/60 hover:bg-accent/5 transition-all">
              <div className="text-3xl">⚔️</div>
              <p className="font-semibold">Créer mon programme</p>
              <p className="text-xs text-muted-foreground">Construis ton planning d'entraînement personnalisé</p>
            </div>
          </Link>
        </section>
      )}

      {!isGuided && personalProgram && (
        <Button asChild variant="outline" className="w-full h-11 border-accent/30 text-accent hover:bg-accent/5 hover:border-accent/60 font-semibold">
          <Link to="/my-program">
            <Swords className="w-4 h-4 mr-2" />
            Modifier mon programme
          </Link>
        </Button>
      )}

      {/* CAMPAGNES PUBLIQUES — visible uniquement en mode guidé */}
      {!isAutonomous && publicCampaigns.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            {isGuided ? 'Tes campagnes' : 'Explorer'}
          </h2>
          {isGuided && (
            <p className="text-xs text-muted-foreground -mt-1">
              Complète les quêtes dans l'ordre pour progresser et débloquer la suite.
            </p>
          )}

          <div className="space-y-3">
            {publicCampaigns.map(campaign => {
              const progress = campaign.total_quests
                ? Math.round((campaign.completed_quests / campaign.total_quests) * 100)
                : 0
              return (
                <Card key={campaign.id} className="border-muted/40">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{campaign.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{campaign.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {campaign.completed_quests}/{campaign.total_quests}
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link to={`/campaign/${campaign.slug}`}>
                        <Dumbbell className="w-3.5 h-3.5 mr-2" />
                        {campaign.completed_quests > 0 ? 'Continuer' : 'Commencer'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

    </div>
  )
}

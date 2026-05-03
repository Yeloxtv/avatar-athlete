import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dumbbell, MapPin, ChevronRight, Calendar } from 'lucide-react'

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
  const [personalProgram, setPersonalProgram] = useState<PersonalProgram | null>(null)
  const [publicCampaigns, setPublicCampaigns] = useState<PublicCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDayIndex, setActiveDayIndex] = useState(() => {
    // 0=Lun ... 6=Dim, JS: 0=Dim 1=Lun ... 6=Sam
    const jsDay = new Date().getDay()
    return jsDay === 0 ? 6 : jsDay - 1
  })

  useEffect(() => {
    if (profile) fetchHomeData()
  }, [profile])

  const fetchHomeData = async () => {
    if (!profile) return
    try {
      // Programme perso (owner_user_id = mon profil)
      const { data: personalData } = await supabase
        .from('campaigns')
        .select(`
          id, slug, title,
          quests(id, title, order_index, day_of_week, quest_exercises(id))
        `)
        .eq('owner_user_id', profile.id)
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

      // Campagnes publiques (sans owner)
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select(`
          id, title, description, slug,
          quests!inner(id, user_quests!left(status))
        `)
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

  const todayQuest = personalProgram?.quests.find(q => q.day_of_week === activeDayIndex) ?? null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Salut {profile?.display_name || 'Athlète'} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Prêt à t'entraîner ?</p>
      </div>

      {/* MON PROGRAMME */}
      {personalProgram && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-accent" />
              Mon programme
            </h2>
            <Link to={`/campaign/${personalProgram.slug}`} className="text-xs text-accent flex items-center gap-1">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Sélecteur jour */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {DAYS.map((day, i) => {
              const quest = personalProgram.quests.find(q => q.day_of_week === i)
              const isActive = i === activeDayIndex
              const hasSession = !!quest
              return (
                <button
                  key={day}
                  onClick={() => setActiveDayIndex(i)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-lg scale-105'
                      : hasSession
                      ? 'bg-muted/60 text-foreground hover:bg-muted'
                      : 'bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <span>{day}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasSession ? (isActive ? 'bg-accent-foreground' : 'bg-accent') : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>

          {/* Séance du jour sélectionné */}
          {todayQuest ? (
            <Card className="border border-accent/30 bg-accent/5">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{DAYS[activeDayIndex]}</p>
                    <h3 className="font-bold text-lg leading-tight">{todayQuest.title}</h3>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="font-semibold text-foreground">{todayQuest.estimated_duration} min</div>
                    <div>{todayQuest.exercises_count} exercices</div>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/train/${todayQuest.id}`}>C'est parti</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-4 text-center text-muted-foreground text-sm">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Repos ce jour
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* CAMPAGNES PUBLIQUES */}
      {publicCampaigns.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Explorer
          </h2>

          <div className="space-y-3">
            {publicCampaigns.map(campaign => {
              const progress = campaign.total_quests
                ? Math.round((campaign.completed_quests / campaign.total_quests) * 100)
                : 0
              return (
                <Card key={campaign.id} className="rpg-card">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{campaign.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{campaign.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {campaign.completed_quests}/{campaign.total_quests}
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link to={`/campaign/${campaign.slug}`}>
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

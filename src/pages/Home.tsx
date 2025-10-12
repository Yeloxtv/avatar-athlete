import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Zap, Dumbbell, Timer, Target, Users, Flame, Clock } from 'lucide-react'

interface Campaign {
  id: string
  title: string
  description: string
  slug: string
  is_active: boolean
  total_quests?: number
  completed_quests?: number
  quests?: Array<{
    id: string
    user_quests?: Array<{ status: string }>
  }>
}

interface HiitWorkout {
  id: string
  title: string
  description: string
  workout_type: 'amrap' | 'emom' | 'tabata' | 'fortime'
  total_minutes: number
  exercises_count: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  exercises?: Array<{ id: string }>
}

interface StrengthWorkout {
  id: string
  title: string
  description: string
  category?: 'upper' | 'lower' | 'fullbody'
  exercises_count: number
  estimated_duration?: number // ← Rendre optionnel car calculé
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  quest_exercises?: Array<{ id: string }>
}

export default function Home() {
  const { profile } = useProfile()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [hiitWorkouts, setHiitWorkouts] = useState<HiitWorkout[]>([])
  const [strengthWorkouts, setStrengthWorkouts] = useState<StrengthWorkout[]>([])
  const [loading, setLoading] = useState(true)
  
  // ✅ AJOUTER : États pour les filtres
  const [selectedHiitType, setSelectedHiitType] = useState<string>('all')

  useEffect(() => {
    fetchHomeData()
  }, [profile])

  const fetchHomeData = async () => {
    if (!profile) return

    try {
      // Récupérer les campagnes avec progression
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select(`
          id, title, description, slug, is_active,
          quests!inner(
            id,
            user_quests!left(status)
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      // Transformer les données de campagnes
      const processedCampaigns = campaignsData?.map(campaign => ({
        ...campaign,
        total_quests: campaign.quests?.length || 0,
        completed_quests: campaign.quests?.filter(quest => 
          quest.user_quests?.some(uq => uq.status === 'completed')
        ).length || 0
      })) || []

      setCampaigns(processedCampaigns)

      // ✅ CORRIGER : Utiliser quest_exercises au lieu d'exercises
      const { data: hiitData, error: hiitError } = await supabase
        .from('quests')
        .select('id, title, description, workout_type, total_minutes, quest_exercises(id)')
        .in('workout_type', ['amrap', 'emom', 'tabata', 'fortime'])
        .eq('is_one_shot', true)
        .order('created_at', { ascending: false })
        .limit(20)

      console.log('HIIT Data:', hiitData, 'Error:', hiitError) // ← Debug

      const processedHiit = hiitData?.map(workout => ({
        ...workout,
        exercises_count: workout.quest_exercises?.length || 0, // ← Utiliser quest_exercises
        difficulty: 'MEDIUM' as const
      })) || []

      setHiitWorkouts(processedHiit)

      // ✅ CORRIGER : Enlever estimated_duration qui n'existe pas
      const { data: strengthData, error: strengthError } = await supabase
        .from('quests')
        .select('id, title, description, quest_exercises(id)')
        .eq('workout_type', 'strength')
        .eq('is_one_shot', true)
        .order('created_at', { ascending: false })
        .limit(20)

      console.log('Strength Data:', strengthData, 'Error:', strengthError) // ← Debug

      const processedStrength = strengthData?.map(workout => {
        const exerciseCount = workout.quest_exercises?.length || 0
        // Estimer 5-7 minutes par exercice + repos
        const estimatedDuration = Math.max(30, exerciseCount * 6)
        
        return {
          ...workout,
          exercises_count: exerciseCount,
          estimated_duration: estimatedDuration,
          difficulty: exerciseCount > 8 ? 'HARD' : exerciseCount > 5 ? 'MEDIUM' : 'EASY' as const,
          category: 'fullbody' as const
        }
      }) || []

      setStrengthWorkouts(processedStrength)

    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'HARD': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getHiitTypeIcon = (type: string) => {
    switch (type) {
      case 'amrap': return <Target className="w-4 h-4" />
      case 'emom': return <Clock className="w-4 h-4" />
      case 'tabata': return <Zap className="w-4 h-4" />
      case 'fortime': return <Timer className="w-4 h-4" />
      default: return <Flame className="w-4 h-4" />
    }
  }

  const getHiitTypeName = (type: string) => {
    switch (type) {
      case 'amrap': return 'AMRAP'
      case 'emom': return 'EMOM'
      case 'tabata': return 'Tabata'
      case 'fortime': return 'For Time'
      default: return 'HIIT'
    }
  }

  const getStrengthCategoryIcon = (category: string) => {
    switch (category) {
      case 'upper': return '💪'
      case 'lower': return '🦵'
      case 'fullbody': return '🏋️'
      default: return '💪'
    }
  }

  const getStrengthCategoryName = (category: string) => {
    switch (category) {
      case 'upper': return 'Haut du corps'
      case 'lower': return 'Bas du corps'
      case 'fullbody': return 'Full Body'
      default: return 'Musculation'
    }
  }

  // ✅ AJOUTER : Fonction de filtrage HIIT
  const getFilteredHiitWorkouts = () => {
    if (selectedHiitType === 'all') {
      return hiitWorkouts
    }
    return hiitWorkouts.filter(workout => workout.workout_type === selectedHiitType)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8"> {/* ← Design existant */}
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          Salut {profile?.first_name || 'Athlète'} ! 👋
        </h1>
        <p className="text-xl text-muted-foreground">
          Prêt à t'entraîner aujourd'hui ?
        </p>
      </div>

      {/* Navigation par onglets */}
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Campagnes</span>
          </TabsTrigger>
          <TabsTrigger value="hiit" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">HIIT</span>
          </TabsTrigger>
          <TabsTrigger value="strength" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            <span className="hidden sm:inline">Musculation</span>
          </TabsTrigger>
        </TabsList>

        {/* CAMPAGNES */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-accent" />
              Campagnes d'entraînement
            </h2>
            <p className="text-muted-foreground">
              Suis un programme structuré avec progression et histoire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="rpg-card hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{campaign.title}</span>
                    <Badge variant="outline" className="bg-accent/10">
                      <Users className="w-3 h-3 mr-1" />
                      Campagne
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {campaign.description}
                  </p>
                  
                  {/* Progression */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progression</span>
                      <span>{campaign.completed_quests}/{campaign.total_quests} quêtes</span>
                    </div>
                    <Progress 
                      value={campaign.total_quests ? (campaign.completed_quests! / campaign.total_quests) * 100 : 0} 
                      className="h-2"
                    />
                  </div>

                  <Button asChild className="w-full">
                    <Link to={`/campaign/${campaign.slug}`}>
                      Continuer l'aventure
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* HIIT */}
        <TabsContent value="hiit" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              Entraînements HIIT
            </h2>
            <p className="text-muted-foreground">
              Intensité maximale pour des résultats rapides
            </p>
          </div>

          {/* Sous-catégories HIIT - RENDRE CLIQUABLES */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {/* ✅ AJOUTER : Option "Tous" */}
            <Card 
              className={`text-center p-4 cursor-pointer transition-colors ${
                selectedHiitType === 'all' 
                  ? 'bg-accent/20 border-accent ring-2 ring-accent/50' 
                  : 'hover:bg-accent/5'
              }`}
              onClick={() => setSelectedHiitType('all')}
            >
              <div className="flex flex-col items-center gap-2">
                <Flame className="w-4 h-4" />
                <h3 className="font-semibold">Tous</h3>
                <p className="text-xs text-muted-foreground">Tous les HIIT</p>
              </div>
            </Card>

            {[
              { type: 'amrap', name: 'AMRAP', desc: 'Maximum de rounds' },
              { type: 'emom', name: 'EMOM', desc: 'Chaque minute' },
              { type: 'tabata', name: 'Tabata', desc: '20s/10s' },
              { type: 'fortime', name: 'For Time', desc: 'Le plus vite possible' }
            ].map((category) => (
              <Card 
                key={category.type} 
                className={`text-center p-4 cursor-pointer transition-colors ${
                  selectedHiitType === category.type 
                    ? 'bg-accent/20 border-accent ring-2 ring-accent/50' 
                    : 'hover:bg-accent/5'
                }`}
                onClick={() => setSelectedHiitType(category.type)}
              >
                <div className="flex flex-col items-center gap-2">
                  {getHiitTypeIcon(category.type)}
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredHiitWorkouts().map((workout) => (
              <Card key={workout.id} className="rpg-card hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="truncate">{workout.title}</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {getHiitTypeIcon(workout.workout_type)}
                        <span className="ml-1">{getHiitTypeName(workout.workout_type)}</span>
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {workout.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/30 rounded">
                      <div className="font-bold">{workout.total_minutes}</div>
                      <div className="text-muted-foreground">min</div>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded">
                      <div className="font-bold">{workout.exercises_count}</div>
                      <div className="text-muted-foreground">exercices</div>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded">
                      <div className={`text-xs px-2 py-1 rounded border font-medium ${getDifficultyColor(workout.difficulty)}`}>
                        {workout.difficulty}
                      </div>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link to={`/train/${workout.id}`}>
                      Commencer
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ✅ AJOUTER : Message si aucun résultat */}
          {getFilteredHiitWorkouts().length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun entraînement {selectedHiitType !== 'all' ? getHiitTypeName(selectedHiitType) : ''} disponible pour le moment.
              </p>
            </div>
          )}
        </TabsContent>

        {/* MUSCULATION */}
        <TabsContent value="strength" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Dumbbell className="w-6 h-6 text-accent" />
              Entraînements Musculation
            </h2>
            <p className="text-muted-foreground">
              Développe ta force et ta masse musculaire
            </p>
          </div>

          {/* Affichage direct des entraînements - SANS catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strengthWorkouts.map((workout) => (
              <Card key={workout.id} className="rpg-card hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="truncate">{workout.title}</span>
                    <Badge variant="outline" className="text-xs">
                      <span className="mr-1">{getStrengthCategoryIcon(workout.category || 'fullbody')}</span>
                      {getStrengthCategoryName(workout.category || 'fullbody')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {workout.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/30 rounded">
                      <div className="font-bold">{workout.estimated_duration}</div>
                      <div className="text-muted-foreground">min</div>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded">
                      <div className="font-bold">{workout.exercises_count}</div>
                      <div className="text-muted-foreground">exercices</div>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded">
                      <div className={`text-xs px-2 py-1 rounded border font-medium ${getDifficultyColor(workout.difficulty)}`}>
                        {workout.difficulty}
                      </div>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link to={`/train/${workout.id}`}>
                      Commencer
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message si aucun entraînement */}
          {strengthWorkouts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun entraînement de musculation disponible pour le moment.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { supabase, Quest, UserQuest, QuestExercise } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Target, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'

export default function Campaign() {
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [quests, setQuests] = useState<(Quest & { status: UserQuest['status']; exercises: QuestExercise[] })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      fetchQuests()
    }
  }, [profile])

  const fetchQuests = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('quests')
        .select(`
          *,
          user_quests!inner(status),
          quest_exercises(*)
        `)
        .eq('user_quests.user_id', profile.id)
        .order('order_index')

      if (error) throw error

      setQuests(data?.map(q => ({
        ...q,
        status: q.user_quests[0]?.status || 'locked',
        exercises: q.quest_exercises || []
      })) || [])

    } catch (error) {
      console.error('Error fetching quests:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les quêtes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case 'simple': return 'Simple'
      case 'for_time': return 'For Time'
      case 'tabata': return 'Tabata'
      case 'amrap': return 'AMRAP'
      case 'emom': return 'EMOM'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30'
      case 'available': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      case 'locked': return 'bg-muted/20 text-muted-foreground border-muted/30'
      default: return 'bg-muted/20 text-muted-foreground border-muted/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '✅ Terminée'
      case 'available': return '🎯 Disponible'
      case 'locked': return '🔒 Verrouillée'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">⚙️</div>
          <p className="text-muted-foreground">Chargement des quêtes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Campagne "J'aime pas le cardio"
            </h1>
            <p className="text-muted-foreground">
              {quests.filter(q => q.status === 'completed').length}/{quests.length} quêtes complétées
            </p>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {quests.map((quest, index) => (
            <Card 
              key={quest.id} 
              className={`border transition-all ${
                quest.status === 'completed' 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : quest.status === 'available'
                  ? 'border-accent/30 shadow-lg hover:shadow-xl cursor-pointer'
                  : 'border-muted/30 opacity-70'
              }`}
              onClick={() => quest.status === 'available' && navigate(`/train/${quest.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">
                        {quest.type === 'boss' ? '👑' : '⚔️'}
                      </span>
                      <span>{quest.title}</span>
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getStatusColor(quest.status)}>
                        {getStatusLabel(quest.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getWorkoutTypeLabel(quest.workout_type)}
                      </Badge>
                      {quest.type === 'boss' && (
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                          Boss Fight
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    Quête {index + 1}
                  </div>
                </div>
                <CardDescription>
                  {quest.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Workout Details */}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {quest.workout_type === 'tabata' && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quest.work_seconds}s travail / {quest.rest_seconds}s repos
                    </div>
                  )}
                  {quest.rounds_target > 0 && (
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {quest.rounds_target} tours
                    </div>
                  )}
                  {quest.total_minutes > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quest.total_minutes} minutes
                    </div>
                  )}
                </div>

                {/* Exercises */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Exercices :</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {quest.exercises.map((exercise) => (
                      <div 
                        key={exercise.id}
                        className="flex justify-between items-center p-2 bg-muted/20 rounded"
                      >
                        <span className="font-medium">{exercise.name}</span>
                        {exercise.target_reps > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {exercise.target_reps} reps
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* XP Rewards */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Récompenses XP :</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quest.xp_force > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>💪</span>
                        <span className="text-red-500">+{quest.xp_force} Force</span>
                      </div>
                    )}
                    {quest.xp_endurance > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>🏃</span>
                        <span className="text-green-500">+{quest.xp_endurance} Endurance</span>
                      </div>
                    )}
                    {quest.xp_agilite > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>⚡</span>
                        <span className="text-blue-500">+{quest.xp_agilite} Agilité</span>
                      </div>
                    )}
                    {quest.xp_mental > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>🧠</span>
                        <span className="text-purple-500">+{quest.xp_mental} Mental</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {quest.status === 'available' && (
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/train/${quest.id}`)
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Commencer la quête
                  </Button>
                )}
                
                {quest.status === 'completed' && (
                  <div className="text-center py-2 text-green-500 font-medium">
                    ✅ Quête terminée !
                  </div>
                )}
                
                {quest.status === 'locked' && (
                  <div className="text-center py-2 text-muted-foreground">
                    🔒 Complète la quête précédente pour débloquer
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
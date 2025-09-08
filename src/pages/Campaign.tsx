import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useQuests } from '@/hooks/useQuests'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Target, Zap } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'

export default function Campaign() {
  const navigate = useNavigate()
  const { slug } = useParams() // Récupère le slug depuis l'URL (optionnel)
  
  // État pour la campagne active
  const [activeCampaign, setActiveCampaign] = useState(null)
  const [campaignLoading, setCampaignLoading] = useState(true)
  
  // Récupérer la campagne (soit depuis slug, soit la campagne active par défaut)
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (slug) {
          // Si on a un slug dans l'URL, récupérer cette campagne spécifique
          const { data, error } = await supabase
            .from('campaigns')
            .select('id, slug, title, description')
            .eq('slug', slug)
            .single()
          
          if (error) throw error
          setActiveCampaign(data)
        } else {
          // Sinon, récupérer la première campagne active
          const { data, error } = await supabase
            .from('campaigns')
            .select('id, slug, title, description')
            .eq('is_active', true)
            .limit(1)
            .single()
          
          if (error) throw error
          setActiveCampaign(data)
        }
      } catch (error) {
        console.error('Error fetching campaign:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la campagne",
          variant: "destructive"
        })
      } finally {
        setCampaignLoading(false)
      }
    }
    
    fetchCampaign()
  }, [slug])
  
  // Charger les quêtes de la campagne active
  const { quests = [], loading: questsLoading } = useQuests({
    campaignId: activeCampaign?.id,
    enabled: !!activeCampaign
  })

  const loading = campaignLoading || questsLoading

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
      case 'available': 
      case 'unlocked': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      case 'locked': return 'bg-muted/20 text-muted-foreground border-muted/30'
      case 'done': return 'bg-green-500/20 text-green-500 border-green-500/30'
      case 'in_progress': return 'bg-orange-500/20 text-orange-500 border-orange-500/30'
      case 'todo': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      default: return 'bg-muted/20 text-muted-foreground border-muted/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '✅ Terminée'
      case 'available':
      case 'unlocked': return '🎯 Disponible'
      case 'locked': return '🔒 Verrouillée'
      case 'done': return '✅ Terminée'
      case 'in_progress': return '🔄 En cours'
      case 'todo': return '📝 À faire'
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

  if (!activeCampaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <p className="text-muted-foreground">Aucune campagne trouvée</p>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  const completedQuests = quests.filter(q => q?.user_status === 'done').length

  console.log('Campaign - Quests received:', quests) // AJOUTEZ
  console.log('Campaign - First quest:', quests[0]) // AJOUTEZ

  const isQuestAvailable = (quest, index) => {
    // La première quête est toujours disponible
    if (index === 0) return quest.user_status !== 'done' ? 'unlocked' : 'done'
    
    // Les autres quêtes sont disponibles si la précédente est complétée
    const previousQuest = quests[index - 1]
    if (previousQuest?.user_status === 'done') {
      return quest.user_status !== 'done' ? 'unlocked' : 'done'
    }
    
    return 'locked'
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
              Campagne "{activeCampaign.title}"
            </h1>
            <p className="text-muted-foreground">
              {completedQuests}/{quests.length} quêtes complétées
            </p>
            {activeCampaign.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {activeCampaign.description}
              </p>
            )}
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {quests.map((quest, index) => {
            const questStatus = isQuestAvailable(quest, index)
            const isClickable = questStatus === 'unlocked'
            
            return (
              <Card 
                key={quest.id} 
                className={`border transition-all ${
                  questStatus === 'done' 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : questStatus === 'unlocked'
                    ? 'border-accent/30 shadow-lg hover:shadow-xl cursor-pointer'
                    : 'border-muted/30 opacity-70'
                }`}
                onClick={() => isClickable && navigate(`/train/${quest.id}`)}
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
                        <Badge className={getStatusColor(questStatus)}>
                          {getStatusLabel(questStatus)}
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
                  <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
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
                  {quest.exercises && quest.exercises.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Exercices :</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {quest.exercises.map((exercise, exerciseIndex) => (
                          <div 
                            key={exercise.id || exerciseIndex}
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
                  )}

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
                  {questStatus === 'unlocked' && (
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
                  
                  {questStatus === 'done' && (
                    <div className="text-center py-2 text-green-500 font-medium">
                      ✅ Quête terminée !
                    </div>
                  )}
                  
                  {questStatus === 'locked' && (
                    <div className="text-center py-2 text-muted-foreground">
                      🔒 Complète la quête précédente pour débloquer
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Debug en mode développement */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-yellow-500/50 bg-yellow-50/10">
            <CardHeader>
              <CardTitle className="text-yellow-600">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div>Slug from URL: {slug || 'None'}</div>
                <div>Campaign loaded: {activeCampaign?.title || 'None'}</div>
                <div>Campaign ID: {activeCampaign?.id || 'None'}</div>
                <div>Quests loaded: {quests.length}</div>
                <div>Campaign loading: {campaignLoading ? 'Yes' : 'No'}</div>
                <div>Quests loading: {questsLoading ? 'Yes' : 'No'}</div>
                {quests.length > 0 && (
                 <div>Quest statuses: {JSON.stringify(quests.map(q => ({ 
    title: q?.title, 
    user_status: q?.user_status 
  })))}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
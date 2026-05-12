import { useState, useEffect } from 'react'
import { useSessionSummary } from '@/hooks/useSessionSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Quest, WorkoutSession } from '@/types/workout'
import { Loader2, Clock, TrendingUp, Trophy, Zap, Target, Star } from 'lucide-react'

interface SessionSummaryModalProps {
  isOpen: boolean
  quest: Quest | null
  session: WorkoutSession | null
  time: number
  onValidate: () => void
  onClose: () => void
}

export default function SessionSummaryModal({
  isOpen,
  quest,
  session,
  time,
  onValidate,
  onClose
}: SessionSummaryModalProps) {
  
  console.log('🎯 SessionSummaryModal rendu avec:', {
    isOpen,
    quest: !!quest,
    session: !!session,
    time
  })

  const { 
    summary, 
    loading, 
    generateSummary, 
    formatVolume, 
    getIntensityEmoji, 
    getProgressionMessage 
  } = useSessionSummary({ quest, session, time })

  const [isValidating, setIsValidating] = useState(false)

  // Générer le récapitulatif à l'ouverture
  useEffect(() => {
    if (isOpen && !summary && !loading) {
      generateSummary()
    }
  }, [isOpen, summary, loading, generateSummary])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleValidate = async () => {
    setIsValidating(true)
    await onValidate()
    setIsValidating(false)
  }

  if (!isOpen) {
    console.log('❌ SessionSummaryModal: isOpen = false, pas d\'affichage')
    return null
  }

  console.log('✅ SessionSummaryModal: Affichage de la modal')
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Loading State */}
        {loading && (
          <Card className="border-accent/30">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Génération du récapitulatif...</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Content */}
        {summary && (
          <div className="space-y-6">
            
            {/* Header - Félicitations */}
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-accent/5">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h1 className="text-2xl font-bold text-green-600 mb-2">
                  Séance terminée !
                </h1>
                <p className="text-muted-foreground">
                  {quest?.title} • {formatTime(summary.totalTime)}
                </p>
                
                {/* Stats rapides */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {formatVolume(summary.totalVolume)}
                    </div>
                    <div className="text-sm text-muted-foreground">Volume total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {summary.exercises.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Exercices</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">
                      {getIntensityEmoji(summary.intensity)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {summary.intensity}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Exercices détaillés */}
              <Card className="border-accent/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Exercices réalisés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {summary.exercises.map((exercise, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{exercise.exercise_name}</h4>
                        {summary.progression.newRecords.includes(exercise.exercise_name) && (
                          <Badge className="bg-yellow-500 text-white">
                            🏆 Record !
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Séries: </span>
                          <span className="font-medium">{exercise.sets_count}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Reps: </span>
                          <span className="font-medium">{exercise.reps_performed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Poids: </span>
                          <span className="font-medium">{exercise.weight_used}kg</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-muted/40">
                        <span className="text-xs text-muted-foreground">Volume: </span>
                        <span className="text-xs font-medium text-accent">
                          {formatVolume(exercise.volume)}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Stats et progression */}
              <div className="space-y-6">
                
                {/* Progression */}
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Progression
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <div className="text-lg font-medium text-accent mb-1">
                        {getProgressionMessage(summary.progression)}
                      </div>
                      {summary.progression.newRecords.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          🏆 {summary.progression.newRecords.length} nouveau(x) record(s) !
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Streak */}
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent" />
                      Dynamique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cette semaine</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-accent">{summary.streak.thisWeek}</span>
                        <span className="text-sm text-muted-foreground">séance(s)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Streak actuel</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-accent">{summary.streak.consecutive}</span>
                        <span className="text-sm text-muted-foreground">jour(s)</span>
                        {summary.streak.consecutive >= 3 && <span>🔥</span>}
                      </div>
                    </div>

                    {/* Barre de progression de la semaine */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Objectif semaine</span>
                        <span>{summary.streak.thisWeek}/4</span>
                      </div>
                      <Progress 
                        value={(summary.streak.thisWeek / 4) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* XP gagnée */}
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-accent" />
                      Expérience gagnée
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center p-3 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-accent mb-1">
                        +{summary.xp.total} XP
                      </div>
                      <div className="text-sm text-muted-foreground">Total gagné</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {summary.xp.force > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">💪 Force</span>
                          <span className="font-medium">+{summary.xp.force}</span>
                        </div>
                      )}
                      {summary.xp.endurance > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">🏃 Endurance</span>
                          <span className="font-medium">+{summary.xp.endurance}</span>
                        </div>
                      )}
                      {summary.xp.agilite > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">⚡ Agilité</span>
                          <span className="font-medium">+{summary.xp.agilite}</span>
                        </div>
                      )}
                      {summary.xp.mental > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">🧠 Mental</span>
                          <span className="font-medium">+{summary.xp.mental}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Actions */}
            <Card className="border-accent/30">
              <CardContent className="p-6">
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleValidate}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8"
                    disabled={isValidating}
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validation...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Valider et recevoir les récompenses
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="lg"
                    disabled={isValidating}
                  >
                    Fermer
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  🎁 Des récompenses vous attendent après validation !
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
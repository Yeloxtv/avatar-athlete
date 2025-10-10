import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHistory } from '@/hooks/useHistory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Trophy, Clock, Target, Play, Info } from 'lucide-react'
import { getWorkoutTypeLabel } from '@/utils/campaign'

export default function History() {
  const navigate = useNavigate()
  const { completedCampaigns, completedQuests, loading } = useHistory()
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null)

  const selectedQuest = completedQuests.find(q => q.id === selectedQuestId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Chargement de l'historique...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-primary" />
            Historique
          </h1>
          <p className="text-muted-foreground">
            Revivez vos accomplissements et recommencez vos défis favoris
          </p>
        </div>

        {/* Section Campagnes validées */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Campagnes Validées
          </h2>
          {completedCampaigns.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune campagne complétée pour le moment
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{campaign.title}</span>
                      <Badge variant="secondary">{campaign.completed_count} quête{campaign.completed_count > 1 ? 's' : ''}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Dernière complétion : {formatDate(campaign.last_completed_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => navigate(`/train/${campaign.slug}`)}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Rejouer la campagne
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Separator className="my-8" />

        {/* Section Quêtes validées */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Quêtes Validées
          </h2>
          {completedQuests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune quête complétée pour le moment
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedQuests.map((quest) => (
                <Card key={quest.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {quest.type === 'boss' ? '👹' : '⚔️'} {quest.title}
                        </CardTitle>
                        <CardDescription>
                          {quest.campaign_title} • {formatDate(quest.completed_at)}
                        </CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{getWorkoutTypeLabel(quest.workout_type)}</Badge>
                          {quest.latest_session && (
                            <>
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(quest.latest_session.total_time_seconds)}
                              </Badge>
                              <Badge variant="secondary">
                                {quest.latest_session.rounds_completed} tours
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigate(`/train/${quest.campaign_slug}`)}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Rejouer
                      </Button>
                      {quest.latest_session && (
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedQuestId(quest.id)}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog pour les détails de la quête */}
      <Dialog open={!!selectedQuestId} onOpenChange={() => setSelectedQuestId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedQuest?.title}</DialogTitle>
            <DialogDescription>
              Détails de votre dernière session
            </DialogDescription>
          </DialogHeader>
          {selectedQuest?.latest_session && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Temps total</div>
                  <div className="text-2xl font-bold">
                    {formatTime(selectedQuest.latest_session.total_time_seconds)}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Tours complétés</div>
                  <div className="text-2xl font-bold">
                    {selectedQuest.latest_session.rounds_completed}
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Date de complétion</div>
                <div className="font-medium">
                  {new Date(selectedQuest.latest_session.ended_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Type d'entraînement</div>
                <Badge>{getWorkoutTypeLabel(selectedQuest.workout_type)}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

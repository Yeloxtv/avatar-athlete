import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { useQuests } from '@/hooks/useQuests'
import { useBadges } from '@/hooks/useBadges'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge as BadgeComponent } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export default function Profil() {
  const { profile, loading: profileLoading, calculateLevel, getXpProgress } = useProfile()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  
  // État pour la campagne active
  const [activeCampaign, setActiveCampaign] = useState(null)
  const [campaignLoading, setCampaignLoading] = useState(true)
  
  // Récupérer la campagne active de l'utilisateur
  useEffect(() => {
    const fetchActiveCampaign = async () => {
      if (!profile) return
      
      try {
        // Récupérer la première campagne active (vous pouvez adapter cette logique)
        const { data, error } = await supabase
          .from('campaigns')
          .select('id, slug, title')
          .eq('is_active', true)
          .limit(1)
          .single()
        
        if (error) throw error
        setActiveCampaign(data)
      } catch (error) {
        console.error('Error fetching active campaign:', error)
      } finally {
        setCampaignLoading(false)
      }
    }
    
    fetchActiveCampaign()
  }, [profile])
  
  // CORRECTION: Appeler les hooks toujours, mais avec enabled conditionnel
  const { quests = [], loading: questsLoading } = useQuests({
    campaignId: activeCampaign?.id,
    enabled: !!activeCampaign && !!profile
  })
  
  const { badges = [], loading: badgesLoading } = useBadges()

  const loading = profileLoading || questsLoading || badgesLoading || campaignLoading

  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Erreur de chargement du profil</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    )
  }

  // Calcul des statistiques - avec vérifications de sécurité
  const currentLevel = calculateLevel(profile?.xp_total || 0)
  const xpProgress = getXpProgress(profile?.xp_total || 0)
  
  // Calcul des quêtes avec vérification que quests existe
  const completedQuests = Array.isArray(quests) ? quests.filter(q => q.status === 'completed').length : 0
  const totalQuests = Array.isArray(quests) ? quests.length : 0
  const campaignProgress = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
         <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RPG Hybride
            </h1>
            <p className="text-muted-foreground">Salut {profile?.display_name} !</p>
          </div>
          <Button variant="ghost" onClick={signOut}>
            Déconnexion
          </Button>
        </div>

        {/* Avatar & Level */}
        <Card className="border-accent/20 shadow-lg">
          <CardContent className="p-6 text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-4xl animate-pulse">
                {profile?.avatar_emoji}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold text-sm">
                Niveau {currentLevel}
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-bold text-xl">{profile?.display_name}</h2>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>XP</span>
                  <span>{xpProgress}/200</span>
                </div>
                <Progress value={(xpProgress / 200) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-red-500/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💪</span>
                  <span className="font-semibold text-red-500">Force</span>
                </div>
                <span className="text-sm text-muted-foreground">{profile?.stat_force}</span>
              </div>
              <Progress value={Math.min((profile?.stat_force / 100) * 100, 100)} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-green-500/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏃</span>
                  <span className="font-semibold text-green-500">Endurance</span>
                </div>
                <span className="text-sm text-muted-foreground">{profile?.stat_endurance}</span>
              </div>
              <Progress value={Math.min((profile?.stat_endurance / 100) * 100, 100)} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-blue-500/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span className="font-semibold text-blue-500">Agilité</span>
                </div>
                <span className="text-sm text-muted-foreground">{profile?.stat_agilite}</span>
              </div>
              <Progress value={Math.min((profile?.stat_agilite / 100) * 100, 100)} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  <span className="font-semibold text-purple-500">Mental</span>
                </div>
                <span className="text-sm text-muted-foreground">{profile?.stat_mental}</span>
              </div>
              <Progress value={Math.min((profile?.stat_mental / 100) * 100, 100)} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Campaign Progress */}
        <Card className="border-accent/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⚔️</span>
              Campagne {activeCampaign ? `"${activeCampaign.title}"` : "En cours..."}
            </CardTitle>
            <CardDescription>
              Progression : {completedQuests}/{totalQuests} quêtes complétées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={campaignProgress} className="h-3" />
            <Button 
              onClick={() => activeCampaign && navigate(`/campaign/${activeCampaign.slug}`)}
              className="w-full"
              disabled={!activeCampaign}
            >
              {activeCampaign ? 'Voir les quêtes' : 'Chargement...'}
            </Button>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="border-accent/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🏆</span>
              Badges collectés ({badges.filter(b => b.unlocked).length}/{badges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    badge.unlocked 
                      ? "bg-accent/10 border-accent/30" 
                      : "bg-muted/20 border-muted/30 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-2">{badge.emoji}</div>
                  <div className={`font-medium text-sm ${
                    badge.unlocked ? "text-accent" : "text-muted-foreground"
                  }`}>
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Debug - À supprimer après vérification */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-yellow-500/50 bg-yellow-50/10">
            <CardHeader>
              <CardTitle className="text-yellow-600">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div>Campagne active: {activeCampaign ? activeCampaign.title : 'Non trouvée'}</div>
                <div>Campaign ID: {activeCampaign?.id || 'Non défini'}</div>
                <div>Campaign Slug: {activeCampaign?.slug || 'Non défini'}</div>
                <div>Quêtes chargées: {quests?.length || 0}</div>
                <div>Loading quests: {questsLoading ? 'Oui' : 'Non'}</div>
                <div>Loading campaign: {campaignLoading ? 'Oui' : 'Non'}</div>
                <div>Profile loaded: {profile ? 'Oui' : 'Non'}</div>
                {Array.isArray(quests) && quests.length > 0 && (
                  <div>Statuts des quêtes: {JSON.stringify(quests.map(q => ({ title: q.title, status: q.status })))}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { useBadges } from '@/hooks/useBadges'
import { useContentFilters } from '@/hooks/useContentFilters'
import { useFilteredContent } from '@/hooks/useFilteredContent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge as BadgeComponent } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentFilters } from '@/components/ui/content-filters'
import { CampaignCard } from '@/components/ui/campaign-card'
import { OneShotCard } from '@/components/ui/oneshot-card'
import { LevelDisplay } from '@/components/ui/level-display'
import { RpgStatsDisplay } from '@/components/ui/rpg-stats-display'
import { useNavigate } from 'react-router-dom'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { History as HistoryIcon } from 'lucide-react'

export default function Profil() {
  const { profile, loading: profileLoading } = useProfile()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { getPlayerLevel, getXpProgress } = useRpgProgress()
  
  // Système de filtres
  const { 
    filters, 
    updateLevel, 
    updateEquipment, 
    updateSort, 
    resetFilters, 
    suggestForMe 
  } = useContentFilters()
  
  // Contenu filtré
  const { campaigns, oneShots, loading: contentLoading } = useFilteredContent(filters)
  
  const { badges = [], loading: badgesLoading } = useBadges()
  
  // Tab state
  const [activeTab, setActiveTab] = useState('campaigns')

  const loading = profileLoading || contentLoading || badgesLoading

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
  const currentLevel = getPlayerLevel()
  const xpProgressInfo = getXpProgress()
  const xpProgress = xpProgressInfo.current

  const hasFilters = filters.level || filters.equipment.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RPG Hybride
            </h1>
            <p className="text-muted-foreground">Salut {profile?.display_name} !</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/historique')}>
              <HistoryIcon className="w-4 h-4 mr-2" />
              Historique
            </Button>
            <Button variant="ghost" onClick={signOut}>
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Profil condensé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Avatar & Level */}
          <Card className="border-accent/20">
            <CardContent className="p-4 text-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-2xl">
                  {profile?.avatar_emoji}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-2 py-1 rounded-full font-bold text-xs">
                  Niv. {currentLevel}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm">{profile?.display_name}</h3>
                <LevelDisplay 
                  className="w-full"
                  variant="compact"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats condensés */}
          <Card className="border-accent/20 md:col-span-2">
            <CardContent className="p-4">
              <RpgStatsDisplay 
                className="w-full"
                variant="compact"
              />
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <ContentFilters
          level={filters.level}
          equipment={filters.equipment}
          sort={filters.sort}
          onLevelChange={updateLevel}
          onEquipmentChange={updateEquipment}
          onSortChange={updateSort}
          onSuggestForMe={suggestForMe}
          onReset={resetFilters}
        />

        {/* Onglets Campagnes / One-shots */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaigns">
              Campagnes ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger value="oneshots">
              One-shots ({oneShots.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab Campagnes */}
          <TabsContent value="campaigns" className="space-y-4">
            {loading ? (
              <div className="text-center p-8 text-muted-foreground">
                Chargement des campagnes...
              </div>
            ) : campaigns.length === 0 ? (
              <Card className="border-dashed border-muted/50">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-muted-foreground">
                    {hasFilters 
                      ? "Aucune campagne ne correspond à vos filtres" 
                      : "Aucune campagne disponible"}
                  </div>
                  {hasFilters && (
                    <Button variant="outline" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab One-shots */}
          <TabsContent value="oneshots" className="space-y-4">
            {loading ? (
              <div className="text-center p-8 text-muted-foreground">
                Chargement des one-shots...
              </div>
            ) : oneShots.length === 0 ? (
              <Card className="border-dashed border-muted/50">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-muted-foreground">
                    {hasFilters 
                      ? "Aucun one-shot ne correspond à vos filtres" 
                      : "Aucun one-shot disponible"}
                  </div>
                  {hasFilters && (
                    <Button variant="outline" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {oneShots.map((oneShot) => (
                  <OneShotCard key={oneShot.id} oneShot={oneShot} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Badges */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🏆</span>
              Badges collectés ({badges.filter(b => b.unlocked).length}/{badges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    badge.unlocked 
                      ? "bg-accent/10 border-accent/30" 
                      : "bg-muted/20 border-muted/30 opacity-50"
                  }`}
                >
                  <div className="text-xl mb-1">{badge.emoji}</div>
                  <div className={`font-medium text-xs ${
                    badge.unlocked ? "text-accent" : "text-muted-foreground"
                  }`}>
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
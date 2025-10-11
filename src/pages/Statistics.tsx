import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, Dumbbell, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StrengthStatistics from '@/components/statistics/StrenghStatistics'

export default function Statistics() {
  const navigate = useNavigate()
  const { profile } = useProfile()

  // Composants placeholder pour les autres tabs
  const HiitStatistics = () => (
    <div className="text-center py-12">
      <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Statistiques HIIT</h3>
      <p className="text-muted-foreground">À venir dans la prochaine version...</p>
    </div>
  )

  const OverviewStatistics = () => (
    <div className="text-center py-12">
      <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Vue d'ensemble</h3>
      <p className="text-muted-foreground">Statistiques globales à venir...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/campaign')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">📊 Mes Statistiques</h1>
            <p className="text-muted-foreground">Suivez votre progression et vos performances</p>
          </div>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="strength" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strength" className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Musculation
            </TabsTrigger>
            <TabsTrigger value="hiit" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              HIIT & Cardio
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
          </TabsList>

          {/* Musculation Tab */}
          <TabsContent value="strength" className="space-y-6">
            <StrengthStatistics />
          </TabsContent>

          {/* HIIT Tab */}
          <TabsContent value="hiit" className="space-y-6">
            <HiitStatistics />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewStatistics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
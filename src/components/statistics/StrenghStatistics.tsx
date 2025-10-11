import { useStrengthStats } from '@/hooks/useStrengthStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell } from 'lucide-react'

const StrengthStatistics = () => {
  const { stats, loading } = useStrengthStats()

  if (loading) {
    return <div>Chargement des statistiques...</div>
  }

  return (
    <div className="space-y-6">
      
      {/* KPIs généraux avec vraies données */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Séances totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(stats.totalVolume).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Kg soulevés (total)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageProgression > 0 ? `+${stats.averageProgression}kg` : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Progression moy.</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.sessionsPerWeek}</div>
            <div className="text-sm text-muted-foreground">Séances/semaine</div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des exercices */}
      <Card>
        <CardHeader>
          <CardTitle>💪 Mes exercices</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.personalRecords.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Aucun exercice de musculation effectué pour le moment.</p>
              <p className="text-sm">Commencez votre première séance pour voir vos statistiques !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.personalRecords.map((record, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-muted/20 rounded-lg border border-muted/40">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{record.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Exercice de musculation
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      {record.maxReps} reps
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {record.maxWeight}kg
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Meilleure performance
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progression par exercice (à implémenter plus tard) */}
      <Card>
        <CardHeader>
          <CardTitle>Progression par exercice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Graphiques à venir...
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StrengthStatistics
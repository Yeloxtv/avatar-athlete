import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import Auth from './Auth'
import Dashboard from './Dashboard'

export default function Index() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">⚙️</div>
          <p className="text-muted-foreground">Chargement de ton aventure...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return <Auth />
  }

  return <Dashboard />
}

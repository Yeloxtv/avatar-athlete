import { NavLink } from 'react-router-dom'
import { Home, BarChart2, Award, Dumbbell } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/statistics', icon: BarChart2, label: 'Séances' },
  { to: '/exercises', icon: Dumbbell, label: 'Exercices' },
  { to: '/badges', icon: Award, label: 'Badges' },
]

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="container border-t border-muted/40 bg-background flex items-center justify-around py-1">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-5 text-xs font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

import { useProfile } from '@/hooks/useProfile'
import { useStreak } from '@/hooks/useStreak'
import { useBadges, BADGES } from '@/hooks/useBadges'
import { LEVELS } from '@/data/rpgLevels'
import { Progress } from '@/components/ui/progress'
import { Zap, Flame, Shield, Wind, Brain, Award, ChevronRight, Dumbbell } from 'lucide-react'
import { Link } from 'react-router-dom'

const STAT_CONFIG = [
  { key: 'stat_force',     label: 'Force',     Icon: Dumbbell, color: 'text-stats-force',     bg: 'bg-stats-force',     max: 500 },
  { key: 'stat_endurance', label: 'Endurance', Icon: Flame,    color: 'text-stats-endurance', bg: 'bg-stats-endurance', max: 500 },
  { key: 'stat_agilite',   label: 'Agilité',   Icon: Wind,     color: 'text-stats-agilite',   bg: 'bg-stats-agilite',   max: 500 },
  { key: 'stat_mental',    label: 'Mental',    Icon: Brain,    color: 'text-stats-mental',    bg: 'bg-stats-mental',    max: 500 },
] as const

// Titre au rang du niveau
function getLevelTitle(level: number) {
  return LEVELS.find(l => l.level === level)?.title ?? 'Apprenti Éveillé'
}

// Avatar visuel selon le niveau
function AvatarDisplay({ level, emoji }: { level: number; emoji: string }) {
  const tier =
    level >= 18 ? 'titan' :
    level >= 14 ? 'elite' :
    level >= 10 ? 'warrior' :
    level >= 5  ? 'fighter' : 'recruit'

  const ringColor =
    tier === 'titan'   ? 'border-yellow-400 shadow-yellow-400/40' :
    tier === 'elite'   ? 'border-purple-400 shadow-purple-400/40' :
    tier === 'warrior' ? 'border-accent shadow-accent/40' :
    tier === 'fighter' ? 'border-blue-400 shadow-blue-400/30' :
                         'border-muted shadow-muted/20'

  const glowClass =
    tier === 'titan'   ? 'animate-pulse-glow' :
    tier === 'elite'   ? 'animate-pulse' :
    ''

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative w-28 h-28 rounded-full border-4 ${ringColor} shadow-lg ${glowClass} flex items-center justify-center bg-muted/20`}>
        <span className="text-5xl">{emoji}</span>
        {(tier === 'titan' || tier === 'elite') && (
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-400 border-2 border-background flex items-center justify-center text-sm">
            {tier === 'titan' ? '👑' : '⭐'}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Profile() {
  const { profile, calculateLevel, getLevelProgress } = useProfile()
  const { streak } = useStreak(profile?.id)
  const { unlockedIds } = useBadges()
  const unlockedBadges = BADGES.filter(b => unlockedIds.has(b.id))

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  const xp = profile.xp_total || 0
  const level = calculateLevel(xp)
  const levelProgress = getLevelProgress(xp)
  const title = getLevelTitle(level)
  const nextTitle = getLevelTitle(level + 1)
  const xpProgressPercent = Math.round(levelProgress.percentage)

  // Stats
  const force     = profile.stat_force     || 0
  const endurance = profile.stat_endurance || 0
  const agilite   = profile.stat_agilite   || 0
  const mental    = profile.stat_mental    || 0
  const totalStats = force + endurance + agilite + mental

  // Classe dominante
  const dominant = [
    { label: 'Force',     value: force },
    { label: 'Endurance', value: endurance },
    { label: 'Agilité',   value: agilite },
    { label: 'Mental',    value: mental },
  ].reduce((a, b) => (b.value > a.value ? b : a))

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-6 pb-24">

      {/* HERO — Avatar + Identité */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <AvatarDisplay level={level} emoji={profile.avatar_emoji || '⚔️'} />

        <div className="text-center space-y-0.5">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-black">{title}</p>
          <h1 className="text-2xl font-black">{profile.display_name || 'Athlète'}</h1>
          {totalStats > 0 && (
            <p className="text-xs text-muted-foreground">Spécialité : {dominant.label}</p>
          )}
        </div>
      </div>

      {/* NIVEAU + XP */}
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-accent">Niv. {level}</div>
            <div className="text-xs text-muted-foreground">{xp.toLocaleString()} XP total</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-semibold justify-end">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-accent">{levelProgress.xpInCurrentLevel}</span>
              <span className="text-muted-foreground">/ {levelProgress.xpNeededForNext}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {levelProgress.remaining > 0 ? `${levelProgress.remaining} XP → ${nextTitle}` : 'Niveau max'}
            </div>
          </div>
        </div>
        <Progress value={xpProgressPercent} className="h-3" />
      </div>

      {/* STATS RPG */}
      <div className="space-y-3">
        <h2 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Shield className="w-4 h-4" /> Attributs
        </h2>
        <div className="space-y-2.5">
          {STAT_CONFIG.map(({ key, label, Icon, color, bg, max }) => {
            const value = (profile as any)[key] || 0
            const pct = Math.min(100, Math.round((value / max) * 100))
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className={`flex items-center gap-1.5 font-semibold ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                  <span className="font-black text-foreground">{value}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bg} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        {totalStats === 0 && (
          <p className="text-xs text-muted-foreground text-center pt-1">
            Complète ta première séance pour débloquer tes attributs.
          </p>
        )}
      </div>

      {/* STREAK */}
      <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-400/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="font-bold">Streak actuel</div>
            <div className="text-xs text-muted-foreground">
              {streak.isActive ? `${streak.currentStreak} jour${streak.currentStreak > 1 ? 's' : ''} consécutif${streak.currentStreak > 1 ? 's' : ''}` : 'Aucun streak actif'}
            </div>
          </div>
        </div>
        <div className="text-2xl font-black text-orange-400">
          {streak.currentStreak > 0 ? `🔥 ${streak.currentStreak}` : '—'}
        </div>
      </div>

      {/* BADGES RÉCENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Award className="w-4 h-4" /> Badges
          </h2>
          <Link to="/badges" className="text-xs text-accent flex items-center gap-1">
            Voir tout <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {unlockedBadges.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {unlockedBadges.slice(0, 8).map(badge => (
              <div key={badge.id} className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-14 h-14 rounded-2xl border border-accent/30 bg-accent/10 flex items-center justify-center">
                  <img src={badge.image} alt={badge.name} className="w-10 h-10 object-contain" />
                </div>
                <span className="text-[9px] text-muted-foreground text-center max-w-[56px] truncate">{badge.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-dashed border-2 border-muted/30 p-4 text-center text-muted-foreground text-xs">
            Complète des quêtes pour débloquer des badges.
          </div>
        )}
      </div>
    </div>
  )
}

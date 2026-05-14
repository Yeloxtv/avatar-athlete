import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useProfile } from '@/hooks/useProfile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import { format, subDays, parseISO, isAfter } from 'date-fns'
import { fr } from 'date-fns/locale'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExercisePoint {
  date: string
  dateLabel: string
  maxWeight: number    // poids max sur un set cette séance
  totalVolume: number  // somme(reps × poids) tous les sets cette séance
}

interface ExerciseSeries {
  name: string
  points: ExercisePoint[]
}

type Period = 30 | 90 | 180 | 365
type Metric = 'maxWeight' | 'totalVolume'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMetricValue(value: number, metric: Metric) {
  if (metric === 'maxWeight') return `${value} kg`
  return value >= 1000 ? `${(value / 1000).toFixed(1)}t` : `${value} kg`
}

function metricLabel(metric: Metric) {
  return metric === 'maxWeight' ? 'Poids max' : 'Volume total'
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background border border-muted/40 rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-bold text-accent">{formatMetricValue(payload[0].value, metric)}</p>
    </div>
  )
}

// ─── Delta badge ──────────────────────────────────────────────────────────────

function DeltaBadge({ delta, unit }: { delta: number | null; unit: string }) {
  if (delta === null) return <span className="text-xs text-muted-foreground">—</span>
  if (delta === 0) return (
    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="w-3 h-3" /> 0 {unit}
    </span>
  )
  const positive = delta > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? '+' : ''}{delta} {unit}
    </span>
  )
}

// ─── Metric toggle ────────────────────────────────────────────────────────────

function MetricToggle({ metric, onChange }: { metric: Metric; onChange: (m: Metric) => void }) {
  return (
    <div className="flex rounded-lg border border-muted/30 overflow-hidden text-sm">
      {(['maxWeight', 'totalVolume'] as Metric[]).map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`flex-1 py-1.5 px-3 font-medium transition-colors ${
            metric === m
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {metricLabel(m)}
        </button>
      ))}
    </div>
  )
}

// ─── Exercise card (mini) ─────────────────────────────────────────────────────

function ExerciseCard({
  series,
  period,
  metric,
  onClick,
  selected,
}: {
  series: ExerciseSeries
  period: Period
  metric: Metric
  onClick: () => void
  selected: boolean
}) {
  const cutoff = subDays(new Date(), period)
  const filtered = series.points.filter(p => isAfter(parseISO(p.date), cutoff))

  const delta = useMemo(() => {
    if (filtered.length < 2) return null
    const first = filtered[0][metric]
    const last = filtered[filtered.length - 1][metric]
    return Math.round((last - first) * 10) / 10
  }, [filtered, metric])

  const lastVal = filtered.length ? filtered[filtered.length - 1][metric] : 0
  const maxVal = filtered.length ? Math.max(...filtered.map(p => p[metric])) : 0
  const unit = metric === 'maxWeight' ? 'kg' : 'kg'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        selected
          ? 'border-accent bg-accent/10'
          : 'border-muted/30 bg-card hover:border-muted/60'
      }`}
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <p className="text-sm font-semibold leading-tight flex-1">{series.name}</p>
        <DeltaBadge delta={delta} unit={unit} />
      </div>

      <div className="flex items-end gap-4 mb-3">
        <div>
          <p className="text-2xl font-bold text-accent">
            {lastVal > 0 ? formatMetricValue(lastVal, metric) : '—'}
          </p>
          <p className="text-xs text-muted-foreground">
            {metric === 'maxWeight' ? 'dernier max' : 'dernier volume'}
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold">
            {maxVal > 0 ? formatMetricValue(maxVal, metric) : '—'}
          </p>
          <p className="text-xs text-muted-foreground">record</p>
        </div>
      </div>

      {filtered.length > 1 ? (
        <ResponsiveContainer width="100%" height={60}>
          <LineChart data={filtered} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey={metric}
              stroke={selected ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))'}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-xs text-muted-foreground italic">Pas assez de données</p>
      )}
    </button>
  )
}

// ─── Detail chart panel ───────────────────────────────────────────────────────

function DetailChart({
  series,
  period,
  metric,
  onMetricChange,
}: {
  series: ExerciseSeries
  period: Period
  metric: Metric
  onMetricChange: (m: Metric) => void
}) {
  const cutoff = subDays(new Date(), period)
  const filtered = series.points.filter(p => isAfter(parseISO(p.date), cutoff))

  const deltaVal = useMemo(() => {
    if (filtered.length < 2) return null
    return Math.round((filtered[filtered.length - 1][metric] - filtered[0][metric]) * 10) / 10
  }, [filtered, metric])

  const deltaPct = useMemo(() => {
    if (filtered.length < 2 || filtered[0][metric] === 0) return null
    const pct = ((filtered[filtered.length - 1][metric] - filtered[0][metric]) / filtered[0][metric]) * 100
    return Math.round(pct)
  }, [filtered, metric])

  const recordVal = filtered.length ? Math.max(...filtered.map(p => p[metric])) : 0
  const unit = metric === 'maxWeight' ? 'kg' : 'kg'

  return (
    <div className="rounded-xl border border-muted/30 bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-base">{series.name}</h3>
          <p className="text-xs text-muted-foreground">
            {filtered.length} séance{filtered.length > 1 ? 's' : ''} sur J-{period}
          </p>
        </div>
      </div>

      {/* Toggle poids max / volume */}
      <MetricToggle metric={metric} onChange={onMetricChange} />

      {/* KPIs */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-lg bg-muted/20 p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Progression</p>
          <DeltaBadge delta={deltaVal} unit={unit} />
        </div>
        <div className="flex-1 rounded-lg bg-muted/20 p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">En %</p>
          {deltaPct !== null ? (
            <span className={`text-xs font-semibold ${deltaPct > 0 ? 'text-green-400' : deltaPct < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
              {deltaPct > 0 ? '+' : ''}{deltaPct}%
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
        <div className="flex-1 rounded-lg bg-muted/20 p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Record</p>
          <span className="text-xs font-semibold">
            {recordVal > 0 ? formatMetricValue(recordVal, metric) : '—'}
          </span>
        </div>
      </div>

      {/* Chart */}
      {filtered.length > 1 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={filtered} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted)/0.2)" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="hsl(var(--accent))"
              strokeWidth={2.5}
              dot={{ r: 3, fill: 'hsl(var(--accent))', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
          Enregistre au moins 2 séances pour voir la courbe
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: 'J-30', value: 30 },
  { label: 'J-90', value: 90 },
  { label: 'J-180', value: 180 },
  { label: 'J-365', value: 365 },
]

export default function Progress() {
  const navigate = useNavigate()
  const { profile } = useProfile()

  const [allSeries, setAllSeries] = useState<ExerciseSeries[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>(90)
  const [metric, setMetric] = useState<Metric>('maxWeight')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (profile) loadData()
  }, [profile])

  const loadData = async () => {
    if (!profile) return
    setLoading(true)
    try {
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('id, started_at')
        .eq('user_id', profile.id)
        .eq('is_completed', true)

      if (!sessions?.length) { setLoading(false); return }

      const sessionIds = sessions.map(s => s.id)
      const dateBySession: Record<string, string> = {}
      sessions.forEach(s => { dateBySession[s.id] = s.started_at })

      const { data: logs } = await supabase
        .from('exercise_logs')
        .select('session_id, exercise_id, reps_completed, weight_used, quest_exercises(name)')
        .in('session_id', sessionIds)

      if (!logs?.length) { setLoading(false); return }

      // Group: exerciseName → sessionId → { maxWeight, volume }
      const map = new Map<string, Map<string, { maxWeight: number; volume: number }>>()

      for (const log of logs) {
        const exerciseName = (log.quest_exercises as any)?.name
        if (!exerciseName) continue
        const sessionDate = dateBySession[log.session_id]
        if (!sessionDate) continue
        const weight = Number(log.weight_used) || 0
        const reps = Number(log.reps_completed) || 0

        if (!map.has(exerciseName)) map.set(exerciseName, new Map())
        const bySession = map.get(exerciseName)!
        if (!bySession.has(log.session_id)) bySession.set(log.session_id, { maxWeight: 0, volume: 0 })
        const entry = bySession.get(log.session_id)!
        if (weight > entry.maxWeight) entry.maxWeight = weight
        entry.volume += reps * weight
      }

      const series: ExerciseSeries[] = []
      for (const [name, bySession] of map.entries()) {
        const points: ExercisePoint[] = Array.from(bySession.entries())
          .map(([sessionId, { maxWeight, volume }]) => ({
            date: dateBySession[sessionId],
            dateLabel: format(parseISO(dateBySession[sessionId]), 'd MMM', { locale: fr }),
            maxWeight,
            totalVolume: Math.round(volume),
          }))
          .sort((a, b) => a.date.localeCompare(b.date))

        if (points.some(p => p.maxWeight > 0)) {
          series.push({ name, points })
        }
      }

      series.sort((a, b) => {
        const lastA = a.points[a.points.length - 1]?.date ?? ''
        const lastB = b.points[b.points.length - 1]?.date ?? ''
        if (lastB !== lastA) return lastB.localeCompare(lastA)
        return b.points.length - a.points.length
      })

      setAllSeries(series)
      if (series.length) setSelected(series[0].name)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredSeries = useMemo(() => {
    if (!search.trim()) return allSeries
    return allSeries.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
  }, [allSeries, search])

  const selectedSeries = useMemo(
    () => allSeries.find(s => s.name === selected) ?? null,
    [allSeries, selected]
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-muted/30 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-bold text-lg leading-tight">Progression</h1>
          <p className="text-xs text-muted-foreground">Tes courbes de force</p>
        </div>
      </div>

      <div className="container px-4 py-4 space-y-4 pb-24">
        {/* Period selector */}
        <div className="flex gap-2">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                period === opt.value
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'border-muted/30 text-muted-foreground hover:border-muted/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-4xl animate-spin">⚙️</div>
            <p className="text-muted-foreground text-sm">Analyse de tes séances...</p>
          </div>
        ) : allSeries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="text-5xl">📊</div>
            <p className="font-semibold">Aucune donnée pour l'instant</p>
            <p className="text-muted-foreground text-sm max-w-xs">
              Lance quelques séances de musculation pour voir tes courbes de progression.
            </p>
          </div>
        ) : (
          <>
            {/* Detail chart */}
            {selectedSeries && (
              <DetailChart
                series={selectedSeries}
                period={period}
                metric={metric}
                onMetricChange={setMetric}
              />
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un exercice..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-11"
              />
            </div>

            {/* Exercise cards */}
            <div className="space-y-3">
              {filteredSeries.map(s => (
                <ExerciseCard
                  key={s.name}
                  series={s}
                  period={period}
                  metric={metric}
                  selected={selected === s.name}
                  onClick={() => setSelected(s.name)}
                />
              ))}
              {filteredSeries.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  Aucun exercice trouvé
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

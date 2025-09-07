// src/pages/DevXpSandbox.tsx
// -------------------------------------------------------------
// DEV SANDBOX to simulate XP / Level / Badges visually
// - Drop this file in src/pages/DevXpSandbox.tsx
// - Add a route: <Route path="/dev/xp" element={<DevXpSandbox/>} />
// - Uses shadcn/ui + Tailwind
// - By default uses a small fallback XP logic below.
//   If you already have XpService from Lovadev, replace the fallback with real imports (see TODO).
// -------------------------------------------------------------

import React, { useMemo, useState } from "react";

// UI (shadcn)
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge as UIBadge } from "@/components/ui/badge";
import { XpService } from "@/services/xpService";
import { LEVELS } from "@/data/rpgLevels";

// --------------------------------------------------------------------
// Fallback minimal XP logic (safe to remove once XpService is plugged)
// --------------------------------------------------------------------

type WorkoutType = "hiit" | "run" | "strength" | "mixed";
type Difficulty = "easy" | "normal" | "hard" | "boss";

type SessionInput = {
  workoutType: WorkoutType;
  durationMin: number;
  rpe?: number;           // 1-10
  volumeScore?: number;   // 0..1 (force)
  distanceKm?: number;    // run
  isFirstTime?: boolean;
  streakDays?: number;    // 0..n
  difficulty?: Difficulty;
};

type LevelState = { level: number; totalXp: number };

const XP_CONFIG = {
  requiredForLevel(level: number) { return Math.round(100 * level * level); },
  maxLevel: 20,
  difficulty: { easy: 1, normal: 1.2, hard: 1.5, boss: 2 },
  bonuses: { streakDaily: 0.05, perfectCompletion: 0.10, firstTime: 0.15 },
};

function clamp(v:number, min:number, max:number){ return Math.min(max, Math.max(min, v)); }

function baseXpFromSession(s: SessionInput): number {
  const baseByType: Record<WorkoutType, number> = { hiit: 30, run: 25, strength: 25, mixed: 35 };
  const base = baseByType[s.workoutType] ?? 25;

  const rpeFactor = s.rpe ? (0.8 + (s.rpe/10)*0.6) : 1.0; // 0.8..1.4
  const durationFactor = 1 + clamp(s.durationMin, 10, 90)/90; // 1.11..2
  const volumeFactor = s.volumeScore ? (0.9 + clamp(s.volumeScore, 0, 1)*0.5) : 1.0; // 0.9..1.4
  const distanceFactor = s.distanceKm ? (1 + clamp(s.distanceKm, 0, 15)/20) : 1.0;  // 1..1.75

  const typeFactor =
    s.workoutType === 'run' ? distanceFactor :
    s.workoutType === 'strength' ? volumeFactor :
    s.workoutType === 'hiit' ? rpeFactor*durationFactor :
    0.5*(rpeFactor+durationFactor); // mixed

  return Math.round(base * typeFactor);
}

function applyModifiers(xp:number, s: SessionInput): number {
  const diff = XP_CONFIG.difficulty[s.difficulty ?? 'normal'] ?? 1.2;
  let total = xp * diff;
  if (s.isFirstTime) total *= (1 + XP_CONFIG.bonuses.firstTime);
  if (s.streakDays && s.streakDays > 0) {
    const streakBonus = clamp(s.streakDays * XP_CONFIG.bonuses.streakDaily, 0, 0.25);
    total *= (1 + streakBonus);
  }
  if (s.rpe && s.rpe >= 8) total *= (1 + XP_CONFIG.bonuses.perfectCompletion);
  return Math.max(1, Math.round(total));
}

function computeXpGain(s: SessionInput): number {
  const base = baseXpFromSession(s);
  return applyModifiers(base, s);
}

function applyXp(state: LevelState, gained: number): LevelState & { levelUps: number } {
  let totalXp = state.totalXp + gained;
  let level = state.level;
  let levelUps = 0;
  while (level < XP_CONFIG.maxLevel && totalXp >= XP_CONFIG.requiredForLevel(level+1)) {
    level += 1; levelUps += 1;
  }
  return { level, totalXp, levelUps };
}

function getLevelFromXp(totalXp: number) {
  let lvl = 1;
  for (let i=2; i<=XP_CONFIG.maxLevel; i++) {
    if (totalXp >= XP_CONFIG.requiredForLevel(i)) lvl = i; else break;
  }
  return lvl;
}

function getXpProgress(totalXp: number){
  const level = getLevelFromXp(totalXp);
  const curLvlXp = XP_CONFIG.requiredForLevel(level);
  const nextLvlXp = XP_CONFIG.requiredForLevel(Math.min(level+1, XP_CONFIG.maxLevel));
  const current = totalXp - curLvlXp;
  const required = Math.max(1, nextLvlXp - curLvlXp);
  const percentage = Math.min(100, Math.max(0, (current/required)*100));
  return { level, current, required, percentage };
}

// -------------------------------------------------------------
// Component
// -------------------------------------------------------------

export default function DevXpSandbox() {
  // Minimal in-memory profile state
  const [level, setLevel] = useState(1);
  const [totalXp, setTotalXp] = useState(0);

  // Session params
  const [workoutType, setWorkoutType] = useState<WorkoutType>("hiit");
  const [durationMin, setDurationMin] = useState(20);
  const [rpe, setRpe] = useState(7);
  const [distanceKm, setDistanceKm] = useState(0);
  const [volumeScore, setVolumeScore] = useState(0.3);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [firstTime, setFirstTime] = useState(true);
  const [streakDays, setStreakDays] = useState(3);

  // Results
  const [lastGain, setLastGain] = useState<number>(0);
  const [lastLevelUps, setLastLevelUps] = useState<number>(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  const progress = useMemo(() => getXpProgress(totalXp), [totalXp]);

  function simulate() {
    const session: SessionInput = {
      workoutType,
      durationMin,
      rpe,
      distanceKm: workoutType === "run" ? distanceKm : undefined,
      volumeScore: workoutType === "strength" ? volumeScore : undefined,
      difficulty,
      isFirstTime: firstTime,
      streakDays,
    };

    // If you have XpService, replace with your real flow
    // const rewards = XpService.computeSessionRewards({ level, totalXp }, session);
    // const next = XpService.applyRewards({ level, totalXp }, rewards);
    // setLastGain(rewards.gainedXp);
    // setUnlockedBadges(rewards.badges || []);
    // setLevel(next.level); setTotalXp(next.totalXp); setLastLevelUps(next.levelUps);

    const gained = computeXpGain(session);
    const next = applyXp({ level, totalXp }, gained);

    setLastGain(gained);
    setLastLevelUps(next.levelUps);
    // demo badges (replace with real conditions)
    const demoBadges: string[] = [];
    if (firstTime) demoBadges.push("FirstQuest");
    if (streakDays >= 7) demoBadges.push("SevenDayStreak");
    if (workoutType === "run" && distanceKm >= 5) demoBadges.push("First5K");
    setUnlockedBadges(demoBadges);

    setLevel(next.level);
    setTotalXp(next.totalXp);
  }

  function resetProfile() {
    setLevel(1); setTotalXp(0);
    setLastGain(0); setLastLevelUps(0); setUnlockedBadges([]);
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>RPG — XP Sandbox</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <Label>Type d’entraînement</Label>
              <Select value={workoutType} onValueChange={(v)=>setWorkoutType(v as WorkoutType)}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="run">Course</SelectItem>
                  <SelectItem value="strength">Force</SelectItem>
                  <SelectItem value="mixed">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Durée (min)</Label>
              <Slider value={[durationMin]} min={5} max={90} step={1} onValueChange={(v)=>setDurationMin(v[0])}/>
              <div className="text-sm text-muted-foreground mt-1">{durationMin} min</div>
            </div>

            <div>
              <Label>RPE (intensité)</Label>
              <Slider value={[rpe]} min={1} max={10} step={1} onValueChange={(v)=>setRpe(v[0])}/>
              <div className="text-sm text-muted-foreground mt-1">RPE {rpe}</div>
            </div>

            {workoutType === "run" && (
              <div>
                <Label>Distance (km)</Label>
                <Input type="number" step="0.1" value={distanceKm} onChange={(e)=>setDistanceKm(parseFloat(e.target.value || "0"))}/>
              </div>
            )}

            {workoutType === "strength" && (
              <div>
                <Label>Volume score (0..1)</Label>
                <Input type="number" step="0.05" value={volumeScore} onChange={(e)=>setVolumeScore(parseFloat(e.target.value || "0"))}/>
              </div>
            )}

            <div>
              <Label>Difficulté</Label>
              <Select value={difficulty} onValueChange={(v)=>setDifficulty(v as Difficulty)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Facile</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hard">Difficile</SelectItem>
                  <SelectItem value="boss">Boss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>First time ?</Label>
              <Switch checked={firstTime} onCheckedChange={setFirstTime}/>
            </div>

            <div>
              <Label>Streak (jours)</Label>
              <Input type="number" value={streakDays} onChange={(e)=>setStreakDays(parseInt(e.target.value || "0"))}/>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div className="font-medium">Niveau {progress.level}</div>
                <div className="text-sm text-muted-foreground">{progress.current} / {progress.required} XP</div>
              </div>
              <Progress value={progress.percentage} className="mt-2"/>
              <div className="text-xs text-muted-foreground mt-1">{progress.percentage.toFixed(1)}%</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Dernier gain" value={`${lastGain} XP`} />
              <Stat label="Level-ups" value={`+${lastLevelUps}`} />
              <Stat label="Total XP" value={totalXp} />
              <Stat label="Titre" value={`Chapitre ${progress.level}`} />
            </div>

            <div>
              <div className="mb-2 text-sm text-muted-foreground">Badges débloqués</div>
              <div className="flex flex-wrap gap-2">
                {unlockedBadges.length === 0 && <UIBadge variant="secondary">Aucun</UIBadge>}
                {unlockedBadges.map(b => <UIBadge key={b}>{b}</UIBadge>)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={simulate}>Simuler</Button>
          <Button variant="outline" onClick={resetProfile}>Reset profil</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function Stat({label, value}:{label:string; value:React.ReactNode}) {
  return (
    <div className="p-3 rounded-xl border">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

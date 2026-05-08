import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProgressBar } from "./progress-bar"
import { RewardResult } from "@/types/rpg"
import { cn } from "@/lib/utils"
import { Sparkles, Award, Zap, Crown } from "lucide-react"

interface WorkoutRewardsModalProps {
  isOpen: boolean
  onClose: () => void
  rewards: RewardResult | null
  sessionData?: {
    rounds: number
    totalTime: number
    questTitle?: string
  }
}

export function WorkoutRewardsModal({ 
  isOpen, 
  onClose, 
  rewards, 
  sessionData 
}: WorkoutRewardsModalProps) {
  if (!rewards) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rpg-card border-accent/30">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            🔥 Quête Accomplie !
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Summary */}
          {sessionData && (
            <div className="rpg-card p-4 space-y-3">
              <h3 className="font-semibold text-center">Résumé de la Session</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{sessionData.rounds}</div>
                  <div className="text-muted-foreground">Tours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{formatTime(sessionData.totalTime)}</div>
                  <div className="text-muted-foreground">Temps Total</div>
                </div>
              </div>
            </div>
          )}

          {/* XP Gained */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold xp-gradient bg-clip-text text-transparent">
              +{rewards.gainedXpGlobal} XP
            </div>
            <div className="text-sm text-muted-foreground">Expérience gagnée</div>
          </div>

          {rewards.dailyQuestCompleted && (
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold">Quête du jour accomplie</div>
                <div className="text-xs text-muted-foreground">{rewards.dailyQuestCompleted.title}</div>
              </div>
              <div className="text-lg font-black text-accent">
                +{rewards.dailyQuestCompleted.bonusXp} XP
              </div>
            </div>
          )}

          {/* Stats Gained */}
          {(rewards.gainedStats.force || rewards.gainedStats.endurance || 
            rewards.gainedStats.agilite || rewards.gainedStats.mental) && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Progression des Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {rewards.gainedStats.force > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-stats-force">💪</span>
                    <span>Force +{rewards.gainedStats.force}</span>
                  </div>
                )}
                {rewards.gainedStats.endurance > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-stats-endurance">🏃</span>
                    <span>Endurance +{rewards.gainedStats.endurance}</span>
                  </div>
                )}
                {rewards.gainedStats.agilite > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-stats-agilite">⚡</span>
                    <span>Agilité +{rewards.gainedStats.agilite}</span>
                  </div>
                )}
                {rewards.gainedStats.mental > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-stats-mental">🧠</span>
                    <span>Mental +{rewards.gainedStats.mental}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Level Ups */}
          {rewards.levelUps.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-accent">
                  <Crown className="w-4 h-4" />
                  Montée de Niveau !
                </h3>
                {rewards.levelUps.map((levelUp, index) => (
                  <div key={index} className="rpg-card p-3 space-y-2 border-accent/30 animate-glow">
                    <div className="text-center">
                      <div className="text-xl font-bold text-accent">
                        Niveau {levelUp.toLevel}
                      </div>
                      <div className="text-sm font-medium">{levelUp.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {levelUp.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Badges */}
          {rewards.newBadges.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Nouveaux Badges
                </h3>
                <div className="space-y-2">
                  {rewards.newBadges.map((badgeId, index) => (
                    <Badge key={index} variant="outline" className="w-full justify-center border-accent/30 text-accent">
                      🏆 {badgeId}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Boss Unlocked */}
          {rewards.bossUnlocked && (
            <div className="space-y-3">
              <Separator />
              <div className="boss-card p-4 text-center space-y-2 animate-glow">
                <div className="text-2xl">⚔️</div>
                <div className="font-bold text-stats-force">Boss Débloqué !</div>
                <div className="text-lg font-semibold">{rewards.bossUnlocked.bossName}</div>
                <div className="text-sm text-muted-foreground">
                  {rewards.bossUnlocked.description}
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <Button 
            onClick={onClose} 
            className="w-full hero-gradient text-white font-semibold"
            size="lg"
          >
            Continuer l'Aventure
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

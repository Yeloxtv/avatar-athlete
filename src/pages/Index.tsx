import { AvatarDisplay } from "@/components/ui/avatar-display"
import { StatCard } from "@/components/ui/stat-card"
import { QuestCard } from "@/components/ui/quest-card"
import { BadgeCollection } from "@/components/ui/badge-collection"
import { useGameLogic } from "@/hooks/useGameLogic"
import { useToast } from "@/hooks/use-toast"

const Index = () => {
  const { userProfile, quests, badges, completeQuest, getAvailableQuests } = useGameLogic()
  const { toast } = useToast()

  const handleQuestStart = (questId: string) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest) return

    // Simuler la complétion immédiate pour le MVP
    completeQuest(questId)
    
    toast({
      title: "Quête Terminée ! 🎉",
      description: `Tu as gagné ${quest.xpReward} XP et amélioré tes stats !`,
    })
  }

  const availableQuests = getAvailableQuests()
  const completedQuests = quests.filter(q => q.completed)

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold hero-gradient bg-clip-text text-transparent">
          RPG Hybride
        </h1>
        <p className="text-xl text-muted-foreground">
          Parcours "J'aime pas le cardio" - Transforme ton entraînement en aventure !
        </p>
      </div>

      {/* Profile Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <AvatarDisplay 
          level={userProfile.level}
          xp={userProfile.xp}
          xpToNext={userProfile.xpToNext}
          name={userProfile.name}
        />
        
        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard 
            name="Force"
            value={userProfile.stats.force}
            max={50}
            variant="force"
          />
          <StatCard 
            name="Endurance" 
            value={userProfile.stats.endurance}
            max={50}
            variant="endurance"
          />
          <StatCard 
            name="Agilité"
            value={userProfile.stats.agilite}
            max={50}
            variant="agilite"
          />
          <StatCard 
            name="Mental"
            value={userProfile.stats.mental}
            max={50}
            variant="mental"
          />
        </div>
      </div>

      {/* Progress Overview */}
      <div className="rpg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Progression du Parcours</h2>
        <div className="flex items-center gap-4 text-lg">
          <span className="text-stats-endurance">✅ {completedQuests.length}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-stats-agilite">🎯 {availableQuests.length}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">🔒 {quests.length - completedQuests.length - availableQuests.length}</span>
        </div>
      </div>

      {/* Available Quests */}
      {availableQuests.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quêtes Disponibles</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {availableQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                xpReward={quest.xpReward}
                type={quest.type}
                difficulty={quest.difficulty}
                duration={quest.duration}
                onStart={() => handleQuestStart(quest.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quêtes Terminées</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {completedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                xpReward={quest.xpReward}
                type={quest.type}
                difficulty={quest.difficulty}
                duration={quest.duration}
                completed={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Badge Collection */}
      <BadgeCollection badges={badges} />
    </div>
  );
};

export default Index;

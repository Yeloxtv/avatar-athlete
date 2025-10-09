import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

// Import des nouveaux composants et hooks
import { useCampaignView } from '@/hooks/useCampaignView';
import { QuestCard } from '@/components/campaign/QuestCard';
import { LoadingState } from '@/components/campaign/LoadingState';
import { isQuestAvailable } from '@/utils/campaign';

export default function Campaign() {
  const { activeCampaign, quests, loading, navigateToQuest, navigateBack, resetCampaign } = useCampaignView();
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleResetCampaign = async () => {
    try {
      await resetCampaign();
      toast({
        title: "Campagne réinitialisée",
        description: "Vous pouvez recommencer depuis le début !",
      });
      setShowResetDialog(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser la campagne",
        variant: "destructive",
      });
    }
  };

  // État d'erreur si aucune campagne trouvée
  if (!loading && !activeCampaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <p className="text-muted-foreground">Aucune campagne trouvée</p>
          <Button onClick={navigateBack}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // État de chargement
  if (loading) {
    return <LoadingState />;
  }

  const completedQuests = quests.filter(q => q?.user_status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={navigateBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Campagne "{activeCampaign!.title}"
              </h1>
              <p className="text-muted-foreground">
                {completedQuests}/{quests.length} quêtes complétées
              </p>
              {activeCampaign!.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {activeCampaign!.description}
                </p>
              )}
            </div>
          </div>
          
          {completedQuests > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Recommencer
            </Button>
          )}
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {quests.map((quest, index) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={index}
              status={quest.user_status || 'locked'}
              onClick={() => navigateToQuest(quest.id)}
            />
          ))}
        </div>

        {/* Message si aucune quête */}
        {quests.length === 0 && (
          <Card className="border-dashed border-muted/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Aucune quête dans cette campagne</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reset Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recommencer la campagne ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action réinitialisera toute votre progression dans cette campagne. 
              Vous recommencerez depuis la première quête et perdrez toutes les quêtes complétées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetCampaign}>
              Recommencer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

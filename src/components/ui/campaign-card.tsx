import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CampaignWithFilters, LEVEL_LABELS, EQUIPMENT_LABELS } from '@/types/content';
import { Calendar, Target, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampaignCardProps {
  campaign: CampaignWithFilters;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const navigate = useNavigate();
  
  const isNew = () => {
    const createdDate = new Date(campaign.created_at);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    return createdDate > fourteenDaysAgo;
  };

  const handleStart = () => {
    navigate(`/campaign/${campaign.slug}`);
  };

  return (
    <Card className="border-accent/20 hover:shadow-lg transition-all hover:border-accent/40">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{campaign.title}</CardTitle>
              {isNew() && (
                <Badge variant="secondary" className="text-xs">
                  Nouveau
                </Badge>
              )}
            </div>
            <CardDescription>{campaign.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Badges niveau et équipement */}
        <div className="flex flex-wrap gap-2">
          {campaign.level_required && (
            <Badge variant="outline" className="text-xs">
              {LEVEL_LABELS[campaign.level_required]}
            </Badge>
          )}
          {campaign.equipment_tags?.map((equipment) => (
            <Badge key={equipment} variant="secondary" className="text-xs">
              {EQUIPMENT_LABELS[equipment]}
            </Badge>
          ))}
        </div>

        {/* Informations */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {campaign.estimated_duration_weeks || 4} semaines
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {campaign.quests_count || 0} quêtes
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={handleStart}
          className="w-full"
          size="sm"
        >
          Commencer
        </Button>
      </CardContent>
    </Card>
  );
}
import { Team } from '@/types/tournament';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users, Trophy, Target } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  onRemove?: (teamId: string) => void;
  stats?: {
    totalMatches: number;
    upcomingMatches: number;
    goalDifference: number;
  };
}

export const TeamCard = ({ team, onRemove, stats }: TeamCardProps) => {
  const winRate = team.wins + team.losses > 0 ? (team.wins / (team.wins + team.losses) * 100).toFixed(1) : '0';
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-card border-2 border-transparent hover:border-primary/20 animate-slide-in-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            {team.name}
          </CardTitle>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(team.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Founded: {team.founded}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-accent" />
          <span className="font-medium">Players:</span>
          <span className="text-muted-foreground">{team.players.length}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Wins:</span>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                {team.wins}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Losses:</span>
              <Badge variant="secondary" className="bg-destructive/20 text-destructive-foreground">
                {team.losses}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Goals:</span>
              <span className="font-mono text-primary">
                {team.goalsFor}:{team.goalsAgainst}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Win Rate:</span>
              <Badge 
                variant="secondary" 
                className={`${parseFloat(winRate) > 60 ? 'bg-accent/20 text-accent-foreground' : 'bg-match-scheduled/20 text-match-scheduled-foreground'}`}
              >
                {winRate}%
              </Badge>
            </div>
          </div>
        </div>
        
        {stats && (
          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Upcoming Matches:
              </span>
              <Badge variant="outline" className="border-primary/30">
                {stats.upcomingMatches}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Goal Difference:</span>
              <span className={`font-mono ${stats.goalDifference >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {stats.goalDifference >= 0 ? '+' : ''}{stats.goalDifference}
              </span>
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
          <p className="font-medium mb-1">Squad:</p>
          <p>{team.players.join(', ')}</p>
        </div>
      </CardContent>
    </Card>
  );
};
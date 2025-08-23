import { Match } from '@/types/tournament';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Play, CheckCircle, Radio } from 'lucide-react';
import { format } from 'date-fns';

interface MatchCardProps {
  match: Match;
  onUpdateStatus?: (matchId: string, status: 'scheduled' | 'live' | 'completed', score?: { team1: number; team2: number }) => void;
}

export const MatchCard = ({ match, onUpdateStatus }: MatchCardProps) => {
  const getStatusIcon = () => {
    switch (match.status) {
      case 'live':
        return <Radio className="h-4 w-4 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'live':
        return 'bg-match-live text-match-live-foreground';
      case 'completed':
        return 'bg-match-completed text-match-completed-foreground';
      default:
        return 'bg-match-scheduled text-match-scheduled-foreground';
    }
  };

  const handleStartMatch = () => {
    if (onUpdateStatus && match.status === 'scheduled') {
      onUpdateStatus(match.id, 'live');
    }
  };

  const handleCompleteMatch = () => {
    if (onUpdateStatus && match.status === 'live') {
      const score = {
        team1: Math.floor(Math.random() * 4),
        team2: Math.floor(Math.random() * 4)
      };
      onUpdateStatus(match.id, 'completed', score);
    }
  };

  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg ${
      match.status === 'live' ? 'animate-match-glow' : 'hover:scale-102'
    } bg-gradient-card border-2 border-transparent hover:border-primary/20 animate-slide-in-right`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            {match.round}
          </CardTitle>
          <Badge className={`${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {match.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h3 className="font-bold text-primary mb-1">{match.team1.name}</h3>
            <div className="text-2xl font-mono font-bold text-foreground">
              {match.score?.team1 ?? '-'}
            </div>
          </div>
          
          <div className="text-center px-4">
            <div className="text-xl font-bold text-muted-foreground">VS</div>
          </div>
          
          <div className="text-center flex-1">
            <h3 className="font-bold text-primary mb-1">{match.team2.name}</h3>
            <div className="text-2xl font-mono font-bold text-foreground">
              {match.score?.team2 ?? '-'}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{format(match.scheduledTime, 'MMM dd, yyyy - HH:mm')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{match.venue}</span>
          </div>
        </div>
        
        {onUpdateStatus && (
          <div className="flex gap-2 pt-2">
            {match.status === 'scheduled' && (
              <Button
                onClick={handleStartMatch}
                variant="accent"
                size="sm"
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-1" />
                Start Match
              </Button>
            )}
            
            {match.status === 'live' && (
              <Button
                onClick={handleCompleteMatch}
                variant="default"
                size="sm"
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete Match
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
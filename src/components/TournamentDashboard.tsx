import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Trophy, AlertTriangle, Play, Zap } from 'lucide-react';
import { Team, Match } from '@/types/tournament';

interface TournamentDashboardProps {
  teams: Team[];
  matches: Match[];
  conflicts: Match[];
  onResolveConflicts: () => void;
  onStartNextMatch: () => void;
  nextMatch: Match | null;
}

export const TournamentDashboard = ({ 
  teams, 
  matches, 
  conflicts, 
  onResolveConflicts, 
  onStartNextMatch,
  nextMatch 
}: TournamentDashboardProps) => {
  const liveMatches = matches.filter(m => m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');

  const totalGoals = completedMatches.reduce((sum, match) => {
    return sum + (match.score?.team1 || 0) + (match.score?.team2 || 0);
  }, 0);

  const topTeam = teams.length > 0 ? teams.reduce((best, team) => {
    const bestWinRate = best.wins / (best.wins + best.losses || 1);
    const teamWinRate = team.wins / (team.wins + team.losses || 1);
    return teamWinRate > bestWinRate ? team : best;
  }) : null;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Teams</p>
                <p className="text-2xl font-bold">{teams.length}</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-accent-foreground shadow-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm">Total Matches</p>
                <p className="text-2xl font-bold">{matches.length}</p>
              </div>
              <Calendar className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Goals</p>
                <p className="text-2xl font-bold text-foreground">{totalGoals}</p>
              </div>
              <Trophy className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-md hover:shadow-lg transition-shadow ${
          conflicts.length > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-card'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Conflicts</p>
                <p className={`text-2xl font-bold ${conflicts.length > 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {conflicts.length}
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${conflicts.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Match Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-match-live/10 border-match-live/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-match-live flex items-center gap-2">
              <Play className="h-4 w-4" />
              Live Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-match-live">{liveMatches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently playing</p>
          </CardContent>
        </Card>

        <Card className="bg-match-scheduled/10 border-match-scheduled/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-match-scheduled flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-match-scheduled">{scheduledMatches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Waiting to start</p>
          </CardContent>
        </Card>

        <Card className="bg-match-completed/10 border-match-completed/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-match-completed flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-match-completed">{completedMatches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Finished games</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Match */}
        <Card className="bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Next Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextMatch ? (
              <div className="space-y-3">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="font-bold text-lg text-foreground">
                    {nextMatch.team1.name} vs {nextMatch.team2.name}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{nextMatch.venue}</p>
                  <Badge variant="outline" className="mt-2">
                    {nextMatch.round}
                  </Badge>
                </div>
                
                {nextMatch.status === 'scheduled' && (
                  <Button
                    onClick={onStartNextMatch}
                    variant="hero"
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start This Match
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming matches</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Team */}
        <Card className="bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topTeam ? (
              <div className="space-y-3">
                <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="font-bold text-lg text-accent">{topTeam.name}</div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-accent">{topTeam.wins}</div>
                      <div className="text-muted-foreground">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-foreground">{topTeam.goalsFor}</div>
                      <div className="text-muted-foreground">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">
                        {((topTeam.wins / (topTeam.wins + topTeam.losses || 1)) * 100).toFixed(1)}%
                      </div>
                      <div className="text-muted-foreground">Win Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No teams registered</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conflicts Resolution */}
      {conflicts.length > 0 && (
        <Card className="bg-destructive/5 border-destructive/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Schedule Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                {conflicts.length} scheduling conflicts found. These may include team scheduling conflicts or venue double-bookings.
              </p>
              <Button
                onClick={onResolveConflicts}
                variant="destructive"
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-Resolve Conflicts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
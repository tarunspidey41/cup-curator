import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, Settings, Zap } from 'lucide-react';
import { useTournament } from '@/hooks/useTournament';
import { TournamentDashboard } from '@/components/TournamentDashboard';
import { TeamRegistration } from '@/components/TeamRegistration';
import { TeamCard } from '@/components/TeamCard';
import { MatchCard } from '@/components/MatchCard';
import { toast } from 'sonner';

const Index = () => {
  const {
    teams,
    matches,
    loading,
    addTeam,
    removeTeam,
    updateMatchStatus,
    getNextMatch,
    startNextMatch,
    resolveScheduleConflicts,
    getTeamStats,
    teamCount,
    matchCount,
    conflicts
  } = useTournament();

  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAddTeam = (teamData: any) => {
    addTeam(teamData);
    toast.success(`Team "${teamData.name}" registered successfully!`);
  };

  const handleRemoveTeam = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      removeTeam(teamId);
      toast.success(`Team "${team.name}" removed from tournament`);
    }
  };

  const handleMatchStatusUpdate = (matchId: string, status: 'scheduled' | 'live' | 'completed', score?: { team1: number; team2: number }) => {
    updateMatchStatus(matchId, status, score);
    
    if (status === 'live') {
      toast.success('Match started!');
    } else if (status === 'completed') {
      toast.success('Match completed!');
    }
  };

  const handleStartNextMatch = () => {
    const nextMatch = startNextMatch();
    if (nextMatch) {
      toast.success(`Started: ${nextMatch.team1.name} vs ${nextMatch.team2.name}`);
    }
  };

  const handleResolveConflicts = () => {
    resolveScheduleConflicts();
    toast.success('Schedule conflicts resolved automatically!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-glow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 p-2 rounded-lg">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Sports Tournament Manager</h1>
                <p className="text-primary-foreground/80">Professional Tournament Organization System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{teamCount}</div>
                <div className="text-sm text-primary-foreground/80">Teams</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{matchCount}</div>
                <div className="text-sm text-primary-foreground/80">Matches</div>
              </div>
              {conflicts.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {conflicts.length} Conflicts
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Zap className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              Teams ({teamCount})
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="h-4 w-4" />
              Matches ({matchCount})
            </TabsTrigger>
            <TabsTrigger 
              value="registration" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
              Register
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <TournamentDashboard
              teams={teams}
              matches={matches}
              conflicts={conflicts}
              onResolveConflicts={handleResolveConflicts}
              onStartNextMatch={handleStartNextMatch}
              nextMatch={getNextMatch()}
            />
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Registered Teams</h2>
              <Button
                onClick={() => setActiveTab('registration')}
                variant="hero"
              >
                <Users className="h-4 w-4 mr-2" />
                Add New Team
              </Button>
            </div>
            
            {teams.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Teams Registered</h3>
                <p className="text-muted-foreground">Register your first team to start the tournament!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onRemove={handleRemoveTeam}
                    stats={getTeamStats(team.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Tournament Matches</h2>
              {conflicts.length > 0 && (
                <Button
                  onClick={handleResolveConflicts}
                  variant="destructive"
                  className="animate-pulse"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Resolve {conflicts.length} Conflicts
                </Button>
              )}
            </div>
            
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Matches Scheduled</h3>
                <p className="text-muted-foreground">Register at least 2 teams to generate the match schedule!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onUpdateStatus={handleMatchStatusUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="registration" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <TeamRegistration onAddTeam={handleAddTeam} />
              
              {teams.length > 0 && (
                <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/20">
                  <h3 className="text-lg font-semibold text-accent mb-2">Tournament Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{teamCount}</div>
                      <div className="text-muted-foreground">Teams Registered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{matchCount}</div>
                      <div className="text-muted-foreground">Matches Scheduled</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-match-completed">
                        {matches.filter(m => m.status === 'completed').length}
                      </div>
                      <div className="text-muted-foreground">Completed</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

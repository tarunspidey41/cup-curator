import { useState, useEffect } from 'react';
import { Team, Match } from '@/types/tournament';
import { TournamentTeamList } from '@/utils/teamLinkedList';
import { TournamentScheduleQueue } from '@/utils/matchQueue';
import { preloadedTeams, generateSchedule } from '@/utils/tournamentData';

export const useTournament = () => {
  const [teamList] = useState(() => new TournamentTeamList());
  const [scheduleQueue] = useState(() => new TournamentScheduleQueue());
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize with preloaded data
    preloadedTeams.forEach(team => {
      teamList.addTeam(team);
    });
    
    const initialMatches = generateSchedule(preloadedTeams);
    initialMatches.forEach(match => {
      scheduleQueue.enqueue(match);
    });
    
    setTeams(teamList.getAllTeams());
    setMatches(scheduleQueue.getAllMatches());
  }, [teamList, scheduleQueue]);

  const addTeam = (team: Omit<Team, 'id' | 'next'>) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
      next: null
    };
    
    teamList.addTeam(newTeam);
    setTeams(teamList.getAllTeams());
    
    // Regenerate schedule if needed
    if (teamList.getTeamCount() > 1) {
      const newMatches = generateSchedule(teamList.getAllTeams());
      // Clear current schedule and add new matches
      while (!scheduleQueue.isEmpty()) {
        scheduleQueue.dequeue();
      }
      newMatches.forEach(match => scheduleQueue.enqueue(match));
      setMatches(scheduleQueue.getAllMatches());
    }
  };

  const removeTeam = (teamId: string) => {
    if (teamList.removeTeam(teamId)) {
      setTeams(teamList.getAllTeams());
      
      // Remove matches involving this team and regenerate
      const updatedTeams = teamList.getAllTeams();
      if (updatedTeams.length > 1) {
        const newMatches = generateSchedule(updatedTeams);
        while (!scheduleQueue.isEmpty()) {
          scheduleQueue.dequeue();
        }
        newMatches.forEach(match => scheduleQueue.enqueue(match));
        setMatches(scheduleQueue.getAllMatches());
      } else {
        setMatches([]);
      }
    }
  };

  const updateMatchStatus = (matchId: string, status: 'scheduled' | 'live' | 'completed', score?: { team1: number; team2: number }) => {
    const allMatches = scheduleQueue.getAllMatches();
    const matchToUpdate = allMatches.find(m => m.id === matchId);
    
    if (matchToUpdate) {
      matchToUpdate.status = status;
      if (score) {
        matchToUpdate.score = score;
        
        // Update team statistics
        const team1 = teamList.findTeam(matchToUpdate.team1.id);
        const team2 = teamList.findTeam(matchToUpdate.team2.id);
        
        if (team1 && team2) {
          team1.goalsFor += score.team1;
          team1.goalsAgainst += score.team2;
          team2.goalsFor += score.team2;
          team2.goalsAgainst += score.team1;
          
          if (score.team1 > score.team2) {
            team1.wins++;
            team2.losses++;
          } else if (score.team2 > score.team1) {
            team2.wins++;
            team1.losses++;
          }
        }
      }
      
      setMatches([...allMatches]);
      setTeams(teamList.getAllTeams());
    }
  };

  const getNextMatch = () => {
    return scheduleQueue.peek();
  };

  const startNextMatch = () => {
    const nextMatch = scheduleQueue.peek();
    if (nextMatch && nextMatch.status === 'scheduled') {
      updateMatchStatus(nextMatch.id, 'live');
    }
    return nextMatch;
  };

  const resolveScheduleConflicts = () => {
    setLoading(true);
    scheduleQueue.resolveConflicts();
    setMatches(scheduleQueue.getAllMatches());
    setLoading(false);
  };

  const getTeamStats = (teamId: string) => {
    const team = teamList.findTeam(teamId);
    if (!team) return null;
    
    const teamMatches = matches.filter(m => 
      m.team1.id === teamId || m.team2.id === teamId
    );
    
    return {
      ...team,
      totalMatches: teamMatches.length,
      upcomingMatches: teamMatches.filter(m => m.status === 'scheduled').length,
      goalDifference: team.goalsFor - team.goalsAgainst
    };
  };

  return {
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
    teamCount: teamList.getTeamCount(),
    matchCount: scheduleQueue.size(),
    conflicts: scheduleQueue.findConflicts()
  };
};
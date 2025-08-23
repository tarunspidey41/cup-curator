import { Team, Match } from '@/types/tournament';

export const preloadedTeams: Team[] = [
  {
    id: '1',
    name: 'Thunder Bolts',
    players: ['Alex Johnson', 'Maria Garcia', 'James Wilson', 'Sarah Chen'],
    founded: '2019',
    wins: 15,
    losses: 3,
    goalsFor: 45,
    goalsAgainst: 18,
    next: null
  },
  {
    id: '2',
    name: 'Fire Dragons',
    players: ['Michael Brown', 'Lisa Wang', 'David Martinez', 'Emma Thompson'],
    founded: '2020',
    wins: 12,
    losses: 6,
    goalsFor: 38,
    goalsAgainst: 25,
    next: null
  },
  {
    id: '3',
    name: 'Ice Wolves',
    players: ['Robert Lee', 'Anna Petrov', 'Carlos Rodriguez', 'Sophie Miller'],
    founded: '2018',
    wins: 18,
    losses: 2,
    goalsFor: 52,
    goalsAgainst: 12,
    next: null
  },
  {
    id: '4',
    name: 'Storm Eagles',
    players: ['Kevin Park', 'Rachel Adams', 'Tony Zhao', 'Nina Foster'],
    founded: '2021',
    wins: 9,
    losses: 9,
    goalsFor: 31,
    goalsAgainst: 33,
    next: null
  },
  {
    id: '5',
    name: 'Lightning Sharks',
    players: ['Daniel Kim', 'Victoria Cruz', 'Ahmed Hassan', 'Grace Liu'],
    founded: '2019',
    wins: 13,
    losses: 5,
    goalsFor: 41,
    goalsAgainst: 22,
    next: null
  },
  {
    id: '6',
    name: 'Blazing Phoenix',
    players: ['Jason Wright', 'Mia Gonzalez', 'Ryan O\'Connor', 'Zara Ali'],
    founded: '2020',
    wins: 16,
    losses: 2,
    goalsFor: 48,
    goalsAgainst: 15,
    next: null
  }
];

export const generateSchedule = (teams: Team[]): Match[] => {
  const matches: Match[] = [];
  const venues = ['Stadium Alpha', 'Arena Beta', 'Ground Gamma', 'Field Delta', 'Court Epsilon'];
  
  // Generate round-robin matches
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const baseTime = new Date();
      const matchTime = new Date(baseTime.getTime() + matches.length * 2 * 60 * 60 * 1000); // 2 hours apart
      
      matches.push({
        id: `match-${i}-${j}`,
        team1: teams[i],
        team2: teams[j],
        scheduledTime: matchTime,
        status: matches.length < 3 ? 'completed' : matches.length < 6 ? 'live' : 'scheduled',
        score: matches.length < 3 ? {
          team1: Math.floor(Math.random() * 4),
          team2: Math.floor(Math.random() * 4)
        } : undefined,
        venue: venues[matches.length % venues.length],
        round: `Round ${Math.floor(matches.length / 3) + 1}`
      });
    }
  }
  
  return matches;
};
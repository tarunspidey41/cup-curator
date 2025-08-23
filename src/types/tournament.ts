export interface Team {
  id: string;
  name: string;
  players: string[];
  founded: string;
  wins: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  next?: Team | null;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  scheduledTime: Date;
  status: 'scheduled' | 'live' | 'completed';
  score?: {
    team1: number;
    team2: number;
  };
  venue: string;
  round: string;
}

export interface ScheduleQueue {
  matches: Match[];
  enqueue: (match: Match) => void;
  dequeue: () => Match | null;
  peek: () => Match | null;
  isEmpty: () => boolean;
  size: () => number;
}

export interface TeamNode {
  team: Team;
  next: TeamNode | null;
}

export interface TeamLinkedList {
  head: TeamNode | null;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => boolean;
  findTeam: (teamId: string) => Team | null;
  getAllTeams: () => Team[];
  getTeamCount: () => number;
}
import { Match, ScheduleQueue } from '@/types/tournament';

export class TournamentScheduleQueue implements ScheduleQueue {
  matches: Match[] = [];
  private front = 0;
  private rear = 0;

  enqueue(match: Match): void {
    this.matches[this.rear] = match;
    this.rear++;
  }

  dequeue(): Match | null {
    if (this.isEmpty()) {
      return null;
    }
    
    const match = this.matches[this.front];
    this.front++;
    
    // Reset pointers when queue becomes empty
    if (this.front === this.rear) {
      this.front = 0;
      this.rear = 0;
      this.matches = [];
    }
    
    return match;
  }

  peek(): Match | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.matches[this.front];
  }

  isEmpty(): boolean {
    return this.front === this.rear;
  }

  size(): number {
    return this.rear - this.front;
  }

  getAllMatches(): Match[] {
    return this.matches.slice(this.front, this.rear);
  }

  // Advanced scheduling methods
  scheduleRoundRobin(teams: any[]): void {
    const venues = ['Stadium Alpha', 'Arena Beta', 'Ground Gamma', 'Field Delta', 'Court Epsilon'];
    
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const baseTime = new Date();
        const matchTime = new Date(baseTime.getTime() + this.size() * 2 * 60 * 60 * 1000);
        
        const match: Match = {
          id: `match-${Date.now()}-${i}-${j}`,
          team1: teams[i],
          team2: teams[j],
          scheduledTime: matchTime,
          status: 'scheduled',
          venue: venues[this.size() % venues.length],
          round: `Round ${Math.floor(this.size() / 3) + 1}`
        };
        
        this.enqueue(match);
      }
    }
  }

  findConflicts(): Match[] {
    const conflicts: Match[] = [];
    const allMatches = this.getAllMatches();
    
    for (let i = 0; i < allMatches.length; i++) {
      for (let j = i + 1; j < allMatches.length; j++) {
        const match1 = allMatches[i];
        const match2 = allMatches[j];
        
        // Check for time conflicts (within 2 hours)
        const timeDiff = Math.abs(match1.scheduledTime.getTime() - match2.scheduledTime.getTime());
        if (timeDiff < 2 * 60 * 60 * 1000) {
          // Check for team conflicts
          if (match1.team1.id === match2.team1.id || 
              match1.team1.id === match2.team2.id ||
              match1.team2.id === match2.team1.id || 
              match1.team2.id === match2.team2.id) {
            conflicts.push(match1, match2);
          }
          
          // Check for venue conflicts
          if (match1.venue === match2.venue) {
            conflicts.push(match1, match2);
          }
        }
      }
    }
    
    return conflicts;
  }

  resolveConflicts(): void {
    const conflicts = this.findConflicts();
    const processedMatches = new Set<string>();
    
    conflicts.forEach(match => {
      if (!processedMatches.has(match.id)) {
        // Add 2 hours to the match time
        match.scheduledTime = new Date(match.scheduledTime.getTime() + 2 * 60 * 60 * 1000);
        processedMatches.add(match.id);
      }
    });
  }
}
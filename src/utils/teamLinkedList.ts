import { Team, TeamNode, TeamLinkedList } from '@/types/tournament';

export class TournamentTeamList implements TeamLinkedList {
  head: TeamNode | null = null;

  addTeam(team: Team): void {
    const newNode: TeamNode = {
      team,
      next: null
    };

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }

  removeTeam(teamId: string): boolean {
    if (!this.head) return false;

    if (this.head.team.id === teamId) {
      this.head = this.head.next;
      return true;
    }

    let current = this.head;
    while (current.next && current.next.team.id !== teamId) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      return true;
    }

    return false;
  }

  findTeam(teamId: string): Team | null {
    let current = this.head;
    while (current) {
      if (current.team.id === teamId) {
        return current.team;
      }
      current = current.next;
    }
    return null;
  }

  getAllTeams(): Team[] {
    const teams: Team[] = [];
    let current = this.head;
    while (current) {
      teams.push(current.team);
      current = current.next;
    }
    return teams;
  }

  getTeamCount(): number {
    let count = 0;
    let current = this.head;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }

  updateTeam(teamId: string, updatedTeam: Partial<Team>): boolean {
    const team = this.findTeam(teamId);
    if (team) {
      Object.assign(team, updatedTeam);
      return true;
    }
    return false;
  }
}
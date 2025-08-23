import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, UserPlus } from 'lucide-react';
import { Team } from '@/types/tournament';

interface TeamRegistrationProps {
  onAddTeam: (team: Omit<Team, 'id' | 'next'>) => void;
}

export const TeamRegistration = ({ onAddTeam }: TeamRegistrationProps) => {
  const [teamName, setTeamName] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [players, setPlayers] = useState(['', '', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName.trim() || !foundedYear.trim()) return;
    
    const validPlayers = players.filter(player => player.trim() !== '');
    if (validPlayers.length === 0) return;

    const newTeam = {
      name: teamName.trim(),
      players: validPlayers,
      founded: foundedYear.trim(),
      wins: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };

    onAddTeam(newTeam);
    
    // Reset form
    setTeamName('');
    setFoundedYear('');
    setPlayers(['', '', '', '']);
  };

  const updatePlayer = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayerField = () => {
    setPlayers([...players, '']);
  };

  return (
    <Card className="bg-gradient-card border-2 border-accent/20 shadow-accent/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <UserPlus className="h-5 w-5" />
          Register New Team
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamName" className="text-foreground font-medium">
                Team Name *
              </Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="mt-1 border-primary/30 focus:border-primary"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="foundedYear" className="text-foreground font-medium">
                Founded Year *
              </Label>
              <Input
                id="foundedYear"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="e.g., 2023"
                className="mt-1 border-primary/30 focus:border-primary"
                required
              />
            </div>
          </div>
          
          <div>
            <Label className="text-foreground font-medium mb-2 block">
              Players (minimum 1 required) *
            </Label>
            <div className="space-y-2">
              {players.map((player, index) => (
                <Input
                  key={index}
                  value={player}
                  onChange={(e) => updatePlayer(index, e.target.value)}
                  placeholder={`Player ${index + 1} name`}
                  className="border-primary/30 focus:border-primary"
                />
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addPlayerField}
                className="w-full border-dashed border-accent/50 text-accent hover:bg-accent/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Player
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={!teamName.trim() || !foundedYear.trim() || !players.some(p => p.trim())}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Register Team
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
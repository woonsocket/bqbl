export class League {
  name: string;
  maxPlays: number;
  dh: boolean;
  dhMax: number;
}

export class User {
  name: string;
  teams: TeamSpec[];
  leagueId: string;
  weeks: Week[];
  dh: boolean;
}

export class Week {
  id: string;
  teams: TeamEntry[];
}

export class TeamEntry {
  name: string;
  selected: boolean;
}

export class TeamSpec {
  name: string;
}

export class Time {
  constructor(
    public week: string, 
    public year: string) {}
};
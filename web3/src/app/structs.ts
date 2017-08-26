
export class User {
  name: string;
  teams: Team[];
  weeks: {};
  dh: boolean;
}

export class Week {
  id: string;
  teams: Team[];
}

export class Team {
  name: string;
  selected: boolean;
}
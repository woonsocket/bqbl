export function StartRow(name, team_1, team_2) {
  return { name, team_1, team_2 };
}

export function Start(team_name, score) {
  return { team_name, score }
}

export function Player(name, total, start_rows) {
  return { name, total, start_rows };
}


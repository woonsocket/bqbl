/**
 * @param {string} name An NFL team ID.
 * @param {number} score247 The total 24/7 points scored by that team.
 */
export function PlayerTeam(name, score247) {
  return { name, score247 };
}

/**
 * @param {string} name The player's name.
 * @param {number} total The player's total score.
 * @param {!Object} start_rows A map from week ID to a StartRow for the player
 *     for that week.
 * @param {!Array<!PlayerTeam>} teams A list of the player's owned teams.
 */
export function Player(name, total, start_rows, teams) {
  return { name, total, start_rows, teams };
}

export function StartRow(name, team_1, team_2) {
  return { name, team_1, team_2 };
}

export function Start(team_name, score) {
  return { team_name, score };
}

import * as FOOTBALL from "../constants/football";

export function processYearScoresByNflTeam(dbScores, dbScores247) {
  const scores247ByTeam = process247ByTeam(dbScores247);
  const teamTable = {};
  const allTeams = Object.keys(dbScores[Object.keys(dbScores)[0]]);
  for (const teamId of allTeams) {
    const points247 = scores247ByTeam[teamId] || 0;
    teamTable[teamId] = {
      weeks: {},
      points247,
      total: points247,
    };
  }
  for (const [weekId, weekScoresByTeam] of Object.entries(dbScores)) {
    for (const [teamId, weekScores] of Object.entries(weekScoresByTeam)) {
      if (!(teamId in teamTable) || !(weekId in FOOTBALL.REGULAR_SEASON_WEEK_IDS)) {
        continue;
      }
      teamTable[teamId].weeks[weekId] = weekScores.total;
      teamTable[teamId].total += weekScores.total;
    }
  }
  return teamTable;
}

// TODO(aerion): This is terrible, but it's separate from joinScores because
// the database schemas for regular season and pro bowl are different.
export function joinProBowlScores(dbScores, proBowlStarts, week) {
  let dbWeekScores = dbScores[week] || {};
  const players = [];
  for (const { name, id, starts } of proBowlStarts) {
    const teams = [];
    let totalScore = 0;
    for (const teamName of starts) {
      const score =
        (dbWeekScores[teamName] && dbWeekScores[teamName].total) || 0;
      totalScore += score;
      teams.push({ team: teamName, score: score });
    }
    players.push({ name, id, teams, totalScore });
  }
  return players;
}

// function sanitizeScoresDataWeek(dbScoresWeek) {
//   dbScoresWeek["none"] = { total: 0 };
//   // TODO: OK this is what my team means when they say technical debt.
//   if (!dbScoresWeek["WAS"] && dbScoresWeek["WSH"]) {
//     dbScoresWeek["WAS"] = JSON.parse(JSON.stringify(dbScoresWeek["WSH"]));
//   }
//   if (!dbScoresWeek["LA"] && dbScoresWeek["LAR"]) {
//     dbScoresWeek["LA"] = JSON.parse(JSON.stringify(dbScoresWeek["LAR"]));
//   }
//   return dbScoresWeek;
// }

/** Sums 24/7 scores for each team. */
function process247ByTeam(dbScoresObj) {
  const byTeam = {};
  for (const entry of Object.values(dbScoresObj)) {
    byTeam[entry.team] = (byTeam[entry.team] || 0) + entry.points;
  }
  return byTeam;
}

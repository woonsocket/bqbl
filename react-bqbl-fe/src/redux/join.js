import { createSelector } from "reselect";
import * as R from "ramda";
import * as TEMPLATES from "../middle/templates";
import * as FOOTBALL from "../constants/football";

const getYear = (state) => state.year;
const getLeague = (state) => state.league;
const getScores = (state) => state.scores;
const getScores247 = (state) => state.scores247;

/* 
{'$uid': {
  name: string,
  start_rows: {"$week_id": {name: string, team_1: {team_name: string, score: number}, team_2: ...}
  teams: [{name: string, score247: number}]
}}
*/

// TODO: pro bowl scores

// TODO: memoize this
export const joinScoresToStarts = createSelector(
  [getYear, getLeague, getScores, getScores247],
  (year, league, scores, scores247) => {
    // Perform the join logic here, combining posts with authors
    const plays = R.path(["plays", year], league.spec);
    const users = R.path(["users", year], league.spec);
    if (!plays || !users || !scores) return {};
    let pys = processYearScores(
      scores,
      scores247,
      plays,
      users,
      FOOTBALL.WEEK_IDS
    );
    return pys;
  }
);

export function processYearScores(
  dbScores,
  dbScores247,
  dbStarts,
  dbPlayers,
  legal_weeks
) {
  const players = {};
  const scores247ByTeam = process247ByTeam(dbScores247);

  for (const playerKey of Object.keys(dbStarts)) {
    players[playerKey] = {
      name: dbPlayers[playerKey].name,
      teams: dbPlayers[playerKey].teams,
    };
  }
  let playerTable = {};
  for (const [playerId, player] of Object.entries(players)) {
    let start_rows = {};
    for (const weekId of Object.values(legal_weeks)) {
      const startedTeams = getStartedTeams(dbStarts, playerId, weekId);
      const scores = startedTeams.map(
        scoreForTeam.bind(null, dbScores, weekId)
      ) || [0, 0];
      start_rows[weekId] = {
        team_1: { team_name: startedTeams[0], score: Number(scores[0]) },
        team_2: { team_name: startedTeams[1], score: Number(scores[1]) },
      };
    }
    const playerTeams = player.teams.map((team) => {
      return TEMPLATES.PlayerTeam(
        team.name,
        Number(scores247ByTeam[team.name]) || 0
      );
    });

    let playerTotal = 0;
    for (const row of Object.values(start_rows)) {
      playerTotal += row.team_1.score + row.team_2.score;
    }
    for (const team of playerTeams) {
      playerTotal += team.score247;
    }

    playerTable[playerId] = TEMPLATES.Player(
      player.name,
      playerTotal,
      start_rows,
      playerTeams
    );
  }
  return playerTable;
}

function scoreForTeam(dbScores, week, team) {
  return R.path([week, team, "total"], dbScores) || 0;
}

function getStartedTeams(dbStarts, uid, week) {
  if (!dbStarts[uid][week]) {
    return ["none", "none"];
  }
  let starts = dbStarts[uid][week].teams
    .filter((team) => team.selected)
    .map((team) => team.name);
  starts = starts || [];
  while (starts.length < 2) {
    starts.push("none");
  }
  return starts;
}

/** Sums 24/7 scores for each team. */
function process247ByTeam(dbScoresObj) {
  const byTeam = {};
  for (const entry of Object.values(dbScoresObj)) {
    byTeam[entry.team] = (byTeam[entry.team] || 0) + entry.points;
  }
  return byTeam;
}

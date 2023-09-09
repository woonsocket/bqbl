import * as TEMPLATES from "./templates";
import * as FOOTBALL from "../constants/football";

export class LeagueSpecDataProxy {
  constructor(leagueData, year) {
    this.leagueData = leagueData;
    this.year = year;
  }

  isInLeague(uid) {
    const uids = Object.keys(this.leagueData.users[this.year]);
    return uids.indexOf(uid) !== -1;
  }

  getProBowlStarts() {
    const probowl = this.leagueData.probowl;
    if (!probowl) {
      return {};
    }
    return probowl[this.year] || {};
  }

  getTakenTeams() {
    if (
      !this.leagueData ||
      !this.leagueData.draft ||
      !this.leagueData.draft[this.year]
    ) {
      return;
    }
    return this.leagueData.draft[this.year].map((draftItem) => draftItem.team);
  }

  getDraftList() {
    return (this.leagueData.draft && this.leagueData.draft[this.year]) || [];
  }

  hasDh() {
    return this.leagueData["settings"][this.year].dh;
  }
}

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
      // TODO: shenanigans like not having starts in week 17 are causing exceptions.
      try {
        start_rows[weekId] = {
          name: dbStarts[playerId][weekId].name,
          team_1: {team_name: startedTeams[0], score: Number(scores[0])},
          team_2: {team_name: startedTeams[1], score: Number(scores[1])},
        };
      } catch (e) {}
    }
    const name = player.name;
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
      name,
      playerTotal,
      start_rows,
      playerTeams
    );
  }
  return playerTable;
}

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
    let dbWeekScores = sanitizeScoresDataWeek(weekScoresByTeam) || {};
    for (const [teamId, weekScores] of Object.entries(dbWeekScores)) {
      if (
        !(teamId in teamTable) ||
        !(weekId in FOOTBALL.REGULAR_SEASON_WEEK_IDS)
      ) {
        continue;
      }
      teamTable[teamId].weeks[weekId] = weekScores.total;
      teamTable[teamId].total += weekScores.total;
    }
  }
  return teamTable;
}

export function joinScores(dbScores, dbStarts, dbUsers, week) {
  let dbWeekScores = sanitizeScoresDataWeek(dbScores[week]) || {};
  let allStarts = getAllFromWeek(dbStarts, week);
  mergeData(dbWeekScores, allStarts);
  const playerList = [];
  for (let [playerKey, playerVal] of Object.entries(allStarts)) {
    let starts = [];
    for (let start of playerVal.teams) {
      if (start.selected) {
        starts.push(TEMPLATES.Start(start.name, start.total));
      }
    }
    if (starts.length === 0) {
      starts.push(TEMPLATES.Start("none", 0));
      starts.push(TEMPLATES.Start("none", 0));
    }
    if (starts.length === 1) {
      starts.push(TEMPLATES.Start("none", 0));
    }

    playerList.push({name: dbUsers[playerKey].name, team_1: starts[0], team_2: starts[1]});
  }
  return playerList;
}

// TODO(aerion): This is terrible, but it's separate from joinScores because
// the database schemas for regular season and pro bowl are different.
export function joinProBowlScores(dbScores, proBowlStarts, week) {
  let dbWeekScores = sanitizeScoresDataWeek(dbScores[week] || {});
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

function sanitizeScoresDataWeek(dbScoresWeek) {
  dbScoresWeek["none"] = { total: 0 };
  // TODO: OK this is what my team means when they say technical debt.
  if (!dbScoresWeek["WAS"] && dbScoresWeek["WSH"]) {
    dbScoresWeek["WAS"] = JSON.parse(JSON.stringify(dbScoresWeek["WSH"]));
  }
  if (!dbScoresWeek["LA"] && dbScoresWeek["LAR"]) {
    dbScoresWeek["LA"] = JSON.parse(JSON.stringify(dbScoresWeek["LAR"]));
  }
  return dbScoresWeek;
}

function scoreForTeam(dbScores, week, team) {
  if (!team || !dbScores.hasOwnProperty(week)) {
    return 0;
  }
  // TODO: DEBT DEBT DEBT
  sanitizeScoresDataWeek(dbScores[week]);
  return (
    (dbScores[week] && dbScores[week][team] && dbScores[week][team].total) || 0
  );
}

function getStartedTeams(dbStarts, uid, week) {
  if (!dbStarts[uid][week]) {
    // console.log(uid, week)
    // console.log(dbStarts[uid])
    return [];
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

function mergeData(scores, starts) {
  for (let playerVal of Object.values(starts)) {
    if (!playerVal.teams) {
      // For example, player didn't start anyone
      continue;
    }
    for (let team of playerVal.teams) {
      team.total = (scores[team.name] && scores[team.name].total) || 0;
    }
  }
}

function getAllFromWeek(startsDataValue, week) {
  let allStarts = {};

  for (let [playerKey, playerVal] of Object.entries(startsDataValue)) {
    if (playerVal[week]) {
      allStarts[playerKey] = playerVal[week];
    }
  }
  return allStarts;
}

/** Sums 24/7 scores for each team. */
function process247ByTeam(dbScoresObj) {
  const byTeam = {};
  for (const entry of Object.values(dbScoresObj)) {
    byTeam[entry.team] = (byTeam[entry.team] || 0) + entry.points;
  }
  return sanitizeScoresDataWeek(byTeam);
}

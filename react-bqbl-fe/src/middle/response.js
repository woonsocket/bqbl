import { ALL_TEAMS } from '../constants/football';
import * as TEMPLATES from './templates';

export class LeagueSpecDataProxy {
  constructor(leagueData, year) {
    this.leagueData = leagueData;
    this.year = year;
  }

  isInLeague(uid) {
    const uids = Object.keys(this.leagueData.users[this.year]);
    return uids.indexOf(uid) !== -1;
  }

  addUser(uid) {
    if (!this.leagueData.users) {
      this.leagueData.users = {};
      this.leagueData.users[this.year] = [];
    }

    let users = this.leagueData.users[this.year];
    users.push({ name: "Foo", uid: uid, teams: [] });
    return this.leagueData;
  }

  getTakenTeams() {
    if (!this.leagueData || !this.leagueData.draft || !this.leagueData.draft[this.year]) {
      return;
    }
    return this.leagueData.draft[this.year].map(draftItem => draftItem.team );
  }

  getDraftList() {
    return (this.leagueData.draft && this.leagueData.draft[this.year]) || [];
  }

  hasDh() {
    return this.leagueData['settings'][this.year].dh;
  }

}

export function processYearScores(
    dbScores, dbScores247, dbStarts, dbPlayers, legal_weeks) {
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
      const startedTeams = getStartedTeams(dbStarts, playerId, weekId)
      const scores = startedTeams.map(scoreForTeam.bind(null, dbScores, weekId)) || [0, 0]
      start_rows[weekId] = TEMPLATES.StartRow(
          dbStarts[playerId][weekId].name,
          TEMPLATES.Start(startedTeams[0], Number(scores[0])),
          TEMPLATES.Start(startedTeams[1], Number(scores[1])));
    }
    const name = (player.name);
    const playerTeams = player.teams.map((team) => {
      return TEMPLATES.PlayerTeam(
          team.name, Number(scores247ByTeam.get(team.name)) || 0);
    });

    let playerTotal = 0;
    for (const row of Object.values(start_rows)) {
      playerTotal += row.team_1.score + row.team_2.score;
    }
    for (const team of playerTeams) {
      playerTotal += team.score247;
    }

    playerTable[playerId] = TEMPLATES.Player(
        name, playerTotal, start_rows, playerTeams);
  }
  return playerTable;
}

export function processYearScoresByNflTeam(dbScores, dbScores247) {
  const scores247ByTeam = process247ByTeam(dbScores247);

  const teamTable = {};
  for (const teamId of ALL_TEAMS) {
    const points247 = scores247ByTeam.get(teamId) || 0;
    teamTable[teamId] = {
      weeks: {},
      points247,
      total: points247,
    };
  }
  for (const [weekId, weekScoresByTeam] of Object.entries(dbScores)) {
    for (const [teamId, weekScores] of Object.entries(weekScoresByTeam)) {
      if (!(teamId in teamTable)) {
        console.warn(`unknown team ${teamId}`);
        continue;
      }
      teamTable[teamId].weeks[weekId] = weekScores.total;
      teamTable[teamId].total += weekScores.total;
    }
  }
  return teamTable;
}

export function joinScores(dbScores, dbStarts, dbUsers, week) {
  let dbWeekScores = sanitizeScoresDataWeek(dbScores)[week];
  let allStarts = getAllFromWeek(dbStarts, week);
  mergeData(dbWeekScores, allStarts);
  const playerList = []
  for (let [playerKey, playerVal] of Object.entries(allStarts)) {
    let starts = [];
    for (let start of playerVal.teams) {
      if (start.selected) {
        starts.push(TEMPLATES.Start(start.name, start.total))
      }
    }
    if (starts.length === 0) {
      starts.push(TEMPLATES.Start('none', 0))
      starts.push(TEMPLATES.Start('none', 0))
    }
    if (starts.length === 1) {
      starts.push(TEMPLATES.Start('none', 0))
    }

    playerList.push(TEMPLATES.StartRow(dbUsers[playerKey].name, ...starts))
  }
  return playerList;
}

function sanitizeScoresDataWeek(dbScoresWeek) {
  dbScoresWeek['none'] = { total: 0 }
  return dbScoresWeek;
}

function scoreForTeam(dbScores, week, team) {
  if (!team) {
    return 0;
  }
  return (dbScores[week] && dbScores[week][team] && dbScores[week][team].total) || 0;
}

function getStartedTeams(dbStarts, uid, week) {
  let starts = dbStarts[uid][week].teams
      .filter(team => team.selected)
      .map(team => team.name);
  starts = starts || [];
  while (starts.length < 2) {
    starts.push('none');
  }
  return starts;
}

function mergeData(scores, starts) {
  for (let playerVal of Object.values(starts)) {
    if (!playerVal.teams) { // For example, player didn't start anyone
      continue;
    }
    for (let team of playerVal.teams) {
      team.total = (scores[team.name] && scores[team.name].total) || 0;
    }
  }
}

function getAllFromWeek(startsDataValue, week) {
  let allStarts = {}

  for (let [playerKey, playerVal] of Object.entries(startsDataValue)) {
    allStarts[playerKey] = playerVal[week];
  }
  return allStarts;
}

/** Sums 24/7 scores for each team. */
function process247ByTeam(dbScoresObj) {
  const byTeam = new Map();
  for (const entry of Object.values(dbScoresObj)) {
    byTeam.set(entry.team, (byTeam.get(entry.team) || 0) + entry.points);
  }
  return byTeam;
}

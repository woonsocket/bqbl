// Eventually, each page should have:
// 1. A base class which does the literal db lookup.
// 2. A data proxy, which is the only thing that knows the internal structure of the db.
// 3. A functional UI component, which is decoupled from db structure.

class ScoreJoiner {
  constructor(firebase, league, year, week) {
    this.firebase = firebase;
    this.league = league;
    this.year = year;
    this.week = week;
  }

  joinScores(setState) {
    const scoresPromise = this.firebase.scores_week(this.year, this.week).once('value');
    const startsPromise = this.firebase.league_starts(this.league, this.year, this.week).once('value');
    const usersPromise = this.firebase.league_users(this.league, this.year).once('value');
    return Promise.all([scoresPromise, startsPromise, usersPromise])
      .then(([scoresData, startsData, usersData]) => {
        if (!startsData.val() || !scoresData.val() || !usersData.val()) {
          alert("invalid response")
          return;
        }
        const scoresDataValue = sanitizeScoresDataWeek(scoresData.val());
        const usersDataValue = usersData.val()
        let allStarts = this.getAllFromWeek(startsData.val(), this.week);
        this.mergeData(scoresDataValue, allStarts);

        const playerList = []
        for (let [playerKey, playerVal] of Object.entries(allStarts)) {
          let starts = [];
          for (let start of playerVal.teams) {
            if (start.selected) {
              starts.push(this.createStart(start.name, start.total))
            }
          }
          if (starts.length == 0) {
            starts.push({team_name: 'none', total: 0})
            starts.push({team_name: 'none', total: 0})
          }
          if (starts.length == 1) {
            starts.push({team_name: 'none', total: 0})
          }

          playerList.push(this.createStartRow(usersDataValue[playerKey].name, ...starts))
        }
        console.log(playerList)
        setState(playerList);
      })
  }

  getAllFromWeek(startsDataValue, week) {
    let allStarts = {}
    for (let [playerKey, playerVal] of Object.entries(startsDataValue)) {
      allStarts[playerKey] = playerVal[week];
    }
    return allStarts;
  }

  mergeData(scores, starts) {
    for (let [playerKey, playerVal] of Object.entries(starts)) {
      if (!playerVal.teams) { // For example, player didn't start anyone
        continue;
      }
      for (let team of playerVal.teams) {
        team.total = (scores[team.name] && scores[team.name].total) || 0;
      }
    }
  }

  createStartRow(name, team_1, team_2) {
    return { name, team_1, team_2 };
  }
  createStart(team_name, score) {
    return { team_name, score }
  }

}

function sanitizeScoresDataWeek(dbScoresWeek) {
  dbScoresWeek['none'] = { total: 0 }
  return dbScoresWeek;
}

export default ScoreJoiner;

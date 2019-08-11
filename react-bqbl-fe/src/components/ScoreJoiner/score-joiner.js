// TODO: Build this into a larger data proxy.
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
    const startsPromise = this.firebase.league_starts_week(
      '-KtC8hcGgvbh2W2Tq79n', this.year, this.week).once('value');
    return Promise.all([scoresPromise, startsPromise])
      .then(([scoresData, startsData]) => {
        const scoresDataValue = scoresData.val();
        let startsDataValue = startsData.val();
        this.mergeData(scoresDataValue, startsDataValue);
        console.log(startsDataValue)
        let playerList = this.createPlayerListFromMergedData(startsDataValue);
        setState({ playerList: playerList });
      })
  }

  mergeData(scores, starts) {
    for (let playerVal of Object.values(starts)) {
      if (!playerVal.starts) { // For example, player didn't start anyone
        continue;
      }
      for (let start of playerVal.starts) {
        start.total = scores[start.name].total;
      }
    }
  }

  createPlayerListFromMergedData(startsDataValue) {
    return Object.values(startsDataValue).map(player => {
      return this.createStartRow(
        player.name,
        ...player.starts.map(start => this.createStart(start.name, start.total)))
    })
  }

  createStartRow(name, team_1, team_2) {
    return { name, team_1, team_2 };
  }
  createStart(team_name, score) {
    return { team_name, score }
  }

}

export default ScoreJoiner;

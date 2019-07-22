class ScoreJoiner {
  constructor(firebase, year, week) {
    this.firebase = firebase;
    this.year = year;
    this.week = week;
  }

  joinScores(setState) {
    const scoresPromise = this.firebase.scores_week(this.year, this.week).once('value');
    // TODO: Get the league ID this user is assigned to
    const startsPromise = this.firebase.league_starts_week(
      '-KtC8hcGgvbh2W2Tq79n', this.year, this.week).once('value');
    
    return Promise.all([scoresPromise, startsPromise])
      .then(([scoresData, startsData]) => {
        const scoresDataValue = scoresData.val();
        let startsDataValue = startsData.val();
        this.mergeData(scoresDataValue, startsDataValue);
        setState({ playerList: startsDataValue });
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
}

export default ScoreJoiner;

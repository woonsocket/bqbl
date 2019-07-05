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
        let startsDataProcessed = startsData.val();
        for (let playerVal of Object.values(startsDataProcessed)) {
          for (let start of playerVal.starts) {
            start.total = scoresDataValue[start.name].total;
          }
        }
        setState({ playerList: startsDataProcessed });
      })
  }
}

export default ScoreJoiner;

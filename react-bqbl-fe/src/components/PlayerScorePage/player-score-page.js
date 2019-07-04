import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './player-score-page.css';
import WeekTeamRow from '../WeekTeam/week-team';

import { withFirebase } from '../Firebase';

class PlayerScorePageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerList: [],
      scores: {},
    };
  }

  componentDidMount() {
    const scoresPromise = this.props.firebase.scores_week(this.props.match.params.year, this.props.match.params.week).once('value');
    // TODO: Get the league ID this user is assigned to
    const startsPromise = this.props.firebase.league_starts_week(
      '-KtC8hcGgvbh2W2Tq79n', this.props.match.params.year, this.props.match.params.week).once('value');

    return Promise.all([scoresPromise, startsPromise])
      .then(([scoresData, startsData]) => {
        const scoresDataValue = scoresData.val();
        let startsDataProcessed = startsData.val();
        for (let playerVal of Object.values(startsDataProcessed)) {
          for (let start of playerVal.starts) {
            start.total = scoresDataValue[start.name].total;
          }
        }
        this.setState({ playerList: startsDataProcessed, scores: scoresData.val() });
      })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.playerList ? (
          Object.values(this.state.playerList).map(playerData => (
            <Card className="mdl-card">
            <CardContent>
              <Typography variant="h5" component="h2">
              {playerData.name}
              </Typography>
              <WeekTeamRow week={playerData} weekId={"1"}/>
            </CardContent>
          </Card>
              ))
        ) : (
            <div>There are no messages ...</div>
          )}
      </React.Fragment>
    );
  }
}

const PlayerScorePage = compose(
  withRouter,
  withFirebase,
)(PlayerScorePageBase);

export default PlayerScorePage;

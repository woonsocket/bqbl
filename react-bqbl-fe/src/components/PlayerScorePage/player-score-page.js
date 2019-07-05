import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './player-score-page.css';
import WeekTeamRow from '../WeekTeam/week-team';

import { withFirebase } from '../Firebase';
import ScoreJoiner from '../ScoreJoiner/score-joiner';

class PlayerScorePageBase extends Component {
  constructor(props) {
    super(props);
    this.scoreJoiner = new ScoreJoiner(
      this.props.firebase, this.props.match.params.year, this.props.match.params.week)
    this.state = {
      playerList: [],
    };
  }

  componentDidMount() {
    this.scoreJoiner.joinScores(this.setState.bind(this))
  }

  render() {
    return (
      <React.Fragment>
        {this.state.playerList ? (
          Object.values(this.state.playerList).map((playerData, idx) => (
            <Card className="mdl-card" key={idx}>
              <CardContent>
                <Typography variant="h5" component="h2">
                {playerData.name}
                </Typography>
                <WeekTeamRow week={playerData} weekId={"1"}/>
              </CardContent>
            </Card>
              ))
        ) : (
            <div>No score response</div>
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

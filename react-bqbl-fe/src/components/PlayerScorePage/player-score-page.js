import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './player-score-card.css';

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
    const scoresPromise = this.props.firebase.starts_week('2018', '2').once('value');
    const startsPromise = this.props.firebase.scores_week('2018', '2').once('value');

    return Promise.all([startsPromise, scoresPromise])
      .then(([scoresData, startsData]) => {
        console.log(scoresData);
        console.log(startsData);
        this.setState({ playerList: startsData.val(), scores: scoresData.val() });
      })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.playerList ? (
          Object.values(this.state.playerList).map(playerData => (
            // var playerData = this.state.playerList[playerKey];
            //playerData = this.state.playerList[playerKey]

            <Card className="mdl-card">
                          {/* {JSON.stringify(playerData)} */}

            <CardContent>
              <Typography variant="h5" component="h2">
              {playerData.name}
              </Typography>
              <Typography variant="h5" component="h2">
              {playerData.starts[0].name}
              {this.state.scores[playerData.starts[0].name].total}
              </Typography>
              <Typography variant="h5" component="h2">
                {playerData.starts[1].name}
                {this.state.scores[playerData.starts[1].name].total}
              </Typography>
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

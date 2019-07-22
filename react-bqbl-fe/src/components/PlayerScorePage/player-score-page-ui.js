import React, { Component } from 'react';

import './player-score-page.css';
import WeekTeamRow from '../WeekTeam/week-team-row';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

class PlayerScorePageUI extends Component {

  static propTypes = {
    playerList: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      playerList: props.playerList
    }
  }
  render() {
    return (
      <React.Fragment>
        <div>{JSON.stringify(this.state)}</div>
        {this.state.playerList ? (
          Object.values(this.state.playerList).map((playerData, idx) => (
            <Card className="mdl-card" key={idx}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {playerData.name}
                </Typography>
                <WeekTeamRow week={playerData} weekId={idx} />
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

export default PlayerScorePageUI;

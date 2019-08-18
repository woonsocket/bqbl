import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import ScoreJoiner from '../ScoreJoiner/score-joiner';

import IconScoreCell from '../reusable/IconScoreCell/icon-score-cell'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class PlayerScorePageBase extends Component {
  static propTypes = {
    firebase: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    let league = this.props.match.params.league;
    let year = this.props.match.params.year || "2018";
    let week = this.props.match.params.week || "2";
    this.scoreJoiner = new ScoreJoiner(this.props.firebase, league, year, week)
    this.state = {
      playerList: [],
    };
  }

  componentDidMount() {
    this.scoreJoiner.joinScores(this.setState.bind(this))
  }

  render() {
    return <PlayerScorePageUI playerList={this.state.playerList}/>
  }
}

PlayerScorePageUI.propTypes = {
  playerList: PropTypes.array.isRequired,
}

function PlayerScorePageUI(props) {
  return (
    <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell align="left">Team 1</TableCell>
        <TableCell align="left">Team 2</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {props.playerList.map(row => (
        <TableRow key={row.name}>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="left"><IconScoreCell team={row.team_1.team_name} score={row.team_1.score}/> </TableCell>
          <TableCell align="left"><IconScoreCell team={row.team_2.team_name} score={row.team_2.score}/> </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  )
}

const PlayerScorePage = compose(
  withRouter,
  withFirebase,
)(PlayerScorePageBase);

export default PlayerScorePage;

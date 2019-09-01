import React, { useState, useEffect } from 'react';

import { withFirebase } from '../../Firebase';
import ScoreJoiner from '../../ScoreJoiner/score-joiner';

import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

function PlayerScorePageBase(props) {
  let [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    new ScoreJoiner(props.firebase, props.league, props.year, props.week).joinScores(setPlayerList)
  }, [props.firebase, props.league, props.year, props.week]);

  return <PlayerScorePageUI playerList={playerList}/>
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

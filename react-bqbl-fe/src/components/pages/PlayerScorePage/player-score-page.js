import React, { useEffect, useState } from 'react';

import { withFirebase } from '../../Firebase';

import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {joinScores} from '../../../middle/response'

function PlayerScorePageBase(props) {
  let [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    props.firebase.scoresStartsUsersPromise(props.league, props.year).then(
      ({ dbScores, dbStarts, dbUsers }) =>
        joinScores(dbScores, dbStarts, dbUsers, props.week)
      ).then(val => setPlayerList(val));
  }, [props.firebase, props.league, props.year, props.week]);

  return <PlayerScorePageUI playerList={playerList}/>
}

// Array of TEMPLATES.StartRow
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

import React, { useEffect, useContext, useState } from 'react';

import { FirebaseContext } from '../../Firebase';

import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { joinScores } from '../../../middle/response'

function PlayerScorePage(props) {
  let [playerList, setPlayerList] = useState([]);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    return firebase.getScoresStartsUsersThen(props.league, props.year,
      ({ dbScores, dbStarts, dbUsers }) => {
        setPlayerList(joinScores(dbScores, dbStarts, dbUsers, props.week));
      });
  }, [firebase, props.league, props.year, props.week]);

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
        {playerList.map(row => (
          <TableRow key={row.name}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="left"><IconScoreCell team={row.team_1.team_name} score={row.team_1.score} /> </TableCell>
            <TableCell align="left"><IconScoreCell team={row.team_2.team_name} score={row.team_2.score} /> </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PlayerScorePage;

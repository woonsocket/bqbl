import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useContext, useEffect, useState } from 'react';
import { joinScores } from '../../../middle/response';
import { useLeague, useWeek, useYear } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell';
import RequireLeague from '../../reusable/RequireLeague';

function PlayerScorePage() {
  return <RequireLeague><PlayerScore/></RequireLeague>
}


function PlayerScore(props) {
  let [playerList, setPlayerList] = useState([]);
  const firebase = useContext(FirebaseContext);
  const week = useWeek();
  const year = useYear();
  const league = useLeague();

  useEffect(() => {
    return firebase.getScoresStartsUsersThen(league, year,
      ({ dbScores, dbStarts, dbUsers }) => {
        setPlayerList(joinScores(dbScores, dbStarts, dbUsers, week));
      });
  }, [firebase, league, year, week]);

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

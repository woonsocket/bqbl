import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useContext, useEffect, useState } from 'react';
import { joinScores } from '../../../middle/response';
import { useLeague, useWeek, useYear } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell';
import RequireLeague from '../../reusable/RequireLeague';

function PlayerScorePage() {
  return <RequireLeague><PlayerScore /></RequireLeague>
}


function PlayerScore(props) {
  let [playerList, setPlayerList] = useState([]);
  const firebase = useContext(FirebaseContext);
  const week = useWeek();
  const year = useYear();
  const league = useLeague();

  useEffect(() => {
    let [ssuPromise, unsubSsu] = firebase.getScoresStartsUsers(league, year);
    ssuPromise.then(({ dbScores, dbStarts, dbUsers }) => {
      setPlayerList(joinScores(dbScores, dbStarts, dbUsers, week));
    });
    return unsubSsu;
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

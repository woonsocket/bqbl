import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import * as TEMPLATES from "../../../middle/templates";
import { joinScoresToStarts } from "../../../redux/join";
import { useWeek } from '../../AppState/app-state';
import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell';
import RequireLeague from '../../reusable/RequireLeague';

function PlayerScorePage() {
  return <RequireLeague><PlayerScore/></RequireLeague>
}


function PlayerScore(props) {
  let [playerList, setPlayerList] = useState([]);
  const week = useWeek();
  const joined = useSelector(joinScoresToStarts);

  useEffect(() => {
    setPlayerList(extractWeek(joined, week));
  }, [joined, week]);

  function extractWeek(joined, week) {
    const playerList = [];
    for (let [_, playerVal] of Object.entries(joined)) {
      playerList.push(TEMPLATES.StartRow(playerVal.name, playerVal.start_rows[week].team_1, playerVal.start_rows[week].team_2));
    }
    return playerList;
  }
  
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

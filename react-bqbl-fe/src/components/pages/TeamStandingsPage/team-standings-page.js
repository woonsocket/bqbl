import React, { useEffect, useState } from 'react';

import { withFirebase } from '../../Firebase';
import * as FOOTBALL from '../../../constants/football';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// TODO: Separate the display and fetch logic.
function TeamStandingsPageBase(props) {
  let [allScores, setAllScores] = useState([]);

  useEffect(() => {
    props.firebase.scoresYearPromise(props.year).then(scores => {
      let weekMap = {};
      for (let [weekId, weekVal] of Object.entries(scores)) {
        for (let [teamId, teamVal] of Object.entries(weekVal)) {
          weekMap[teamId] = weekMap[teamId] || {};
          weekMap[teamId][weekId] = teamVal.total
        }
      }
      setAllScores(weekMap);
    })
  }, [props.firebase, props.league, props.year, props.week]);

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            {FOOTBALL.WEEK_IDS.map((val, k) =>
              <TableCell align="right" key={"week"+k}>{val}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(allScores).map((teamVal, teamKey) => (
            <TableRow key={"team"+teamKey}>
              <TableCell>{teamVal[0]}</TableCell>
              {FOOTBALL.WEEK_IDS.map((weekId) =>
                <TableCell key={"week2"+weekId}>
                  {JSON.stringify(teamVal[1][weekId])}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

const TeamStandingsPage = compose(
  withRouter,
  withFirebase,
)(TeamStandingsPageBase);

export default TeamStandingsPage;

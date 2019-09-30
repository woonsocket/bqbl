import React, { useEffect, useState } from 'react';

import * as FOOTBALL from '../../../constants/football';
import { withFirebase } from '../../Firebase';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { processYearScoresByNflTeam } from '../../../middle/response';
import IconAndName from '../../reusable/IconAndName/icon-and-name';
import ScoreValue from '../../reusable/ScoreValue/score-value';

function TeamStandingsPageBase(props) {
  let [allScores, setAllScores] = useState([]);

  useEffect(() => {
    props.firebase.getScoresYearThen(props.year, ({dbScores, dbScores247}) => {
      setAllScores(processYearScoresByNflTeam(dbScores, dbScores247));
    });
  }, [props.firebase, props.league, props.year]);

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>24/7</TableCell>
            {FOOTBALL.WEEK_IDS.map((val, k) =>
              <TableCell align="right" key={"week_" + k}>{val}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(allScores).map(([teamId, teamScores], index) => (
            <TableRow key={"team" + index}>
              <TableCell><IconAndName team={teamId} /></TableCell>
              <TableCell align="right">
                <ScoreValue score={teamScores.total} />
              </TableCell>
              <TableCell align="right">
                <ScoreValue score={teamScores.points247} />
              </TableCell>
              {FOOTBALL.WEEK_IDS.map((weekId) =>
                <TableCell key={"week2_" + weekId} align="right">
                  <ScoreValue score={teamScores.weeks[weekId]} />
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

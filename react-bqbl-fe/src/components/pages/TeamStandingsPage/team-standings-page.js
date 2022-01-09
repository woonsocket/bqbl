import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useContext, useEffect, useState } from 'react';
import * as FOOTBALL from '../../../constants/football';
import { processYearScoresByNflTeam } from '../../../middle/response';
import { useLeague, useYear } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import IconAndName from '../../reusable/IconAndName/icon-and-name';
import ScoreValue from '../../reusable/ScoreValue/score-value';

function TeamStandingsPage() {
  const firebase = useContext(FirebaseContext);
  let [allScores, setAllScores] = useState([]);
  let year = useYear();
  let league = useLeague();
 
  useEffect(() => {
    const [scoresYearPromise, unsubScoresYear] = firebase.getScoresYear(year);
        scoresYearPromise.then(
        ({dbScores, dbScores247}) => {
          const scoreEntries = Object.entries(
              processYearScoresByNflTeam(dbScores, dbScores247));
          scoreEntries.sort(([_id1, scores1], [_id2, scores2]) => {
            return scores2.total - scores1.total;
          });
          setAllScores(scoreEntries);
        }).catch(function (err){
          console.log(err);
      });;
    return unsubScoresYear;
  }, [firebase, league, year]);

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
          {allScores.map(([teamId, teamScores], index) => (
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

export default TeamStandingsPage;

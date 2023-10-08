import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as FOOTBALL from "../../../constants/football";
import { processYearScoresByNflTeam } from "../../../middle/response";
import IconAndName from "../../reusable/IconAndName/icon-and-name";
import ScoreValue from "../../reusable/ScoreValue/score-value";
import { isEmpty } from "ramda";

function TeamStandingsPage(props) {
  let [allScores, setAllScores] = useState([]);
  let scores = useSelector((state) => state.scores);
  let scores247 = useSelector((state) => state.scores247);

  useEffect(() => {
    if (!scores || !scores247 || isEmpty(scores)) return;
    const scoreEntries = Object.entries(
      processYearScoresByNflTeam(scores, scores247)
    );
    scoreEntries.sort(([_id1, scores1], [_id2, scores2]) => {
      return scores2.total - scores1.total;
    });
    setAllScores(scoreEntries);
  }, [scores, scores247]);

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>24/7</TableCell>
            {FOOTBALL.WEEK_IDS.map((val, k) => (
              <TableCell align="right" key={"week_" + k}>
                {val}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody data-testid="team-rows">
          {allScores.map(([teamId, teamScores], index) => (
            <TableRow key={"team" + index} data-testid="team-row">
              <TableCell>
                <IconAndName team={teamId} />
              </TableCell>
              <TableCell align="right">
                <ScoreValue
                  data-testid="score-value"
                  score={teamScores.total}
                />
              </TableCell>
              <TableCell align="right">
                <ScoreValue score={teamScores.points247} />
              </TableCell>
              {FOOTBALL.WEEK_IDS.map((weekId) => (
                <TableCell key={"week2_" + weekId} align="right">
                  <ScoreValue score={teamScores.weeks[weekId]} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default TeamStandingsPage;

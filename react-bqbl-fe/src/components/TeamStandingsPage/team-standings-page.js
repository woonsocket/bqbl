import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import * as FOOTBALL from '../../constants/football';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class TeamStandingsPageBase extends Component {
  constructor(props) {
    super(props);
    this.year = this.props.match.params.year || "2018";

    this.state = {
      allScores: [],
    };
  }

  componentDidMount() {
    this.props.firebase.scores_year(this.year).on('value', snapshot => {
      let weekMap = {};
      for (let [weekId, weekVal] of Object.entries(snapshot.val())) {
        for (let [teamId, teamVal] of Object.entries(weekVal)) {
          weekMap[teamId] = weekMap[teamId] || {};
          weekMap[teamId][weekId] = teamVal.total
        }
      }
      this.setState({ allScores: weekMap })
    })
  }

  render() {
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
            {Object.entries(this.state.allScores).map((teamVal, teamKey) => (
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
}

const TeamStandingsPage = compose(
  withRouter,
  withFirebase,
)(TeamStandingsPageBase);

export default TeamStandingsPage;

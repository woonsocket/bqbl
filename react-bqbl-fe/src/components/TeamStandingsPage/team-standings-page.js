import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { withFirebase } from '../Firebase';

const WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17",]

class TeamStandingsPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allScores: [],
    };
  }

  componentDidMount() {
    this.props.firebase.scores_year('2018').on('value', snapshot => {
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
              {WEEK_IDS.map((v, k) =>
                <TableCell align="right">{v}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(this.state.allScores).map((teamVal, teamKey) => (
              <TableRow>
                <TableCell>{teamVal[0]}</TableCell>
                {WEEK_IDS.map((weekId) =>
                  <TableCell>
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

import React, { Component } from 'react';

import './lineup.css'
import { withFirebase } from '../Firebase';
import * as FOOTBALL from '../../constants/football';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';

// TODO: Fully decouple data and UI.
class LineupPageBase extends Component {
  constructor(props) {
    super(props);
    this.user = null;
    this.leagueId = props.match.params.league;
    this.year = props.year || '2019';
    this.state = {
      valsList: [],
      dh: false
    };
  }

  componentDidMount() {
    this.props.firebase.addAuthListener(this.authChanged.bind(this))
  }

  authChanged(user) {
    if (!user) {
        // eslint-disable-next-line no-console
        console.log("bail!");
      return;
    }
    this.user = user;
    // TODO: key starts by league && UID.
    this.props.firebase.starts_year(user.uid, this.year)
      .on('value', snapshot => {
        this.setState({ valsList: Object.values(snapshot.val())});
      })
    this.props.firebase.hasDh(this.leagueId, this.year,
      hasDh => {this.setState({dh: hasDh})}
    );
  }

  updateCallback(weekData, weekId) {
    this.props.firebase.starts_week(this.user.uid, '2019', weekId)
      .update(weekData);
  }

  clickCallback(weekId, cell, val) {
    const weekIndex = weekId * 1 - 1;
    let row = this.state.valsList[weekIndex];
    // The DH continues to be my enemy.
    if (cell === 5 && row.teams.length === 4) {
      row.teams.push({name:'', selected:false})
    }
    if (row.teams.length <= cell) {
      row.teams.push({name:val, selected:false})
    }
    row.teams[cell].selected = !row.teams[cell].selected;
    this.setState({ valsList: this.state.valsList })
    this.props.firebase.starts_week(this.user.uid, '2019', weekIndex).update(row);
  }

  render() {
    return (
      <Table size="small">
        <TableBody>
          {this.state.valsList.map((week, index) => (
            <LineupWeek
              week={week} index={index} dh={this.state.dh} key={index}
              clickCallback={this.clickCallback.bind(this)}
            />
          ))}
        </TableBody>
      </Table>
    )}
}

// clickCallback
// dh
// props.week.id
// props.week.teams
// props.week.teams.name
function LineupWeek(props) {
  return (
    <TableRow key={props.week.id}>
      <TableCell scope="row" className="lineupWeek">
        Week {props.week.id}
      </TableCell>
      {props.week.teams.slice(0, 4).map((team, idx) =>
        <TableCell align="center" key={'' + props.week.id + idx}
          className={team.selected ? "team selected" : "team"}
          onClick={props.clickCallback.bind(null, props.week.id, idx, team.name)}>
          {team.name}
        </TableCell>
      )}
      {props.dh && <React.Fragment>
        <TableCell> <DHSelector clickCallback={props.clickCallback} weekId={props.week.id} dhId={4} team={props.week.teams[4] || {}}/> </TableCell>
        <TableCell> <DHSelector clickCallback={props.clickCallback} weekId={props.week.id} dhId={5} team={props.week.teams[5] || {}}/> </TableCell>
      </React.Fragment>}
    </TableRow>
  );
}

function DHSelector(props) {
  return (
    <NativeSelect
      value={props.team.name || ""}
      onChange={e => props.clickCallback.bind(null, props.weekId, props.dhId)(e.target.value)}
      input={<Input/>}
    >
      <option value="">None</option>
      {FOOTBALL.ALL_TEAMS.map(team => <option value={team} key={team}>{team}</option>)}
    </NativeSelect>
  )
}

const LineupPage = compose(
  withRouter,
  withFirebase,
)(LineupPageBase);

export default LineupPage;

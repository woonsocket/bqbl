import React, { useState, useEffect } from 'react';

import './lineup.css'
import { withFirebase } from '../../Firebase';
import * as FOOTBALL from '../../../constants/football';
import * as SCHEDULE from '../../../constants/schedule';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';

LineupPageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

function LineupPageBase(props) {
  let [weeks, setWeeks] = useState({});
  let [dh, setDh] = useState(false);
  let [user, setUser] = useState(props.firebase.getCurrentUser());

  function authChanged(newUser) {
    setUser(newUser);
  }

  useEffect(() => {
    props.firebase.addAuthListener(authChanged)
  });

  useEffect(() => {
    if (!user) {return;}
    props.firebase.getStartsYear(user.uid, props.league, props.year, setWeeks)
    props.firebase.hasDh(props.league, props.year, setDh);
  }, [props.firebase, props.league, props.year, user]);

  // TODO: Decouple 
  function clickCallback(weekId, cell, val) {
    let row = weeks[weekId];
    // The DH continues to be my enemy.
    if (cell === 5 && row.teams.length === 4) {
      row.teams.push({ name: '', selected: false })
    }
    if (row.teams.length <= cell) {
      row.teams.push({ name: val, selected: false })
    }
    let selected = 0;
    for (let cell of row.teams) {
      if (cell.selected) {
        selected++;
      }
    }
    if (selected > 1 && !row.teams[cell].selected) {
      return;
    }
    row.teams[cell].selected = !row.teams[cell].selected;
    setWeeks(weeks);
    props.firebase.setStartsRow(user.uid, props.league, props.year, weekId, row);
  }


  return (
    <Table size="small">
      <TableBody>
        {Object.entries(weeks).map(([weekId, week], index) => (
          <LineupWeek clickCallback={clickCallback}
            week={week} index={index} dh={dh} key={index}
          />
        ))}
      </TableBody>
    </Table>
  )
}

LineupWeek.propTypes = {
  clickCallback: PropTypes.func.isRequired,
  dh: PropTypes.bool.isRequired,
  week: PropTypes.object.isRequired
}

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
          {team.name}<br/>
          {SCHEDULE.SCHEDULE_2019[team.name][props.week.id]}
        </TableCell>
      )}
      {props.dh && <React.Fragment>
        <TableCell> <DHSelector clickCallback={props.clickCallback} weekId={props.week.id} dhId={4} team={props.week.teams[4] || {}} /> </TableCell>
        <TableCell> <DHSelector clickCallback={props.clickCallback} weekId={props.week.id} dhId={5} team={props.week.teams[5] || {}} /> </TableCell>
      </React.Fragment>}
    </TableRow>
  );
}

function DHSelector({clickCallback, team, weekId, dhId}) {
  return (
    <NativeSelect
      value={team.name || ""}
      onChange={e => clickCallback.bind(null, weekId, dhId)(e.target.value)}
      input={<Input />}
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

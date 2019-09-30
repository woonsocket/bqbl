import React, { useEffect, useState } from 'react';

import * as FOOTBALL from '../../../constants/football';
import * as SCHEDULE from '../../../constants/schedule';

import { makeStyles } from '@material-ui/styles';
import { LeagueSpecDataProxy } from '../../../middle/response';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { withRouter } from 'react-router-dom';
import { Lock } from '@material-ui/icons';
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  team: {
    display: 'inline-block',
  },
  id: {
    display: 'inline-block',
    minWidth: '4em',
    fontWeight: 'bold',
  },
  lineupWeek: {maxWidth: '20px'},
  selected: {background: 'lightblue'},
  
})

LineupPageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

function LineupPageBase(props) {
  const classes = useStyles();

  let [weeks, setWeeks] = useState({});
  let [dh, setDh] = useState(false);
  let [user, setUser] = useState(props.firebase.getCurrentUser());
  // TODO(aerion): Update lockedWeeks if the lock time passes while the
  // component is visible.
  let [lockedWeeks, setLockedWeeks] = useState(new Set());

  function authChanged(newUser) {
    setUser(newUser);
  }

  useEffect(() => {
    return props.firebase.addAuthListener(authChanged);
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubStarts = props.firebase.getStartsYearThen(
        user.uid, props.league, props.year, setWeeks);
    const unsubLeagueSpec = props.firebase.getLeagueSpecThen(
        props.league, data => {
          let lsdp = new LeagueSpecDataProxy(data, props.year);
          setDh(lsdp.hasDh());
        });
    return () => {
      unsubStarts();
      unsubLeagueSpec();
    };
  }, [props.firebase, props.league, props.year, user]);

  useEffect(() => {
    return props.firebase.getLockedWeeksThen(Date.now(), setLockedWeeks);
  }, [props.firebase]);

  return (
    <Table size="small">
      <TableBody>
        {Object.values(weeks).map((week, index) => (
          <LineupWeek firebase={props.firebase} week={week}
              league={props.league} locked={lockedWeeks.has(week.id)}
              year={props.year} index={index} dh={dh} key={index} />
        ))}
      </TableBody>
    </Table>
  )
}

LineupWeek.propTypes = {
  firebase: PropTypes.object.isRequired,
  dh: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  week: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

function LineupWeek(props) {
  const classes = useStyles();

  let [week, setWeek] = useState(props.week);

  function countSelectedMinusCell(cellId) {
    let selected = 0;
    for (let cell of week.teams) {
      if (cell.selected) {
        selected++;
      }
    }
    if (cellId < week.teams.length && week.teams[cellId].selected) {
      selected--;
    }
    return selected;
  }

  // TODO: Decouple writes
  function clickCallback(cellId) {
    if (countSelectedMinusCell(cellId) >= 2) {
      console.log("selecting an overfull roster");
      return;
    }
    let newWeek = JSON.parse(JSON.stringify(week));
    newWeek.teams[cellId].selected = !week.teams[cellId].selected;
    props.firebase.updateStartsRow(props.league, props.year, week.id, newWeek).then(
      () => setWeek(newWeek)
    )
  }

  function selectCallback(cellId, val) {
    if (countSelectedMinusCell(cellId) >= 2) {
      console.log("selecting an overfull roster");
      return;
    }

    let newWeek = JSON.parse(JSON.stringify(week));
    while (newWeek.teams.length < cellId) {
      newWeek.teams.push({ name: '', selected: false });
    }
    newWeek.teams[cellId] = { name: val, selected: val !== "" };
    setWeek(newWeek);
    props.firebase.updateStartsRow(props.league, props.year, week.id, newWeek);
  }

  return (
    <TableRow key={week.id}>
      <TableCell scope="row" className={classes.lineupWeek}>
        {week.id}
        {props.locked && <Lock titleAccess="week is locked" fontSize="small" />}
      </TableCell>

      {week.teams.slice(0, 4).map((team, idx) =>
        <TableCell align="center" key={'' + week.id + idx}
          className={team.selected ? "team " + classes.selected : "team"}
          onClick={clickCallback.bind(null, idx)}>
          {team.name}<br />
          {SCHEDULE.SCHEDULE_2019[team.name][week.id]}
        </TableCell>
      )}
      {props.dh && <React.Fragment>
        <TableCell>
          <DHSelector
            selectCallback={selectCallback} weekId={props.week.id}
            dhId={4} team={week.teams[4] || {}}
            disabled={countSelectedMinusCell(4) >= 2} />
        </TableCell>
        <TableCell>
          <DHSelector selectCallback={selectCallback} weekId={props.week.id}
            dhId={5} team={week.teams[5] || {}}
            disabled={countSelectedMinusCell(5) >= 2} />
        </TableCell>
      </React.Fragment>}
    </TableRow>
  );
}

function DHSelector({ selectCallback, team, dhId, disabled }) {
  return (
    <NativeSelect
      value={team.name || ""}
      onChange={e => selectCallback.bind(null, dhId)(e.target.value)}
      input={<Input />}
      disabled={disabled}
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

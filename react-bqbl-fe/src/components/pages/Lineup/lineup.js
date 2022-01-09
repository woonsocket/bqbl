import Input from '@mui/material/Input';
import NativeSelect from '@mui/material/NativeSelect';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Lock } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import * as FOOTBALL from '../../../constants/football';
import * as SCHEDULE from '../../../constants/schedule';
import { LeagueSpecDataProxy } from '../../../middle/response';
import { FirebaseContext } from '../../Firebase';
import { useYear, useLeague, useUidOverride } from '../../AppState'
import RequireLeague from '../../reusable/RequireLeague';
import { useUser } from '../../Firebase/firebase';


const useStyles = makeStyles({
  team: {
    display: 'inline-block',
  },
  id: {
    display: 'inline-block',
    minWidth: '4em',
    fontWeight: 'bold',
  },
  lineupWeek: { maxWidth: '20px' },
  selected: { background: 'lightblue' },

})

function LineupPage() {
  return <RequireLeague><Lineup /></RequireLeague>
}

function Lineup(props) {
  const firebase = useContext(FirebaseContext);
  let [weeks, setWeeks] = useState({});
  let [dh, setDh] = useState(false);
  let user = useUser();
  // TODO(aerion): Update lockedWeeks if the lock time passes while the
  // component is visible.
  let [lockedWeeks, setLockedWeeks] = useState(new Set());

  let year = useYear();
  let league = useLeague();
  let uidOverride = useUidOverride();

  useEffect(() => {
    if (!user) {
      return;
    }
    let uid = uidOverride || user.uid;
    const [getStartsPromise, unsubStarts] = firebase.getStartsYear(uid, league, year);
    getStartsPromise.then(setWeeks);
    const [leagueSpecPromise, unsubLeagueSpec] = firebase.getLeagueSpec();
    leagueSpecPromise.then(
      league, data => {
        let lsdp = new LeagueSpecDataProxy(data, year);
        setDh(lsdp.hasDh());
      });
    return () => {
      unsubStarts();
      unsubLeagueSpec();
    };
  }, [firebase, league, year, user, uidOverride]);

  useEffect(() => {
    const [lockedWeeksPromise, unsubLockedWeeks] = firebase.getLockedWeeks(Date.now());
    lockedWeeksPromise.then(setLockedWeeks);
    return unsubLockedWeeks;
  }, [firebase]);

  return (
    <Table size="small">
      <TableBody>
        {Object.values(weeks).map((week, index) => (
          <LineupWeek week={week}
            league={league} locked={lockedWeeks.has(week.id)}
            year={year} index={index} dh={dh} key={index} />
        ))}
      </TableBody>
    </Table>
  )
}

LineupWeek.propTypes = {
  dh: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  week: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

function LineupWeek(props) {
  const firebase = useContext(FirebaseContext);
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
    firebase.updateStartsRow(props.league, props.year, week.id, newWeek).then(
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
    firebase.updateStartsRow(props.league, props.year, week.id, newWeek);
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
          {SCHEDULE.getOpponent(team.name, props.year, week.id)}
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

export default LineupPage;

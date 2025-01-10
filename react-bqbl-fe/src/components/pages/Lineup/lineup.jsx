import Input from '@mui/material/Input';
import NativeSelect from '@mui/material/NativeSelect';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Lock } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import * as FOOTBALL from '../../../constants/football';
import * as SCHEDULE from '../../../constants/schedule';
import { FirebaseContext } from '../../Firebase';
import {useYear, useLeague, useUidOverride} from '../../AppState'
import RequireLeague from '../../reusable/RequireLeague';
import { useUser } from '../../Firebase/firebase';
import { hasDh } from '../../../redux/util';
import { useSelector } from "react-redux";

import styles from './Lineup.module.css';

function LineupPage() {
  return <RequireLeague><Lineup/></RequireLeague>
}

function Lineup() {
  const firebase = useContext(FirebaseContext);
  // TODO(aerion): Update lockedWeeks if the lock time passes while the
  // component is visible.
  let [lockedWeeks, setLockedWeeks] = useState(new Set());
  const leagueSpec = useSelector((state) => state.league.spec);

  let year = useYear();
  let league = useLeague();
  let user = useUser();
  let uidOverride = useUidOverride();
  let dh = hasDh(leagueSpec, year);
  let uid = uidOverride || user && user.uid || null;
  let weeks = (uid && leagueSpec.plays && leagueSpec.plays[year][uid]) || [];
  useEffect(() => {
    return firebase.getLockedWeeksThen(year, Date.now(), setLockedWeeks);
  }, [firebase, year]);

  return (
    <Table size="small">
      <TableBody>
        {Object.values(weeks).map((week, index) => (
          <LineupWeek week={week} uid={uid}
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
  uid: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

function LineupWeek(props) {
  const firebase = useContext(FirebaseContext);

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
    firebase.updateStartsRow(props.league, props.year, week.id, props.uid, newWeek).then(
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
    firebase.updateStartsRow(props.league, props.year, week.id, props.uid, newWeek);
  }

  return (
    <TableRow key={week.id}>
      <TableCell scope="row" className={styles.lineupWeek}>
        {week.id}
        {props.locked && <Lock titleAccess="week is locked" fontSize="small" />}
      </TableCell>

      {week.teams.slice(0, 4).map((team, idx) =>
        <TableCell align="center" key={'' + week.id + idx}
          className={team.selected ? `${styles.team} ${styles.selected}` : styles.team}
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

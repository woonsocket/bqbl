import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useWeek, useYear } from '../../AppState';
import { FirebaseContext } from '../../Firebase';

import badBadge from './bad.png';

function BenchingPage(props) {
  let [events, setEvents] = useState({});
  let [passers, setPassers] = useState([]);
  let firebase = useContext(FirebaseContext)

  const scores = useSelector((state) => state.scores);

  let year = useYear();
  let week = useWeek();

  useEffect(() => {
    if (scores && scores[week]) {
      let allPassers = {};
      let scoresWeek = Object.entries(scores[week])
        .forEach(([teamName, score]) => {
          if (score.passers && Object.keys(score.passers).length >= 2) {
            allPassers[teamName] = score.passers;
          }
        });
      setPassers(allPassers);
    }
    return firebase.getEventsThen(year, week, newEvents => {
      setEvents(newEvents);
    });
  }, [firebase, year, week, scores]);

  const handleChange = (passerId, teamName) => event => {
    const passer = passers[teamName][passerId];
    let newOverrides = JSON.parse(JSON.stringify(events.overrides || {}));
    newOverrides[passer.team] = newOverrides[passer.team] || {};
    newOverrides[passer.team].benchings = newOverrides[passer.team].benchings || {};
    newOverrides[passer.team].benchings[passerId] = event.target.checked;
    firebase.updateEventsOverrides(year, week, newOverrides);
  };

  const isBenched = (passerId, teamId) => {
    if (!events.overrides || !events.overrides[teamId] || !events.overrides[teamId].benchings ) {
      return false;
    }
    let overrides = events.overrides[teamId];
    return overrides.benchings[passerId];
  }

  return (
    <Table>
      <TableBody>
        {Object.entries(passers).flatMap(
          ([teamId, teamPassers]) => (
            <React.Fragment key={teamId}>
              {Object.entries(teamPassers).map(
                ([passerId, passer]) => (
                  <TableRow key={passerId}>
                    <TableCell align="left">
                      <PasserDescription passer={passer} teamId={teamId} />
                    </TableCell>
                    <TableCell align="right">
                      <Checkbox
                        checked={isBenched(passerId, teamId)}
                        onChange={handleChange(passerId, teamId)}
                        value="test"
                        color="primary"
                        inputProps={{
                          'aria-label': 'secondary checkbox',
                        }} />
                    </TableCell>
                  </TableRow>
                )
              )}
            </React.Fragment>
          )
        )}
      </TableBody>
    </Table>
  );
}

PasserDescription.propTypes = {
  passer: PropTypes.object.isRequired,
  teamId: PropTypes.string.isRequired,
};

function PasserDescription(props) {
  const turnovers = props.passer.stats.int + props.passer.stats.fuml;
  return (
    // Halp, how do you CSS in React
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <div>
        {props.passer.name} ({props.teamId})<br />
        {props.passer.stats.cmp}/{props.passer.stats.att},&nbsp;
        {props.passer.stats.netyds} yd,&nbsp;
        {turnovers} turnover{turnovers != 1 ? 's' : ''}
      </div>
      {props.passer.isBad && <div style={{padding: '6px'}}>
        <img src={badBadge} height="24" alt="BAD" />
      </div>}
    </div>
  );
}

export default BenchingPage;

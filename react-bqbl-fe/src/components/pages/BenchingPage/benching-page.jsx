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

import PasserStats from "../../reusable/PasserStats/passer-stats";

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
    newOverrides[teamName] = newOverrides[teamName] || {};
    newOverrides[teamName].benchings = newOverrides[teamName].benchings || {};
    newOverrides[teamName].benchings[passerId] = event.target.checked;
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
                      <PasserStats passer={passer} teamId={teamId} />
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

export default BenchingPage;

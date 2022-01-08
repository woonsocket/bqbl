import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React, { useContext, useEffect, useState } from 'react';
import { useWeek, useYear } from '../../AppState';
import { FirebaseContext } from '../../Firebase';

function BenchingPage() {
  let [events, setEvents] = useState({ passers: {} });
  let firebase = useContext(FirebaseContext)
  let year = useYear();
  let week = useWeek();

  useEffect(() => {
    let [eventsPromise, unsubEvents] =  firebase.getEvents(year, week)
    eventsPromise.then(newEvents => {
      setEvents(newEvents);
    });
    return unsubEvents;
  }, [firebase, year, week]);

  const handleChange = passerId => event => {
    const passer = events.passers[passerId];
    let newOverrides = JSON.parse(JSON.stringify(events.overrides || {}));
    newOverrides[passer.team] = newOverrides[passer.team] || {};
    newOverrides[passer.team].benchings = newOverrides[passer.team].benchings || {};
    newOverrides[passer.team].benchings[passerId] = event.target.checked;
    firebase.updateEventsOverrides(year, week, newOverrides);
  };

  const getBenched = passerId => {
    const passer = events.passers[passerId];
    if (!passer || !events.overrides || !events.overrides[passer.team] || !events.overrides[passer.team].benchings ) {
      return false;
    }
    let overrides = events.overrides[passer.team];
    return overrides.benchings[passerId];
  }

  return (
    <Table>
      <TableBody>
        {Object.keys(events.passers).map((key) =>
          <TableRow key={key}>
            <TableCell align="left" >{events.passers[key].name}</TableCell>
            <TableCell align="right">
              <Checkbox
                checked={getBenched(key)}
                onChange={handleChange(key)}
                value="test"
                color="primary"
                inputProps={{
                  'aria-label': 'secondary checkbox',
                }} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default BenchingPage;

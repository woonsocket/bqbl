import React, { useEffect, useState } from 'react';

import { withFirebase } from '../../Firebase';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

function BenchingPageBase(props) {
  let [events, setEvents] = useState({ passers: {} });

  useEffect(() => {
    props.firebase.getEventsThen(props.year, props.week, newEvents => {
      setEvents(newEvents);
    })
  }, [props.firebase, props.year, props.week]);

  const handleChange = passerId => event => {
    const passer = events.passers[passerId];
    let newOverrides = JSON.parse(JSON.stringify(events.overrides));
    newOverrides[passer.team] = newOverrides[passer.team] || {};
    newOverrides[passer.team].benchings = newOverrides[passer.team].benchings || {};
    newOverrides[passer.team].benchings[passerId] = event.target.checked;
    props.firebase.updateEventsOverrides(props.year, props.week, newOverrides);
  };

  const getBenched = passerId => {
    try {
      const passer = events.passers[passerId];
      return events.overrides[passer.team].benchings[passerId];
    } catch (err) {
      console.log(err)
      return false;
    }
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

const BenchingPage = compose(
  withRouter,
  withFirebase,
)(BenchingPageBase);

export default BenchingPage;

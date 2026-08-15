import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import React, { useContext, useMemo, useState } from 'react';
import { computeWeekLockTimestamps } from '../../../constants/lockdates';
import { useYear } from '../../AppState/app-state';
import { FirebaseContext } from '../../Firebase';

function UpdateLockDatesPage() {
  const firebase = useContext(FirebaseContext);
  const year = useYear();
  const [week1Sunday, setWeek1Sunday] = useState('');
  const [savedAt, setSavedAt] = useState(null);

  const timestamps = useMemo(
    () => (week1Sunday ? computeWeekLockTimestamps(week1Sunday) : null),
    [week1Sunday]
  );

  const handleWeek1SundayChange = event => {
    setWeek1Sunday(event.target.value);
    setSavedAt(null);
  };

  const handleUpdate = () => {
    firebase.updateUnlockedWeeks(year, timestamps);
    setSavedAt(Date.now());
  };

  return (
    <Paper elevation={3}>
      <h2>Update Lock Dates ({year})</h2>
      <p>
        Pick Week 1&apos;s Sunday. Every week&apos;s lineups will lock at
        12:55pm Eastern -- five minutes before the 1:00pm kickoff window.
      </p>
      <TextField
        id="week1-sunday"
        label="Week 1 Sunday"
        type="date"
        value={week1Sunday}
        onChange={handleWeek1SundayChange}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <br /><br />
      <Button
        variant="contained"
        color="primary"
        disabled={!timestamps}
        onClick={handleUpdate}
      >
        Update
      </Button>
      {savedAt && <p>Saved lock dates at {new Date(savedAt).toLocaleString()}.</p>}

      {timestamps && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Week</TableCell>
              <TableCell>Locks at (local time)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(timestamps).map(([week, ms]) => (
              <TableRow key={week}>
                <TableCell scope="row">{week}</TableCell>
                <TableCell>{new Date(ms).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default UpdateLockDatesPage;

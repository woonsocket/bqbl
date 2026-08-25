import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import React, { useContext, useEffect, useState } from 'react';
import * as FOOTBALL from '../../../constants/football';
import { FirebaseContext } from '../../Firebase';

function CreateNewYearPage() {
  const firebase = useContext(FirebaseContext);
  const leagues = firebase.getAllLeagues();
  const [league, setLeague] = useState(leagues[0]);
  const [year, setYear] = useState(FOOTBALL.CURRENT_YEAR);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setDraft(null);
    return firebase.getDraftThen(league, year, setDraft);
  }, [firebase, league, year]);

  const draftIsFull = !!draft && draft.every(slot => slot.team);

  async function runAction(confirmMessage, message, action) {
    if (!window.confirm(confirmMessage)) {
      return;
    }
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      await action();
      setMessage(message);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  const handleStart = () => runAction(
    `Start ${year} for ${league}? This copies ${Number(year) - 1}'s roster ` +
    `forward and creates a fresh, empty draft board -- overwriting any ` +
    `${league}/${year} draft that already exists.`,
    `Started ${year} for ${league}: roster copied forward and draft board created.`,
    () => firebase.startNewYear(league, year)
  );

  const handleRandomize = () => runAction(
    `Randomize the ${year} draft for ${league}? This assigns all 32 teams ` +
    `in random order, overwriting any team picks already in the draft board.`,
    `Randomized the ${year} draft for ${league}.`,
    () => firebase.randomizeDraft(league, year, FOOTBALL.ALL_TEAMS)
  );

  const handleFinalize = () => runAction(
    `Finalize the ${year} draft for ${league}? This locks in each player's ` +
    `drafted teams and builds their weekly starts board for the season.`,
    `Finalized the ${year} draft for ${league} and built the starts board.`,
    async () => {
      await firebase.finalizeDraft(league, year);
      await firebase.createNewYear(league, year);
    }
  );

  return (
    <Paper elevation={3}>
      <h2>Create a New Year</h2>

      <div>
        League:{' '}
        <Select value={league} onChange={e => setLeague(e.target.value)}>
          {leagues.map(id => (
            <MenuItem value={id} key={id}>{id}</MenuItem>
          ))}
        </Select>
      </div>
      <br />
      <TextField
        id="year"
        label="Year"
        value={year}
        onChange={e => setYear(e.target.value)}
      />

      <br /><br />

      <Button variant="contained" color="primary" disabled={busy} onClick={handleStart}>
        Start
      </Button>{' '}
      <Button
        variant="contained"
        color="primary"
        disabled={busy || !draft}
        onClick={handleRandomize}
      >
        Randomize Draft
      </Button>{' '}
      <Button
        variant="contained"
        color="primary"
        disabled={busy || !draftIsFull}
        onClick={handleFinalize}
      >
        Finalize Draft
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p>{message}</p>}

      {draft && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Team</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {draft.map((slot, index) => (
              <TableRow key={index}>
                <TableCell scope="row">{slot.name}</TableCell>
                <TableCell>{slot.team || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default CreateNewYearPage;

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useContext, useEffect, useState } from 'react';
import * as FOOTBALL from '../../../constants/football';
import { useLeague, useYear, useUidOverride } from '../../AppState/app-state';
import { FirebaseContext } from '../../Firebase';
import { useUser } from '../../Firebase/firebase';
import RequireLeague from '../../reusable/RequireLeague';

function DraftPage() {
  return (
    <RequireLeague>
      <Draft />
    </RequireLeague>
  );
}

function Draft() {
  const firebase = useContext(FirebaseContext);
  const league = useLeague();
  const year = useYear();
  const user = useUser();
  const uidOverride = useUidOverride();
  const uid = uidOverride || (user && user.uid) || null;
  const [draft, setDraft] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDraft(null);
    return firebase.getDraftThen(league, year, setDraft);
  }, [firebase, league, year]);

  if (!draft) {
    return <p>No draft has been started for {league} in {year} yet.</p>;
  }

  const currentIndex = draft.findIndex(slot => !slot.team);
  const currentSlot = currentIndex === -1 ? null : draft[currentIndex];
  const isMyTurn = !!(currentSlot && uid && currentSlot.uid === uid);
  const draftedTeams = new Set(draft.map(slot => slot.team).filter(Boolean));
  const availableTeams = FOOTBALL.ALL_TEAMS.filter(team => !draftedTeams.has(team));

  const handleConfirm = async () => {
    if (!selectedTeam) {
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await firebase.draftTeam(league, year, selectedTeam, uidOverride);
      setSelectedTeam('');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {currentSlot ? (
        isMyTurn ? (
          <div>
            <h3>It&apos;s your turn! Pick a team:</h3>
            <Select
              value={selectedTeam}
              displayEmpty
              onChange={e => setSelectedTeam(e.target.value)}
            >
              <MenuItem value="">Select a team</MenuItem>
              {availableTeams.map(team => (
                <MenuItem value={team} key={team}>{team}</MenuItem>
              ))}
            </Select>{' '}
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedTeam || busy}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        ) : (
          <h3>Waiting for {currentSlot.name} to pick...</h3>
        )
      ) : (
        <h3>Draft complete!</h3>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Pick</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {draft.map((slot, index) => (
            <TableRow key={index} selected={index === currentIndex}>
              <TableCell scope="row">{index + 1}</TableCell>
              <TableCell>{slot.name}</TableCell>
              <TableCell>{slot.team || ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DraftPage;

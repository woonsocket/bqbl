import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import React, { useContext, useState } from 'react';
import { useWeek, useYear } from '../../AppState/app-state';
import { FirebaseContext } from '../../Firebase';

function SafetyPage(props) {
  let firebase = useContext(FirebaseContext)
  let year = useYear();
  let week = useWeek();

  // This should be useReducer
  let [team, setTeam] = useState("");
  let [qb, setQb] = useState("");

  const handleSubmit = event => {
    firebase.addSafety(year, week, { team, qb });
  };

  return (
    <Paper elevation={3}>
      <TextField id="team" value={team} label="Team" onChange={e => setTeam(e.target.value)} /><br />
      <TextField id="qb" value={qb} label="QB" onChange={e => setQb(e.target.value)} /><br />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Save
      </Button>
    </Paper>
  );
}

export default SafetyPage;

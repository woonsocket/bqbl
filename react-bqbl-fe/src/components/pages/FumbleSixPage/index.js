import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useState } from 'react';
import { useWeek, useYear } from '../../AppState';
import { FirebaseContext } from '../../Firebase';

function FumbleSixPage(props) {
  let firebase = useContext(FirebaseContext)
  let year = useYear();
  let week = useWeek();

  // This should be useReducer
  let [team, setTeam] = useState("");
  let [qb, setQb] = useState("");
  
  const handleSubmit = event => {
    let td = true;
    firebase.addFumbleSix(year, week, {team, qb, td});
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

export default FumbleSixPage;

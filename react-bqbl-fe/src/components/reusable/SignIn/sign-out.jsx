import React, { useContext } from 'react';
import { FirebaseContext } from '../../Firebase';
import Button from '@mui/material/Button';

const SignOut = (props) => {
  const firebase = useContext(FirebaseContext);
  const onSubmit = (event) => {
    firebase.doSignOut();
    event.preventDefault();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Sign Out
      </Button>
    </div>
  );
};

export default SignOut;

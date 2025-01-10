import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import Button from '@mui/material/Button';
import { FirebaseContext } from '../../Firebase';

function SignIn(props) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const firebase = useContext(FirebaseContext);

  const onSubmit = event => {
    firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        setError(null);
        navigate({ pathname: ROUTES.HOME, search: window.location.search });
      })
      .catch(error => {
        setError(error);
      });

    event.preventDefault();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Sign In
      </Button>
      {error && <p>{error.message}</p>}
    </div>
  );
}

export default SignIn;
import React, { Component } from 'react';

import * as ROUTES from '../../../constants/routes';
import { withFirebase } from '../../Firebase';

import { compose } from 'react-recompose';
import { withRouter } from 'react-router-dom';
import Button from '@mui/material/Button';

class SignInBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      vals: [],
    };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        this.setState({ error: null });
        this.props.history.push({pathname: ROUTES.HOME, search: window.location.search});
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };


  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.onSubmit}>
          Sign In
          </Button>
      </div>
    );
  }
}

const SignIn = compose(
  withRouter,
  withFirebase,
)(SignInBase);

export default SignIn;

import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null, name: "foo" };
  }

  render() {
    return (
      <div>
        <SignInGoogle />
      </div>
    );
  }
};


class SignInGoogleBase extends Component {
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
        this.props.history.push(ROUTES.HOME);
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

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

export default SignIn;

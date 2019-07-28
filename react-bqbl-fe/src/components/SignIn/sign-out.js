import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';

class SignOut extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, name: "foo" };
  }
  render() {

    return (

      <div>
        <SignOutGoogle />
      </div>
    );
  }
};


class SignOutGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      vals: [],
    };
  }

  onSubmit = event => {
    this.props.firebase.doSignOut();
    event.preventDefault();
  };


  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.onSubmit}>
          Sign Out
          </Button>
      </div>
    );
  }
}

const SignOutGoogle = compose(
  withRouter,
  withFirebase,
)(SignOutGoogleBase);

export default SignOut;

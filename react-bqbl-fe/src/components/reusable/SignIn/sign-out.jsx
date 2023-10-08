import React, { Component } from 'react';

import { withFirebase } from '../../Firebase';

import { compose } from 'react-recompose';
import Button from '@mui/material/Button';

class SignOutBase extends Component {
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

const SignOut = compose(
  withFirebase,
)(SignOutBase);

export default SignOut;

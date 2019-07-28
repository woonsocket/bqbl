import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import SignIn from './sign-in';
import SignOut from './sign-out';

import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

class SignInToggleBase extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    firebase: PropTypes.object.isRequired,
  };

  render() {
    return (
      this.props.firebase.getCurrentUser() ? <SignOut/> : <SignIn/>
    );
  }
}

const SignInToggle = compose(
  withRouter,
  withFirebase,
)(SignInToggleBase);

export default SignInToggle;

import React from 'react';
import { useUser } from '../../Firebase/firebase';

import SignIn from './sign-in';
import SignOut from './sign-out';

function SignInToggle() {
  let user = useUser();

  return user ? <SignOut/> : <SignIn/>;
}

export default SignInToggle;

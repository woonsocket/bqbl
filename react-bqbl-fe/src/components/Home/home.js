import React from 'react';

import "./home.css"
import SignInToggle from '../SignIn/sign-in-toggle';
const Home = () => (
  <div className="splash">
    <div>
      The Fantasy Football League for Mean People
    </div>
    <div>
      <SignInToggle />
    </div>
  </div>
);

export default Home;
import React from 'react';
import SignIn from '../SignIn/sign-in';
import "./home.css"
const Home = () => (
  <div className="splash">
    <div>
      The Fantasy Football League for Mean People
    </div>
    <div>
      <SignIn />
    </div>
  </div>
);

export default Home;
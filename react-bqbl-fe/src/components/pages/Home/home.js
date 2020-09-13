import { FirebaseContext } from '../../Firebase';
import Navigation from '../../reusable/Navigation/navigation'
import PropTypes from 'prop-types';
import React, { useEffect, useContext, useState } from 'react';
import SignIn from '../../reusable/SignIn/sign-in'
import RequireLeague from '../../reusable/RequireLeague';

Home.propTypes = {
  league: PropTypes.string,
  year: PropTypes.string,
  week: PropTypes.string,
  leagues: PropTypes.array,
}

function Home(props) {
  const firebase = useContext(FirebaseContext);
  let [user, setUser] = useState(firebase.getCurrentUser());

  function authChanged(newUser) {
    setUser(newUser);
  }

  useEffect(() => {
    return firebase.addAuthListener(authChanged);
  });

  if (user) {
    return <RequireLeague> <Navigation /> </RequireLeague>;
  }
  return <SignIn />;
}

export default Home;

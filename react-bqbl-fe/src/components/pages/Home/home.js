import Navigation from '../../reusable/Navigation/navigation'
import PropTypes from 'prop-types';
import React from 'react';
import SignIn from '../../reusable/SignIn/sign-in'
import RequireLeague from '../../reusable/RequireLeague';
import { useUser } from '../../Firebase/firebase';

Home.propTypes = {
  league: PropTypes.string,
  year: PropTypes.string,
  week: PropTypes.string,
  leagues: PropTypes.array,
}

function Home(props) {
  let user = useUser();

  if (user) {
    return <RequireLeague> <Navigation /> </RequireLeague>;
  }
  return <SignIn />;
}

export default Home;

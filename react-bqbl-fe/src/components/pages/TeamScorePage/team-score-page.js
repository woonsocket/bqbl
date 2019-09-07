import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';

import { withFirebase } from '../../Firebase';
import TeamScoreCard from '../../reusable/TeamScoreCard/team-score-card';

function TeamScorePageBase(props) {
  let [valsList, setValsList] = useState([])

  useEffect(() => {
    props.firebase.scoresWeekPromise(props.year, props.week).then(
      scoresWeek => setValsList(scoresWeek));
  }, [props.firebase, props.league, props.year, props.week]);

  return (
    <React.Fragment>
      {valsList.map(score => (
        <TeamScoreCard score={score} key={score.teamName} />
      ))}
    </React.Fragment>
  );
}

const TeamScorePage = compose(
  withRouter,
  withFirebase,
)(TeamScorePageBase);

export default TeamScorePage;

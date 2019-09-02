import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';

import { withFirebase } from '../../Firebase';
import TeamScoreCard from '../../reusable/TeamScoreCard/team-score-card';

function TeamScorePageBase2(props) {
  let [valsList, setValsList] = useState([])

  useEffect(() => {
    props.firebase.scores_week(props.year, props.week).on('value', snapshot => {
      const vals = snapshot.val();
      const valsList = Object.keys(vals).map(key => ({
        ...vals[key],
        teamName: key,
      }));
      setValsList(valsList);
    })
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
)(TeamScorePageBase2);

export default TeamScorePage;

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import React, { useState, useEffect } from 'react';

import { withFirebase } from '../../Firebase';
import TeamScoreCard from '../../reusable/TeamScoreCard/team-score-card';

function TeamScorePageBase(props) {
  let [valsList, setValsList] = useState([])
  const sortScores = true;

  useEffect(() => {
    props.firebase.scoresWeekPromise(props.year, props.week).then(
      scoresWeek => {
        if (sortScores) {
          scoresWeek = scoresWeek.sort((team, team2) => team2.total - team.total);
        }
        setValsList(scoresWeek)
      });
  }, [props.firebase, props.league, props.year, props.week]);

  return (
    <div style={{textAlign: 'center'}}>
      {valsList.map(score => (
        <TeamScoreCard score={score} key={score.teamName} />
      ))}
    </div>
  );
}

const TeamScorePage = compose(
  withRouter,
  withFirebase,
)(TeamScorePageBase);

export default TeamScorePage;

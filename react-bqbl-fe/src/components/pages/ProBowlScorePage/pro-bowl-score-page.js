import React, { useEffect, useState } from 'react';

import { withFirebase } from '../../Firebase';
import PlayerScoreList from '../../reusable/PlayerScoreList/player-score-list';
import { joinProBowlScores } from '../../../middle/response';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const PRO_BOWL_WEEK = '17';

ProBowlScoresPageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
};

function ProBowlScoresPageBase(props) {
  let [playerScores, setPlayerScores] = useState([]);

  useEffect(() => {
    const cleanupFuncs = [];
    const scoresPromise = new Promise((resolve) => {
      cleanupFuncs.push(
          props.firebase.getScoresYearThen(props.year, (scores) => {
            resolve(scores.dbScores);
          }));
    });
    const startsPromise = new Promise((resolve) => {
      cleanupFuncs.push(
          props.firebase.getProBowlStartsForLeague(
              props.league, props.year, resolve));
    });
    Promise.all([scoresPromise, startsPromise]).then(
        ([scores, starts]) => {
          setPlayerScores(joinProBowlScores(scores, starts, PRO_BOWL_WEEK));
        });
    return () => {
      for (const f of cleanupFuncs) {
        f();
      }
    };
  }, [props.firebase, props.league, props.year]);

  // TODO(aerion): Factor out a component for a league's score card so that
  // it's easy to show multiple league scores at once.
  return <React.Fragment>
    {playerScores.map(({name, id, teams}) => (
      <PlayerScoreList key={id} label={name} entries={teams} />
    ))}
  </React.Fragment>
}

const ProBowlScoresPage = compose(
  withRouter,
  withFirebase,
)(ProBowlScoresPageBase);

export default ProBowlScoresPage;

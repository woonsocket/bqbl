import React, { useEffect, useState } from 'react';

import { compose } from 'recompose';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import indigo from '@material-ui/core/colors/indigo';

import { withFirebase } from '../../Firebase';
import PlayerScoreList from '../../reusable/PlayerScoreList/player-score-list';
import { joinProBowlScores } from '../../../middle/response';

const PRO_BOWL_WEEK = '17';
// The league score is the sum of the top 3 player scores.
const LEAGUE_SCORE_PLAYER_COUNT = 3;

ProBowlScoresPageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  player: {
    margin: 0,
    padding: '4px',
  },
  inTheMoney: {
    // This should probably reference some sort of app-wide Material UI theme.
    background: indigo[100],
  },
});

function ProBowlScoresPageBase(props) {
  const classes = useStyles();
  const cx = classNames.bind(classes);

  let [leagueScore, setLeagueScore] = useState(0);
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
          const playerScores = joinProBowlScores(scores, starts, PRO_BOWL_WEEK);
          playerScores.sort((a, b) => b.totalScore - a.totalScore);
          setPlayerScores(playerScores);
          let leagueScore = 0;
          for (const p of playerScores.slice(0, LEAGUE_SCORE_PLAYER_COUNT)) {
            leagueScore += p.totalScore;
          }
          setLeagueScore(leagueScore);
        });
    return () => {
      for (const f of cleanupFuncs) {
        f();
      }
    };
  }, [props.firebase, props.league, props.year]);

  function playerClass(index) {
    const c = {};
    c[classes.player] = true;
    c[classes.inTheMoney] = index < LEAGUE_SCORE_PLAYER_COUNT;
    return cx(c);
  }

  // TODO(aerion): Factor out a component for a league's score card so that
  // it's easy to show multiple league scores at once.
  return <React.Fragment>
    <Card>
      <CardHeader
        title={props.league}
        subheader={`Total: ${leagueScore}`}
      />
      <CardContent>
        {playerScores.map(({name, id, teams, totalScore}, index) => (
          <div key={id} className={playerClass(index)}>
            <PlayerScoreList label={name} entries={teams} total={totalScore} />
          </div>
        ))}
      </CardContent>
    </Card>
  </React.Fragment>
}

const ProBowlScoresPage = compose(
  withRouter,
  withFirebase,
)(ProBowlScoresPageBase);

export default ProBowlScoresPage;

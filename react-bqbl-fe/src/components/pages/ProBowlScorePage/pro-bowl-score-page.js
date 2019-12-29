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
// TODO(aerion): This is hard-coded to the two existing leagues. That's good
// enough for now. Seems silly to generalize to reading every league from the
// database at this moment.
const ALL_LEAGUES = ['abqbl', 'nbqbl'];

ProBowlScoresPageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
};

const pageStyles = makeStyles({
  leagueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  leagueCard: {
    margin: '12px',
    maxWidth: '350px',
  },
});

function ProBowlScoresPageBase(props) {
  const classes = pageStyles();

  const [nflScores, setNflScores] = useState({});

  useEffect(() => {
    return props.firebase.getScoresYearThen(props.year, (scores) => {
      setNflScores(scores.dbScores);
    });
  }, [props.firebase, props.year]);

  const leagues = ALL_LEAGUES.slice();
  // Place the viewing player's league first.
  leagues.sort((a, b) => {
    if (a === props.league) {
      return -1;
    } else if (b === props.league) {
      return 1;
    }
    return a.localeCompare(b);
  });

  return (
    <div className={classes.leagueContainer}>
      {leagues.map((league) => (
        <div key={league} className={classes.leagueCard}>
          <ProBowlScoresCard league={league} nflScores={nflScores}
              firebase={props.firebase} year={props.year} />
        </div>
      ))}
    </div>
  );
}

ProBowlScoresCard.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  // BQBL scores for NFL teams for the given year.
  nflScores: PropTypes.object.isRequired,
  year: PropTypes.string.isRequired,
};

const cardStyles = makeStyles({
  player: {
    margin: 0,
    padding: '4px',
  },
  inTheMoney: {
    // This should probably reference some sort of app-wide Material UI theme.
    background: indigo[100],
  },
});

function ProBowlScoresCard(props) {
  const classes = cardStyles();
  const cx = classNames.bind(classes);

  let [leagueScore, setLeagueScore] = useState(0);
  let [playerScores, setPlayerScores] = useState([]);

  useEffect(() => {
    return props.firebase.getProBowlStartsForLeague(
        props.league,
        props.year,
        (starts) => {
          const playerScores =
              joinProBowlScores(props.nflScores, starts, PRO_BOWL_WEEK);
          playerScores.sort((a, b) => b.totalScore - a.totalScore);
          setPlayerScores(playerScores);
          let leagueScore = 0;
          for (const p of playerScores.slice(0, LEAGUE_SCORE_PLAYER_COUNT)) {
            leagueScore += p.totalScore;
          }
          setLeagueScore(leagueScore);
        });
  }, [props.firebase, props.league, props.nflScores, props.year]);

  function playerClass(index) {
    const c = {};
    c[classes.player] = true;
    c[classes.inTheMoney] = index < LEAGUE_SCORE_PLAYER_COUNT;
    return cx(c);
  }

  return (
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
  );
}

const ProBowlScoresPage = compose(
  withRouter,
  withFirebase,
)(ProBowlScoresPageBase);

export default ProBowlScoresPage;

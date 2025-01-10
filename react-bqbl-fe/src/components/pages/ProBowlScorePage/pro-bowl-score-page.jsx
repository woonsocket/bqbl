import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { joinProBowlScores } from '../../../middle/response';
import { useLeague, useWeek, useYear } from '../../AppState/app-state';
import { FirebaseContext } from '../../Firebase';
import PlayerScoreList from '../../reusable/PlayerScoreList/player-score-list';
import styles from './ProBowlScorePage.module.css'
import { useSelector } from 'react-redux';

// The league score is the sum of the top 3 player scores.
const LEAGUE_SCORE_PLAYER_COUNT = 3;
// TODO(aerion): This is hard-coded to the two existing leagues. That's good
// enough for now. Seems silly to generalize to reading every league from the
// database at this moment.
const ALL_LEAGUES = ['abqbl', 'nbqbl'];


function ProBowlScoresPage() {
  let league = useLeague();
  let year = useYear();
  let firebase = useContext(FirebaseContext);
  const nflScores = useSelector((state) => state.scores);

  const leagues = ALL_LEAGUES.slice();
  // Place the viewing player's league first.
  leagues.sort((a, b) => {
    if (a === league) {
      return -1;
    } else if (b === league) {
      return 1;
    }
    return a.localeCompare(b);
  });

  return (
    <div className={styles.leagueContainer}>
      {leagues.map((league) => (
        <div key={league} className={styles.leagueCard}>
          <ProBowlScoresCard league={league} nflScores={nflScores}
            firebase={firebase} year={year} />
        </div>
      ))}
    </div>
  );
}

ProBowlScoresCard.propTypes = {
  league: PropTypes.string.isRequired,
  // BQBL scores for NFL teams for the given year.
  nflScores: PropTypes.object.isRequired,
  year: PropTypes.string.isRequired,
};

function ProBowlScoresCard(props) {
  let [leagueScore, setLeagueScore] = useState(0);
  let [playerScores, setPlayerScores] = useState([]);
  let year = useYear();
  let week = useWeek();
  let firebase = useContext(FirebaseContext);
  // console.log(props.nflScores);
  useEffect(() => {
    // console.log(props.nflScores);
    firebase.getProBowlStartsForLeagueThen(
      props.league, year, (starts) => {
      const playerScores =
        joinProBowlScores(props.nflScores, starts, week);
      playerScores.sort((a, b) => b.totalScore - a.totalScore);
      setPlayerScores(playerScores);
      let leagueScore = 0;
      for (const p of playerScores.slice(0, LEAGUE_SCORE_PLAYER_COUNT)) {
        leagueScore += p.totalScore;
      }
      setLeagueScore(leagueScore);
    });
  }, [firebase, props.league, props.nflScores, year]);

  function playerClass(index) {

    let s = styles.player;
    if (index < LEAGUE_SCORE_PLAYER_COUNT) {
      s +=  " " + styles.inTheMoney;
    }
    return s;
  }

  return (
    <Card>
      <CardHeader
        title={props.league}
        subheader={`Total: ${leagueScore}`}
      />
      <CardContent>
        {playerScores.map(({ name, id, teams, totalScore }, index) => (
          <div key={props.league+id} className={playerClass(index)}>
            <PlayerScoreList label={name} entries={teams} total={totalScore} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default ProBowlScoresPage;

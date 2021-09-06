import Switch from '@material-ui/core/Switch';
import React, { useContext, useEffect, useState } from 'react';
import { useWeek, useYear } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import TeamScoreCard from '../../reusable/TeamScoreCard/team-score-card';

function TeamScorePage(props) {
  const firebase = useContext(FirebaseContext);

  let [isLoaded, setIsLoaded] = useState(false);
  let [scoresList, setScoresList] = useState([]);
  let [sortScores, setSortScores] = useState(true);
  let [useProjections, setUseProjections] = useState(true);

  let year = useYear();
  let week = useWeek();

  function sortClickedCallback() {
    setSortScores(!sortScores);
  }

  function setUseProjectionsCallback() {
    setUseProjections(!useProjections);
  }

  useEffect(() => {
    return firebase.getScoresWeekThen(year, week,
      scoresWeek => {
        if (sortScores) {
          if (useProjections) {
            scoresWeek = scoresWeek.sort((team, team2) => team2.projection.total - team.projection.total);
          } else {
            scoresWeek = scoresWeek.sort((team, team2) => team2.total - team.total);
          }
        }
        setScoresList(scoresWeek);
        setIsLoaded(true);
      });
  }, [firebase, year, week, sortScores, useProjections]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        Sort Scores
        <Switch
          checked={sortScores}
          onChange={sortClickedCallback}
          value="sort"
          color="primary"
        />
        Use Projections
        <Switch
          checked={useProjections}
          onChange={setUseProjectionsCallback}
          value="sort"
          color="primary"
          disabled={!sortScores}
        />

      </div>
      {scoresList.map(score => (
        <TeamScoreCard score={score} key={score.teamName} boxScoreLink={boxScoreLink(year, props.week, score.gameInfo.id)} />
      ))}
      {isLoaded && !scoresList.length &&
        <div>No scores found for week {props.week}</div>
      }
    </div>
  );
}

function boxScoreLink(year, week, gameId) {
  if (!gameId) {
    // TODO: Fix this. ANNUAL
    return `https://www.espn.com/nfl/scoreboard/_/${year}/2020/seasontype/2/week/${week}`;
  }
  return `https://www.espn.com/nfl/game/_/gameId/${gameId}`;
}

export default TeamScorePage;

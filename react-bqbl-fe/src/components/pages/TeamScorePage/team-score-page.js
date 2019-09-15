import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

import React, { useEffect, useState } from 'react';

import { withFirebase } from '../../Firebase';
import TeamScoreCard from '../../reusable/TeamScoreCard/team-score-card';

TeamScorePageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  week: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

function TeamScorePageBase(props) {
  let [valsList, setValsList] = useState([]);
  let [sortScores, setSortScores] = useState(true);
  let [useProjections, setUseProjections] = useState(true);

  function sortClickedCallback() {
    setSortScores(!sortScores);
  }

  function setUseProjectionsCallback() {
    setUseProjections(!useProjections);
  }

  useEffect(() => {
    props.firebase.scoresWeekThen(props.year, props.week,
      scoresWeek => {
        if (sortScores) {
          if (useProjections) {
            scoresWeek = scoresWeek.sort((team, team2) => team2.projection.total - team.projection.total);
          } else {
            scoresWeek = scoresWeek.sort((team, team2) => team2.total - team.total);
          }
        }
        setValsList(scoresWeek)
      })
  }, [props.firebase, props.league, props.year, props.week, sortScores, useProjections]);

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
      {valsList.map(score => (
        <TeamScoreCard score={score} key={score.teamName} boxScoreLink={boxScoreLink(props.year, props.week, score.gameInfo.id)} />
      ))}{console.log(valsList[0] && valsList[0].gameInfo.id)}
    </div>
  );
}

function boxScoreLink(year, week, gameId) {
  if (!gameId) {
    return 'http://www.nfl.com';
  }
  const nflWeek = `REG${week}`;
  // Actually, this component of the path doesn't seem to matter at all, as
  // long as it's non-empty. NFL.com puts the team nicknames in there
  // ('patriots@falcons'), but it appears to be purely for URL aesthetics.
  const atCode = 'score';
  return 'http://www.nfl.com/gamecenter/' +
      `${gameId}/${year}/${nflWeek}/${atCode}` +
      '#tab=analyze&analyze=boxscore';
}

const TeamScorePage = compose(
  withRouter,
  withFirebase,
)(TeamScorePageBase);

export default TeamScorePage;

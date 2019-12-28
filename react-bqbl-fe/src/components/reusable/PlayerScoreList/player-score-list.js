import React from 'react';

import './player-score-list.css';
import IconScoreCell from '../IconScoreCell/icon-score-cell';
import PropTypes from 'prop-types';

PlayerScoreList.propTypes = {
  label: PropTypes.string.isRequired,
  // An array of {team: string, score: number} objects.
  entries: PropTypes.arrayOf(PropTypes.object),
};

// A PlayerScoreList is a component representing a collection of scores for a
// player. The player chose to play some teams. Each team has a score, and the
// player's total score is the sum of those teams' scores.
function PlayerScoreList(props) {
  return (
    <div className="score-row">
      <div className="label-cell">{props.label}</div>
      <div className="score-cells">
        {props.entries.map((entry, index) => (
          <div key={index} className="score-cell">
            <IconScoreCell team={entry.team} score={entry.score} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerScoreList;

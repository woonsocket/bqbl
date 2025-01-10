import React from "react";

import PropTypes from "prop-types";

import IconScoreCell from "../IconScoreCell/icon-score-cell";
import ScoreValue from "../ScoreValue/score-value";
import styles from './PlayerScoreList.module.css';

PlayerScoreList.propTypes = {
  label: PropTypes.string.isRequired,
  // An array of {team: string, score: number} objects.
  entries: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number,
};




// A PlayerScoreList is a component representing a collection of scores for a
// player. The player chose to play some teams. Each team has a score, and the
// player's total score is the sum of those teams' scores.
function PlayerScoreList(props) {
  return (
    <div className={styles.scoreRow}>
      <div className={styles.labelCell}>{props.label}</div>
      <div className={styles.scoreCells}>
        <div className={styles.teamScoreCells}>
          {props.entries.map((entry, index) => (
            <div key={index} className={styles.scoreCell}>
              <IconScoreCell team={entry.team} score={entry.score} />
            </div>
          ))}
        </div>
        {props.total !== undefined && (
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total:</span>
            <ScoreValue score={props.total} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerScoreList;

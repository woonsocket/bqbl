import React from 'react';

import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';

import IconScoreCell from '../IconScoreCell/icon-score-cell';
import ScoreValue from '../ScoreValue/score-value';

PlayerScoreList.propTypes = {
  label: PropTypes.string.isRequired,
  // An array of {team: string, score: number} objects.
  entries: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number,
};

const useStyles = makeStyles({
  scoreRow: {
    display: 'flex',
    margin: '4px 0px',
  },
  labelCell: {
    minWidth: '70px',
    fontSize: '1rem',
    textAlign: 'left',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    verticalAlign: 'top',
  },
  scoreCells: {
    display: 'flex',
    flexDirection: 'column',
  },
  teamScoreCells: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scoreCell: {
    minWidth: '50px',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
});

// A PlayerScoreList is a component representing a collection of scores for a
// player. The player chose to play some teams. Each team has a score, and the
// player's total score is the sum of those teams' scores.
function PlayerScoreList(props) {
  const classes = useStyles();

  return (
    <div className={classes.scoreRow}>
      <div className={classes.labelCell}>{props.label}</div>
      <div className={classes.scoreCells}>
        <div className={classes.teamScoreCells}>
          {props.entries.map((entry, index) => (
            <div key={index} className={classes.scoreCell}>
              <IconScoreCell team={entry.team} score={entry.score} />
            </div>
          ))}
        </div>
        {props.total !== undefined && (
          <div>
            <span className={classes.totalLabel}>Total:</span>&nbsp;
            <ScoreValue score={props.total} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerScoreList;

import PropTypes from 'prop-types';
import React from 'react';

import ScoreValue from '../ScoreValue/score-value';
import TeamIcon from '../TeamIcon/team-icon';
import styles from './IconScoreCell.module.css'

IconScoreCell.propTypes = {
  team: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
}

IconScoreCell.defaultProps = {
  team: '',
  score: 0
};

function IconScoreCell(props) {
  return (
    <div className={styles.outer}>
      <TeamIcon team={props.team} width='30px' />
      <span className={styles.cell}>
        <ScoreValue score={props.score} />
      </span>
    </div>
  );
}
export default IconScoreCell;

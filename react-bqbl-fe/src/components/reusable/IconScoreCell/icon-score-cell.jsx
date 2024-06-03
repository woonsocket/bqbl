import React from 'react';

import ScoreValue from '../ScoreValue/score-value';
import TeamIcon from '../TeamIcon/team-icon';
import styles from './IconScoreCell.module.css'


function IconScoreCell({team = '', score = 0}) {
  return (
    <div className={styles.outer}>
      <TeamIcon team={team} width='30px' />
      <span className={styles.cell}>
        <ScoreValue score={score} />
      </span>
    </div>
  );
}
export default IconScoreCell;

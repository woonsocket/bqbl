import React from 'react';
import styles from './IconAndName.module.css'

import TeamIcon from '../TeamIcon/team-icon';


function IconAndName({team, width='30px'}) {
  return (
    <div className={styles.outer}>
      <TeamIcon team={team} width={width} />
      <div className={styles.cell}>{team}</div>
    </div>
  );
}
export default IconAndName;

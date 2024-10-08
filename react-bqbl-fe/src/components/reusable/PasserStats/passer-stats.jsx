import React from 'react';

import ScoreValue from '../ScoreValue/score-value';
import TeamIcon from '../TeamIcon/team-icon';

import PropTypes from "prop-types";

import badBadge from './bad.png';
import styles from "./PasserStats.module.css";

PasserStats.propTypes = {
  /**
   * An object describing the passer and their stats.
   * {'name': string, 'isBad': boolean, 'stats': object}
   */
  passer: PropTypes.object.isRequired,
  /** The passer's team abbreviation. */
  teamId: PropTypes.string,
};

function PasserStats(props) {
  const {cmp, att, netyds, int, fuml} = props.passer.stats;
  const {isBad, isBenched} = props.passer;
  const turnovers = int + fuml;
  return (
    <div className={styles.passer}>
      <div>
        <div className={styles.passerName}>
          {props.passer.name}
          {props.teamId && ` (${props.teamId})`}
        </div>
        <div className={styles.statLine}>
          {
            [
              `${cmp}/${att}`,
              `${netyds} yd`,
              `${turnovers} turnover` + (turnovers != 1 ? 's' : ''),
            ].join(', ')
          }
        </div>
      </div>
      {isBenched && <div className={styles.textBadge}>
        BENCHED
      </div>}
      {(isBad && !isBenched) && <div>
        <img className={styles.badge} src={badBadge} alt="BAD" />
      </div>}
    </div>
  );
}

export default PasserStats;

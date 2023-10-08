import PropTypes from 'prop-types';
import React from 'react';
import styles from './IconAndName.module.css'

import TeamIcon from '../TeamIcon/team-icon';

IconAndName.propTypes = {
  team: PropTypes.string.isRequired,
  width: PropTypes.string,
}

IconAndName.defaultProps = {
  width: '30px',
};


function IconAndName(props) {
  return (
    <div className={styles.outer}>
      <TeamIcon team={props.team} width={props.width} />
      <div className={styles.cell}>{props.team}</div>
    </div>
  );
}
export default IconAndName;

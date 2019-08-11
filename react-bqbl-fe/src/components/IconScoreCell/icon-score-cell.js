import React from 'react';
import PropTypes from 'prop-types';

import TeamIcon from '../reusable/TeamIcon/team-icon'
import './icon-score-cell.css';

IconScoreCell.propTypes = {
  team: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
}

function IconScoreCell(props) {
  return (
    <div className="outer">
      <TeamIcon team={props.team} width='20px' />
      <span className="cell">
        {props.score}
      </span>
    </div>
  )
}
export default IconScoreCell;
